from flask import *
import sqlite3
import requests
import os

app = Flask(__name__)


@app.route('/order', methods='POST')
def handle_post():
    data = request.get_json()
    try:
        command = data["command"]
    except ValueError:
        return 400, "Invalid Command"
    if command == 'create':
        print(data)
    elif command == 'update':
        # not yet implemented for Sprint 1
        return 404, "Not yet implemented"


@app.route('/order', methods='GET')
def handle_get():
    data = request.get_json()

@app.route('/order', methods='DELETE')
def handle_delete():
    data = request.get_json()


if __name__ == "__main__":
    database = sqlite3.connect("order.db")
    app.run(debug = True)
