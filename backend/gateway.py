from flask import *
import requests
import os
from flask_cors import CORS

from requests import RequestException

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

@app.route('/user/chef/is-chef', methods=['GET'])
def is_chef():
    user_service_response = requests.get(f"{routes['user']}/chef/is-chef", cookies=request.cookies)
    response = make_response(jsonify(user_service_response.json()), user_service_response.status_code)
    for key, value in user_service_response.headers.items():
        response.headers[key] = value
    return response, response.status_code

@app.route('/user/register', methods=['POST'])
@app.route('/user/login', methods=['POST'])
@app.route('/user/logout', methods=['POST'])
@app.route('/user/@me', methods=['GET'])
def account():
    try:
        if request.method == 'POST':
            # Get the last part of the path (e.g., "register", "login", "logout")
            action = request.path.split('/')[-1]
            url = f"{routes['user']}/{action}"
            user_service_response = requests.post(url, json=request.json)
            # Create a response object from the Flask app
            response = make_response(jsonify(user_service_response.json()), user_service_response.status_code)

            # Forward all headers from the user service response
            for key, value in user_service_response.headers.items():
                # You may not want to forward all headers
                # if key.lower() not in ['content-length', 'content-type', 'content-encoding']:
                    response.headers[key] = value

        elif request.method == 'GET':
            user_service_response = requests.get(f"{routes['user']}/@me", cookies=request.cookies)
            # Create a response object from the Flask app
            response = make_response(jsonify(user_service_response.json()), user_service_response.status_code)
            # Forward all headers from the user service response
            for key, value in user_service_response.headers.items():
                # You may not want to forward all headers
                # if key.lower() not in ['content-length', 'content-type', 'content-encoding']:
                    response.headers[key] = value
        print(response.json)
        return response, response.status_code

    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to UserService.")  # 502 Bad Gateway
    except Exception as e:
        print(e)
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


@app.route('/user/<role>', methods=['POST'])
@app.route('/user/<role>/<int:user_id>', methods=['GET', 'DELETE', 'PUT'])
def user_role(role=None, user_id=None):
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
        print(response.json)
        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to UserService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


@app.route('/user', methods=['POST'])
@app.route('/user/<int:user_id>', methods=['GET', 'DELETE', 'PUT'])
def user(user_id=None):
    try:
        if request.method == 'POST':
            response = requests.post(routes['user'], json=request.json)
        else:
            if user_id is None:
                abort(400, description="user_id is required for GET, PUT, DELETE requests")

            if request.method == 'GET':
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

        print(response.json())
        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to UserService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


@app.route('/meal', methods=['POST'])
@app.route('/meal/chef/<int:chef_id>', methods=['GET'])
@app.route('/meal/<int:meal_id>', methods=['GET', 'DELETE', 'PUT'])
def meal(meal_id=None, chef_id=None):
    try:
        # print("meal request: ", request.json)
        if request.method == 'POST':
            response = requests.post(routes['meal'], json=request.json)
        else:

            if request.method == 'GET':
                if not meal_id and not chef_id:
                    abort(400, description="query parameter is required for GET request")
                if meal_id:
                    response = requests.get(f"{routes['meal']}/{meal_id}")
                if chef_id:
                    response = requests.get(f"{routes['meal']}/chef/{chef_id}")
                    for meal in response.json():
                        print(meal)
            elif meal_id is None:
                abort(400, description="meal_id is required for GET, PUT, DELETE requests")

            elif request.method == 'PUT':
                if not meal_id:
                    abort(400, description="meal_id query parameter is required for PUT request")
                response = requests.put(f"{routes['meal']}/{meal_id}", json=request.json)

            elif request.method == 'DELETE':
                if not meal_id:
                    abort(400, description="meal_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['meal']}/{meal_id}")
        print("meal response: ", response.json)
        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to MealService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


