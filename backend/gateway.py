from flask import *
import requests
import os

from requests import RequestException

app = Flask(__name__)


@app.route('/user/<role>', methods=['POST'])
@app.route('/user/<role>/<int:user_id>', methods=['GET', 'DELETE', 'PUT'])
def user(role=None, user_id=None):
    try:
        if role is None:
            abort(400, description="role(chef or customer) is required for requests")
        if request.method == 'POST':
            response = requests.post(f"{routes['user']}/{role}", json=request.json)
        else:
            if user_id is None:
                abort(400, description="user_id is required for GET, PUT, DELETE requests")

            if request.method == 'GET':
                print(user_id)
                if not user_id:
                    abort(400, description="user_id query parameter is required for GET request")
                response = requests.get(f"{routes['user']}/{role}/{user_id}")

            elif request.method == 'PUT':
                if not user_id:
                    abort(400, description="user_id query parameter is required for PUT request")
                response = requests.put(f"{routes['user']}/{role}/{user_id}", json=request.json)

            elif request.method == 'DELETE':
                if not user_id:
                    abort(400, description="user_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['user']}/{role}/{user_id}")

        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to UserService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


@app.route('/user', methods=['POST'])
@app.route('/user/<int:user_id>', methods=['GET', 'DELETE', 'PUT'])
def account(user_id=None):
    try:
        if request.method == 'POST':
            response = requests.post(routes['user'], json=request.json)
        else:
            if user_id is None:
                abort(400, description="user_id is required for GET, PUT, DELETE requests")

            if request.method == 'GET':
                print(user_id)
                if not user_id:
                    abort(400, description="user_id query parameter is required for GET request")
                response = requests.get(f"{routes['user']}/{user_id}")

            elif request.method == 'PUT':
                if not user_id:
                    abort(400, description="user_id query parameter is required for PUT request")
                response = requests.put(f"{routes['user']}/{user_id}", json=request.json)

            elif request.method == 'DELETE':
                if not user_id:
                    abort(400, description="user_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['user']}/{user_id}")

        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to UserService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error



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



@app.route('/meal', defaults={'path': ''})
@app.route('/meal/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def meal(path):
    if request.method == 'GET' and path != 'chef':
        r = request.query_string.decode()
        new_url = routes['meal'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'GET' and path == 'chef':
        r = request.query_string.decode()
        new_url = routes['meal'] + '/chef'+ f'?{r}'
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


@app.route('/address', methods=['POST', 'GET', 'DELETE', 'PUT'])
def address():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['address'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['address'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['address'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['address'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400


@app.route('/review', methods=['POST', 'GET', 'DELETE', 'PUT'])
def review():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['review'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        r = request.get_json()
        response = requests.post(routes['review'], json=r)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['review'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['review'] + f'?{r}'
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
    # elif request.method == 'GET' and path == "menu":
    #     print("1")
    #     r = request.query_string.decode()
    #     new_url = routes['food']+'/menu'+f'?{r}'
    #     response = requests.get(new_url)
    #     return response.json(), response.status_code
    else:
        return jsonify({"error": "Method not supported by the gateway"}), 404


if __name__ == "__main__":
    # getting config
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)

    # getting ip for everything
    try:
        orders_ip = config_data['OrderService']['ip']
        orders_port = config_data['OrderService']['port']
        
        address_ip = config_data['AddressService']['ip']
        address_port = config_data['AddressService']['port']
        
        review_ip = config_data['ReviewService']['ip']
        review_port = config_data['ReviewService']['port']
        
        user_ip = config_data['UserService']['ip']
        user_port = config_data['UserService']['port']
        
        meal_ip = config_data['MealService']['ip']
        meal_port = config_data['MealService']['port']
        
        food_ip = config_data['FoodService']['ip']
        food_port = config_data['FoodService']['port']

    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "user": f"http://{user_ip}:{user_port}/user",
        "order": f"http://{orders_ip}:{orders_port}/order",
        "meal": f"http://{meal_ip}:{meal_port}/meal",
        "address": f"http://{address_ip}:{address_port}/address",
        "review": f"http://{review_ip}:{review_port}/review",
        "food": f"http://{food_ip}:{food_port}/food"
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
