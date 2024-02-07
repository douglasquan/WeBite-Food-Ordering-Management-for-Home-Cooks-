from flask import *
import requests
import os
app = Flask(__name__)


@app.route('/chef', methods=['POST', 'GET', 'DELETE', 'PUT'])
def chef():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['chef'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['chef'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['chef'], json=r)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.get_json()
        response = requests.put(routes['chef'], json=r)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/order', methods=['POST', 'GET', 'DELETE', 'PUT'])
def order():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['orders'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['orders'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['orders'], json=r)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.get_json()
        response = requests.put(routes['chef'], json=r)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/customer', methods=['POST', 'GET', 'DELETE', 'PUT'])
def user():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['customer'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        print(request.endpoint)
        print(request.url)
        response = requests.post(routes['customer'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.get_json()
        response = requests.delete(routes['customer'], json=r)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.get_json()
        response = requests.put(routes['customer'], json=r)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


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

        customer_ip = config_data['CustomerService']['ip']
        customer_port = config_data['CustomerService']['port']

        chef_ip = config_data['ChefService']['ip']
        chef_port = config_data['ChefService']['port']
    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "customer": f"http://{customer_ip}:{customer_port}/customer",
        "chef": f"http://{chef_ip}:{chef_port}/chef",
        "orders": f"http://{orders_ip}:{orders_port}/order"
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
