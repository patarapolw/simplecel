from flask import render_template

import pyexcel
import os
import json
from pathlib import Path

from . import app


@app.route('/')
def open_file():
    filename_path = Path(os.environ.get('FILENAME', ''))
    if filename_path.exists():
        data = pyexcel.get_book_dict(file_name=str(filename_path))
    else:
        data = dict()

    config_path = Path(os.environ.get('CONFIG', ''))
    if config_path.is_dir():
        os.environ['META'] = str(config_path.joinpath(filename_path.name).with_suffix('.config.json'))
        config = dict()
    elif config_path.exists():
        config = json.loads(config_path.read_text())
    else:
        config = dict()

    return render_template('index.html',
                           title=str(filename_path), data=data, config=config)
