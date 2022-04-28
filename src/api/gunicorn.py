import os
import configparser
import multiprocessing

from dotenv import load_dotenv
load_dotenv()

config = configparser.ConfigParser()
config.read('config/config.ini')
ACCESS_LOG_PATH = config['gunicorn']['Accesslogpath']
ERROR_LOG_PATH = config['gunicorn']['Errorlogpath']


name = "gunicorn config for FastAPI"
accesslog = ACCESS_LOG_PATH
errorlog = ERROR_LOG_PATH

bind = "0.0.0.0:8000"

worker_class = "uvicorn.workers.UvicornWorker"
workers = multiprocessing.cpu_count () * 2 + 1
worker_connections = 1024
backlog = 2048
max_requests = 5120
timeout = 120
keepalive = 2

debug = os.environ.get("debug", "false") == "true"
reload = debug
preload_app = False
daemon = False