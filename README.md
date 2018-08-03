# Simplecel

Excel workbook with no formula conversion, but with markdown/HTML support.

## Installation

```commandline
pip install simplecel
pip install pyexcel-xls  # Or any other packages defined in pyexcel GitHub
```

## Usage

```commandline
$ simplecel --help
Usage: simplecel [OPTIONS] FILENAME

Options:
  --meta TEXT     Please input the path to META json, as defined in pyexcel-
                  export.
  --host TEXT
  --port INTEGER
  --debug
  --help          Show this message and exit.
$ simplecel example.xlsx
```

## Plan

- Add API for saving and editing data (should be easy-to-implement).
- Wrap this app in PyQt / PyFlaDesk for GUI end-users (maybe later, as PyFlaDesk of now is still buggy).

## Screenshots

<img src="https://raw.githubusercontent.com/patarapolw/simplecel/master/screenshots/0.png" />
