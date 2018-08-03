#!/usr/bin/env python

from simplecel import app

if __name__ == '__main__':
    app.run(
        host='localhost',
        # host='192.168.1.13',
        port=7500,
        debug=True
    )
