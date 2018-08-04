# Simplecel

[![Build Status](https://travis-ci.org/patarapolw/simplecel.svg?branch=master)](https://travis-ci.org/patarapolw/simplecel)
[![PyPI version shields.io](https://img.shields.io/pypi/v/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)
[![PyPI license](https://img.shields.io/pypi/l/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)
[![PyPI pyversions](https://img.shields.io/pypi/pyversions/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)

Excel workbook with no formula conversion, but with markdown/HTML support.

## Installation

```commandline
pip install simplecel
pip install pyexcel-xlsx  # Or any other packages defined in pyexcel GitHub
```

For what you need to install other than `simplecel`, please see https://github.com/pyexcel/pyexcel#available-plugins

## Usage

```commandline
$ simplecel --help
Usage: simplecel [OPTIONS] FILENAME

Options:
  --config TEXT     Please input the path to CONFIG json, as defined in pyhandsontable.
  --host TEXT
  --port INTEGER
  --debug
  --help          Show this message and exit.
$ simplecel example.xlsx
```

## Example of `filename.config.json`

```json
{
  "hanzi": {
    "hasHeader": true,
    "renderers": "markdownRenderer"
  },
  "vocab": {
    "hasHeader": true,
    "renderers": "markdownRenderer"
  },
  "sentences": {
    "hasHeader": true,
    "renderers": "markdownRenderer"
  }
}
```

Note that the `defaultConfig` are

```javascript
{
  rowHeaders: true,
  colHeaders: true,
  manualRowResize: true,
  manualColumnResize: true,
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
  maxColWidth: 200,
  hasHeader: false
}
```

`renderers` can also accept something like

```python
{
    1: "markdownRenderer",
    2: "markdownRenderer"
}
```

Some other acceptable configs are defined in https://docs.handsontable.com/5.0.0/Options.html

## Plan

- Add API for saving and editing data (should be easy-to-implement).
- Wrap this app in PyQt / PyFlaDesk for GUI end-users (maybe later, as PyFlaDesk of now is still buggy).

## Screenshots

<img src="https://raw.githubusercontent.com/patarapolw/simplecel/master/screenshots/0.png" />
