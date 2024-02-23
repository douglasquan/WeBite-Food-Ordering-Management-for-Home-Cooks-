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
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['chef'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['chef'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/order', methods=['POST', 'GET', 'DELETE', 'PUT'])
def order():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['order'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['order'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['order'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['order'] + f'?{r}'
        response = requests.put(new_url, json=params)
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
        #print(r)
        new_url = routes['customer']
        if r['command'] == 'login':
            data = request.query_string.decode()
            #print(data)
            new_url = routes['customer'] + f'?{data}'
        #r = request.query_string.decode()
        #print(request.endpoint)
        #print(request.url)
        response = requests.post(new_url, json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['customer'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['customer'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/meal', methods=['POST', 'GET', 'DELETE', 'PUT'])
def meal():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['meal'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['meal'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['meal'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['meal'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/food', defaults={'path': ''})
@app.route('/food/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def food(path):
    if request.method == 'POST' and path == "order":
        r = request.get_json()
        #full_url = f"http://127.0.0.1:14004/food/order"
        response = requests.post(routes['food']+'/order', json=r)
        return response.json(), response.status_code
    else:
        return jsonify({"error": "Method not supported by the gateway"}), 404

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
        meal_ip = config_data['MealService']['ip']
        meal_port = config_data['MealService']['port']
        food_ip = config_data['FoodService']['ip']
        food_port = config_data['FoodService']['port']
    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "customer": f"http://{customer_ip}:{customer_port}/customer",
        "chef": f"http://{chef_ip}:{chef_port}/chef",
        "order": f"http://{orders_ip}:{orders_port}/order",
        "meal": f"http://{meal_ip}:{meal_port}/meal",
        "food": f"http://{food_ip}:{food_port}/food"
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
