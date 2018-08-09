import click

from . import open


@click.command()
@click.argument('filename')
@click.option('--config', help='Please input the path to CONFIG yaml, as defined in pyhandsontable.')
@click.option('--host', default='localhost')
@click.option('--port', default=7500)
@click.option('--debug', is_flag=True)
def cli(filename, config, host, port, debug):
    open(filename, config, host, port, debug)


if __name__ == '__main__':
    cli()
