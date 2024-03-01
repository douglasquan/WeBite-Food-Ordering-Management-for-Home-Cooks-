from flask import *
import requests
import os

app = Flask(__name__)


@app.route("/user/<role>", methods=['POST', 'GET', 'DELETE', 'PUT'])
def user(role):
    print(role)
    if request.method == 'GET':
        r = request.query_string.decode()
        print(r)
        new_url = routes['user'] + f'{role}?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['user'] + f'{role}', json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['user'] + f'{role}?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['user'] + f'{role}?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route("/user", methods=['POST', 'GET', 'DELETE', 'PUT'])
def account():
    if request.method == 'GET':
        r = request.query_string.decode()
        print(r)
        new_url = routes['user'] + f'account?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['user'] + 'account', json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['user'] + 'account'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['user'] + 'account'
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


# @app.route('/customer', methods=['POST', 'GET', 'DELETE', 'PUT'])
# def user():
#     if request.method == 'GET':
#         r = request.query_string.decode()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.get(new_url)
#         return response.json(), response.status_code
#     elif request.method == 'POST':
#         r = request.get_json()
#         # print(r)
#         new_url = routes['customer']
#         if r['command'] == 'login':
#             data = request.query_string.decode()
#             # print(data)
#             new_url = routes['customer'] + f'?{data}'
#         # r = request.query_string.decode()
#         # print(request.endpoint)
#         # print(request.url)
#         response = requests.post(new_url, json=r)
#         return response.json(), response.status_code
#     elif request.method == 'DELETE':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.delete(new_url, json=params)
#         return response.json(), response.status_code
#     elif request.method == 'PUT':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.put(new_url, json=params)
#         return response.json(), response.status_code
#     else:
#         return "Bad Request", 400


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
        meal_ip = config_data['MealService']['ip']
        meal_port = config_data['MealService']['port']
    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "user": f"http://{user_ip}:{user_port}/",
        "order": f"http://{orders_ip}:{orders_port}/order",
        "meal": f"http://{meal_ip}:{meal_port}/meal"
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
