from flask import render_template

import pyexcel
import os
import json
from pathlib import Path

from . import app


@app.route('/')
def open_file():
    filename_path = Path(os.environ.get('FILENAME', 'simplecel.xlsx'))
    if filename_path.exists():
        data = pyexcel.get_book_dict(file_name=str(filename_path))
    else:
        data = dict(Sheet1=[[''] * 5] * 5)

    config_path = Path(os.environ.get('CONFIG', str(filename_path.parent)))
    if config_path.is_dir():
        config_path = config_path.joinpath(filename_path.name).with_suffix('.config.json')
        os.environ['CONFIG'] = str(config_path)

    if config_path.exists():
        config = json.loads(config_path.read_text())
    else:
        config = dict()

    os.environ['FILENAME'] = str(filename_path)
    os.environ['CONFIG'] = str(config_path)

    return render_template('index.html',
                           title=str(filename_path), data=data, config=config)
