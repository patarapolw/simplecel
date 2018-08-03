#!/usr/bin/env python

from simplecel import app
from dotenv import load_dotenv

if __name__ == '__main__':
    load_dotenv()

    app.run(
        host='localhost',
        # host='192.168.1.13',
        port=7500,
        debug=True
    )
