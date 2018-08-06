# Simplecel

[![PyPI version shields.io](https://img.shields.io/pypi/v/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)
[![PyPI license](https://img.shields.io/pypi/l/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)
[![PyPI pyversions](https://img.shields.io/pypi/pyversions/simplecel.svg)](https://pypi.python.org/pypi/simplecel/)

Offline Excel-like app with no formula conversion, but with image/markdown/HTML support.

## Features

- Custom renderers beyond https://docs.handsontable.com/5.0.0/demo-custom-renderers.html -- 'markdownRenderer', 'imageRenderer'. -- Can render images with URL's alone. No need for `<img src="" />`.
- Always good word wrap support and auto-row-height due to Handsontable.
- Absolutely no formula conversion. Things like `=1+2`, `OCT2`, `11-14` will never get converted.
- Max column width can be specified (default: 200).

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
  --config TEXT     Please input the path to CONFIG yaml, as defined in pyhandsontable.
  --host TEXT
  --port INTEGER
  --debug
  --help          Show this message and exit.
$ simplecel example.xlsx
```

In this case, `example.config.yaml` is also auto-loaded, although you can specify `*.config.yaml` directly in `--config`. If the file doesn't exist, it will be auto-generated on Save.

## Example of `example.config.yaml`

```yaml
simplecel:
  _default: {allowInsertCol: false, hasHeader: true, renderers: markdownRenderer}
  hanzi:
    allowInsertCol: false
    colHeaders: true
    colWidths: [67, 197, 200, 71, 90, 106, 66, 60, 59, 200]
    contextMenu: true
    dropdownMenu: true
    filters: true
    hasHeader: true
    manualColumnResize: true
    manualRowResize: true
    maxColWidth: 200
    renderers: markdownRenderer
    rowHeaders: true
```

One-stop settings for all tables are defined in `_default`.

Note that the `defaultConfig` in the Javascript are

```javascript
let defaultConfig = {
  rowHeaders: true,
  colHeaders: true,
  manualRowResize: true,
  manualColumnResize: true,
  // fixedRowsTop: 1,
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
  maxColWidth: 200,
  hasHeader: false,
  // renderers: 'markdownRenderer',
  allowInsertCol: true
};
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

- Wrap this app in PyQt / PyFlaDesk for GUI end-users (maybe later, as PyFlaDesk of now is still buggy).

## Screenshots

<img src="https://raw.githubusercontent.com/patarapolw/simplecel/master/screenshots/0.png" />
<img src="https://raw.githubusercontent.com/patarapolw/simplecel/master/screenshots/1.png" />
