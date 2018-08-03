import sys

from flask import Flask
from flask_restful import Api

from .dir import resource_path


if getattr(sys, 'frozen', False):
    template_folder = resource_path('templates')
    static_folder = resource_path('static')
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
else:
    app = Flask(__name__)

api = Api(app)

from .views import *
from .resources import *
