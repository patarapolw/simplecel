"""
Tweaked from https://github.com/smoqadam/PyFladesk/blob/master/pyfladesk/__init__.py
"""

import sys
from PyQt5.QtCore import QThread, QUrl, Qt
from PyQt5.QtWebEngineWidgets import QWebEnginePage, QWebEngineView
from PyQt5.QtGui import QDesktopServices, QIcon
from PyQt5.QtWidgets import QApplication, QMainWindow, QFileDialog

from pathlib import Path
from configparser import ConfigParser
from urllib.parse import quote
import socket

from .dir import user_config_path


class ApplicationThread(QThread):
    def __init__(self, application, port=5000):
        super(ApplicationThread, self).__init__()
        self.application = application
        self.port = port

    def __del__(self):
        self.wait()

    def run(self):
        self.application.run(port=self.port, threaded=True)


class WebPage(QWebEnginePage):
    def __init__(self, root_url):
        super(WebPage, self).__init__()
        self.root_url = root_url

    def home(self):
        self.load(QUrl(self.root_url))

    def acceptNavigationRequest(self, url, kind, is_main_frame):
        """Open external links in browser and internal links in the webview"""
        ready_url = url.toEncoded().data().decode()
        is_clicked = kind == self.NavigationTypeLinkClicked
        if is_clicked and self.root_url not in ready_url:
            QDesktopServices.openUrl(url)
            return False
        return super(WebPage, self).acceptNavigationRequest(url, kind, is_main_frame)


class MainWindow(QMainWindow):
    pass


def init_gui(application, port=5000, width=300, height=400,
             window_title="PyFladesk", icon="appicon.png", argv=None):
    if argv is None:
        argv = sys.argv

    if port == 0:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('localhost', 0))
        port = sock.getsockname()[1]
        sock.close()

    # Application Level
    qtapp = QApplication(argv)
    webapp = ApplicationThread(application, port)
    webapp.start()
    qtapp.aboutToQuit.connect(webapp.terminate)

    # Main Window Level
    window = MainWindow()
    window.resize(width, height)
    window.setWindowTitle(window_title)
    window.setWindowIcon(QIcon(icon))

    # Prompt to load a file first, except file history exists
    config = ConfigParser()

    root = ''
    settings_file = Path(user_config_path('settings.ini'))
    if settings_file.exists():
        config.read(str(settings_file))
        root = str(Path(config['History']['Last opened']).parent)
    else:
        config.add_section('History')

    options = QFileDialog.Options()
    filename = None
    if not filename:
        file_formats = [
            "Supported formats (*.pyexcel.json *.json *.xlsx *.yaml)",
            "All files (*.*)"
        ]
        filename, _ = QFileDialog.getOpenFileName(window,
                                                  "Open file", root,
                                                  ";;".join(file_formats),
                                                  options=options)

    config['History']['Last opened'] = filename
    with settings_file.open('w') as f:
        config.write(f)

    # WebView Level
    webView = QWebEngineView(window)
    window.setCentralWidget(webView)

    # WebPage Level
    page = WebPage('http://localhost:{}'.format(port))
    url = page.root_url + '/{}'.format(quote(filename, safe=''))
    print(url)

    page.load(QUrl(url))
    webView.setPage(page)

    window.show()
    return qtapp.exec_()
