from .browser import init_gui
from . import app


def main():
    init_gui(app, port=0, width=800, height=600,
             window_title="SimpleCel")


if __name__ == '__main__':
    main()
