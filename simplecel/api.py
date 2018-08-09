from flask import request, Response
import pyexcel
import os
import ruamel.yaml as yaml
import json
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

    content = request.get_json()

    if filename_path.suffix in ('.csv', '.tsv'):
        pyexcel.save_as(
            array=list(content['data'].values())[0],
            dest_file_name=str(filename_path)
        )
    else:
        try:
            pyexcel_export.save_data(str(filename_path), content['data'])
        except NameError:
            pyexcel.save_book_as(
                bookdict=content['data'],
                dest_file_name=str(filename_path)
            )

    try:
        config = json.loads(os.environ.get('CONFIG', ''))
        assert isinstance(config, dict)
    except (json.decoder.JSONDecodeError, AssertionError):
        if 'CONFIG' in os.environ:
            config_path = Path(os.environ['CONFIG'])
            if config_path.exists():
                config = yaml.safe_load(config_path.read_text())
            else:
                config = dict()

            config['simplecel'] = content['config']

            config_path.write_text(yaml.safe_dump(config, allow_unicode=True))

    return Response(status=200)
