import os
import webbrowser
import click

from . import app


@click.command()
@click.argument('filename')
@click.option('--config', default='', help='Please input the path to CONNFIG json, as defined in pyhandsontable.')
@click.option('--host', default='localhost')
@click.option('--port', default=7500)
@click.option('--debug', is_flag=True)
def load_excel(filename, config, host, port, debug):
    os.environ['FILENAME'] = filename
    os.environ['CONFIG'] = config

    app.run(
        host=host,
        port=port,
        debug=debug
    )
    webbrowser.open('http://{}:{}'.format(host, port))


if __name__ == '__main__':
    load_excel()
