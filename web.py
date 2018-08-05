#!/usr/bin/env python

from dotenv import load_dotenv

from simplecel import app
from simplecel.util import open_browser_tab


def load(host, port):
    load_dotenv()

    open_browser_tab('http://{}:{}'.format(host, port))
    app.run(
        host=host,
        port=port,
        debug=True
    )


if __name__ == '__main__':
    load('localhost', 7500)