@app.route('/order', methods=['POST'])
@app.route('/order/chef/<int:chef_id>', methods=['GET'])
@app.route('/order/<int:order_id>', methods=['GET', 'DELETE', 'PUT'])
def order(order_id=None, chef_id=None):
    try:
        if request.method == 'POST':
            response = requests.post(routes['order'], json=request.json)
        else:
            if request.method == 'GET':
                if not order_id and not chef_id:
                    abort(400, description="query parameter is required for GET request")
                if order_id:
                    response = requests.get(f"{routes['order']}/{order_id}")
                if chef_id:
                    response = requests.get(f"{routes['order']}/chef/{chef_id}")
            elif order_id is None:
                abort(400, description="order_id is required for GET, PUT, DELETE requests")

            elif request.method == 'PUT':
                if not order_id:
                    abort(400, description="order_id query parameter is required for PUT request")
                response = requests.put(f"{routes['order']}/{order_id}", json=request.json)

            elif request.method == 'DELETE':
                if not order_id:
                    abort(400, description="order_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['order']}/{order_id}")

        print(response.json())
        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to OrderService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error



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


@app.route('/review', methods=['POST'])
@app.route('/review/meal/<int:meal_id>', methods=['GET'])
@app.route('/review/<int:review_id>', methods=['GET', 'DELETE', 'PUT'])
def review(review_id=None, meal_id=None):
    try:
        if request.method == 'POST':
            response = requests.post(routes['review'], json=request.json)
        else:
            if request.method == 'GET':
                if not review_id and not meal_id:
                    abort(400, description="query parameter is required for GET request")
                if review_id:
                    response = requests.get(f"{routes['review']}/{review_id}")
                if meal_id:
                    response = requests.get(f"{routes['review']}/meal/{meal_id}")
            elif review_id is None:
                abort(400, description="review_id is required for GET, PUT, DELETE requests")


            elif request.method == 'PUT':
                if not review_id:
                    abort(400, description="review_id query parameter is required for PUT request")
                response = requests.put(f"{routes['review']}/{review_id}", json=request.json)

            elif request.method == 'DELETE':
                if not review_id:
                    abort(400, description="review_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['review']}/{review_id}")

        print(response.json())
        return jsonify(response.json()), response.status_code
    except RequestException as e:
        abort(502, description="Bad Gateway. Error connecting to ReviewService.")  # 502 Bad Gateway
    except Exception as e:
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error



@app.route('/food', defaults={'path': ''})
@app.route('/food/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def food(path):
    if request.method == 'POST' and path == "order":
        r = request.get_json()
        # full_url = f"http://127.0.0.1:14004/food/order"
        response = requests.post(routes['food'] + '/order', json=r)
        return response.json(), response.status_code
    # elif request.method == 'GET' and path == "menu":
    #     print("1")
    #     r = request.query_string.decode()
    #     new_url = routes['food']+'/menu'+f'?{r}'
    #     response = requests.get(new_url)
    #     return response.json(), response.status_code
    else:
        return jsonify({"error": "Method not supported by the gateway"}), 404


@app.route('/image', methods=['POST'])
@app.route('/image/<int:image_id>', methods=['GET'])
def image(image_id=None):
    if request.method == 'GET':
        response = requests.get(f"{routes['image']}/{image_id}")
        print(response)
        # Stream the content directly without reading it into memory completely
        # Flask will handle streaming the content to the client
        def generate():
            for chunk in response.iter_content(chunk_size=4096):
                yield chunk
        return Response(generate(),
                         content_type=response.headers['Content-Type'],
                         status=response.status_code)
    elif request.method == 'POST':
        # Capture incoming files and data.
        incoming_files = request.files
        incoming_data = request.form.to_dict()

        # Prepare files in the correct format for 'requests' library.
        files = [(key, (file.filename, file.stream, file.mimetype)) for key, file in incoming_files.items()]

        # Forward the request to the image service including both files and form data.
        response = requests.post(f"{routes['image']}", files=files, data=incoming_data)
        print(response.json())
        return jsonify(response.json()), response.status_code
    else:
        return "Bad Request", 400


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

        image_ip = config_data['ImageService']['ip']
        image_port = config_data['ImageService']['port']

    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "user": f"http://{user_ip}:{user_port}/user",
        "order": f"http://{orders_ip}:{orders_port}/order",
        "meal": f"http://{meal_ip}:{meal_port}/meal",
        "address": f"http://{address_ip}:{address_port}/address",
        "review": f"http://{review_ip}:{review_port}/review",
        "food": f"http://{food_ip}:{food_port}/food",
        "image": f"http://{image_ip}:{image_port}/image",
    }
    app.run(port=config_data['Gateway']['port'], host=config_data['Gateway']['ip'], debug=True)
