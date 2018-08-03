import os
import webbrowser
import click

from . import app


@click.command()
@click.argument('filename')
@click.option('--meta', default='', help='Please input the path to META json, as defined in pyexcel-export.')
@click.option('--host', default='localhost')
@click.option('--port', default=7500)
@click.option('--debug', is_flag=True)
def load_excel(filename, meta, host, port, debug):
    os.environ['FILENAME'] = filename
    os.environ['META'] = meta

    app.run(
        host=host,
        port=port,
        debug=debug
    )
    webbrowser.open('http://{}:{}'.format(host, port))


if __name__ == '__main__':
    load_excel()
