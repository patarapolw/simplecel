from flask import request, Response
import pyexcel
import os
import ruamel.yaml as yaml
from pathlib import Path

try:
    import pyexcel_export
except ModuleNotFoundError:
    try:
        import pyexcel_xlsxwx as pyexcel_export
    except ModuleNotFoundError:
        pass

from . import app


@app.route('/api/save', methods=['POST'])
def save():
    filename_path = Path(os.environ['FILENAME'])
    config_path = Path(os.environ['CONFIG'])

    content = request.get_json()

    try:
        pyexcel_export.save_data(str(filename_path), content['data'])
    except NameError:
        pyexcel.save_book_as(
            bookdict=content['data'],
            dest_file_name=str(filename_path)
        )

    config = yaml.safe_load(config_path.read_text())
    config['simplecel'] = content['config']

    config_path.write_text(yaml.safe_dump(config, allow_unicode=True))

    return Response(status=200)
