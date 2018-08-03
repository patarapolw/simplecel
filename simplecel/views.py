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

    meta_path = Path(os.environ.get('META', ''))
    if meta_path.is_dir():
        os.environ['META'] = str(meta_path.joinpath(filename_path.name).with_suffix('.json'))
        meta = dict()
    elif meta_path.exists():
        meta = json.loads(meta_path.read_text())
    else:
        meta = dict()

    return render_template('index.html',
                           title=str(filename_path), data=data, meta=meta)
