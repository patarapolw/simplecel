import webbrowser
from threading import Thread
from time import sleep


def open_browser_tab(url):
    def _open_tab():
        sleep(1)
        webbrowser.open_new_tab(url)

    thread = Thread(target=_open_tab)
    thread.daemon = True
    thread.start()
