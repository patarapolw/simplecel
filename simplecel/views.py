from flask import render_template

import pyexcel
import os
import ruamel.yaml as yaml
import json
from pathlib import Path
import csv

from . import app


@app.route('/')
def open_file():
    filename_path = Path(os.environ.get('FILENAME', 'simplecel.xlsx'))
    if filename_path.exists():
        if filename_path.suffix in ('.csv', '.tsv'):
            data = dict(Sheet1=[])
            if filename_path.suffix == '.tsv':
                delimiter = '\t'
            else:
                delimiter = ','
            with filename_path.open('r', encoding='utf8') as f:
                reader = csv.reader(f, delimiter=delimiter)
                for row in reader:
                    data['Sheet1'].append(row)
        else:
            data = pyexcel.get_book_dict(file_name=str(filename_path))
    else:
        data = dict(Sheet1=[[''] * 5] * 5)

    try:
        config = json.loads(os.environ.get('CONFIG', ''))
        assert isinstance(config, dict)
    except (json.decoder.JSONDecodeError, AssertionError):
        config_path = Path(os.environ.get('CONFIG', str(filename_path.parent)))
        if config_path.is_dir():
            config_path = config_path.joinpath(filename_path.name).with_suffix('.config.yaml')
            os.environ['CONFIG'] = str(config_path)

        if config_path.exists():
            config = yaml.safe_load(config_path.read_text()).get('simplecel', dict())
        else:
            config = dict()

        os.environ['CONFIG'] = str(config_path)

    os.environ['FILENAME'] = str(filename_path)

    return render_template('index.html',
                           title=str(filename_path), data=data, config=config)
