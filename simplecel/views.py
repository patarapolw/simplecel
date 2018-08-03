from flask import render_template

import pyexcel_export
from urllib.parse import unquote
import json

from . import app


@app.route('/')
def index():
    return 'Please enter the URL-encoded path in the URL (http://localhost:PORT/<path:filename>).'


@app.route('/<path:filename>')
def open_file(filename):
    filename = '/' + unquote(filename)

    data, meta = pyexcel_export.get_data(in_file=filename)
    meta = json.loads(json.dumps(meta, default=lambda x: None))

    return render_template('index.html', data=data, meta=meta)
