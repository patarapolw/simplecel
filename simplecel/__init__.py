from flask import Flask

from .util import open_browser_tab

app = Flask(__name__)

from .views import *
from .api import *


def open(filename, config, host, port, debug):
    os.environ['FILENAME'] = filename

    if isinstance(config, dict):
        os.environ['CONFIG'] = json.dumps(config)
    elif config:
        os.environ['CONFIG'] = config

    open_browser_tab('http://{}:{}'.format(host, port))

    app.run(
        host=host,
        port=port,
        debug=debug
    )
