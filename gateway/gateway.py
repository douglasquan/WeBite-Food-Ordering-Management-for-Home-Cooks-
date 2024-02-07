from flask import *
import requests
import os
app = Flask(__name__)


@app.route('/chef', methods=['POST', 'GET', 'DELETE'])
def chef():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['chef'] + f'?{r}'
        response = requests.get(new_url)
        return response.status_code, response.json()
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['chef'], json=r)
        return response.status_code, response.json()
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['chef'], json=r)
        return response.status_code, response.json()
    else:
        return 400,"Bad Request"


@app.route('/order', methods=['POST', 'GET', 'DELETE'])
def order():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['orders'] + f'?{r}'
        response = requests.get(new_url)
        return response.status_code, response.json()
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['orders'], json=r)
        return response.status_code, response.json()
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['orders'], json=r)
        return response.status_code, response.json()
    else:
        return 400,"Bad Request"


@app.route('/user', methods=['POST', 'GET', 'DELETE'])
def user():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['user'] + f'?{r}'
        response = requests.get(new_url)
        return response.status_code, response.json()
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['user'], json=r)
        return response.status_code, response.json()
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['user'], json=r)
        return response.status_code, response.json()
    else:
        return 400,"Bad Request"


if __name__ == "__main__":
    # getting config
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(os.path.join(current_dir, os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        orders_ip = config_data['OrderService']['ip']
        orders_port = config_data['OrderService']['port']

        user_ip = config_data['UserService']['ip']
        user_port = config_data['UserService']['port']

        chef_ip = config_data['ChefService']['ip']
        chef_port = config_data['ChefService']['port']
    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "user": f"http://{user_ip}:{user_port}/user",
        "chef": f"http://{chef_port}:{chef_ip}/chef",
        "orders": f"http://{orders_port}:{orders_ip}/orders"
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
