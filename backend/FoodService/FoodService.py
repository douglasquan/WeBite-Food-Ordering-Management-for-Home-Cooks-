import requests
from flask import Flask, request, jsonify
import sqlite3
import json
import sys
import os

app = Flask(__name__)

@app.route('/food/order', methods=['POST'])
def place_bulk_orders():
    orders_data = request.json.get('orders')
    if not orders_data:
        return jsonify({"error": "No orders provided"}), 400

    results = []
    for order in orders_data:
        try:
            response = requests.post(order_url, json=order)
            if response.status_code == 200:
                results.append({"status": "success", "order": order, "response": response.json()})
            else:
                results.append({"status": "failed", "order": order, "reason": response.text})
        except requests.RequestException as e:
            results.append({"status": "failed", "order": order, "reason": str(e)})

    return jsonify({"results": results}), 200

if __name__ == '__main__':
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        food_ip = config_data['FoodService']['ip']
        food_port = config_data['FoodService']['port']
        order_ip = config_data['OrderService']['ip']
        order_port = config_data['OrderService']['port']
    except KeyError:
        print("config missing")
        exit(1)
    order_url = f"http://{order_ip}:{order_port}/order"
    app.run(host=food_ip, port=food_port, debug=True)



