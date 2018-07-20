import os
import sys
from appdirs import AppDirs

PROJECT_NAME = 'SimpleCel'


def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)


def static_path(filename):
    return os.path.join(resource_path('static'), filename)


def user_config_path(filename):
    user_config_dir = AppDirs(PROJECT_NAME).user_config_dir
    if not os.path.exists(user_config_dir):
        os.mkdir(user_config_dir)

    return os.path.join(user_config_dir, filename)
