import os
import click

from . import app
from .util import open_browser_tab


@click.command()
@click.argument('filename')
@click.option('--config', help='Please input the path to CONFIG yaml, as defined in pyhandsontable.')
@click.option('--host', default='localhost')
@click.option('--port', default=7500)
@click.option('--debug', is_flag=True)
def load_excel(filename, config, host, port, debug):
    os.environ['FILENAME'] = filename

    if config:
        os.environ['CONFIG'] = config

    open_browser_tab('http://{}:{}'.format(host, port))

    app.run(
        host=host,
        port=port,
        debug=debug
    )


if __name__ == '__main__':
    load_excel()
