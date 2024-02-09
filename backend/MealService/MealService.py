from flask import Flask, request, jsonify
import sqlite3
import json
import sys
import os

app = Flask(__name__)
meal_DATABASE = 'meals.db'

def create_tables():
    tables = [
        """CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )""",
        """CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost DECIMAL NOT NULL
        )"""
    ]

    #conn_cus = get_db_connection('customers.db')
    #cursor_cus = conn_cus.cursor()
    conn_meal = get_db_connection('meals.db')
    cursor_meal = conn_meal.cursor()
    cursor_meal.execute('''DROP TABLE IF EXISTS meals;''')

    #cursor_cus.execute(tables[0])
    cursor_meal.execute(tables[1])

    #conn_cus.commit()
    #conn_cus.close()
    conn_meal.commit()
    conn_meal.close()


def initialize_database():
    create_tables()


def get_db_connection(db_name):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/meal', methods=['POST'])
def create_meal():
    meal_data = request.json
    name = meal_data.get('name')
    cost = meal_data.get('cost')

    if not name or cost is None:
        return jsonify({"message": "Name and cost are required"}), 400

    conn = get_db_connection('meals.db')
    cur = conn.cursor()
    cur.execute('INSERT INTO meals (name, cost) VALUES (?, ?)', (name, cost))
    conn.commit()
    id = cur.lastrowid
    conn.close()
    response = {"id": id,
                "name": name,
                "cost": cost,}
    return response, 200


@app.route('/meal', methods=['GET'])
def get_meal_cost():
    meal_id = request.args.get('id')
    conn = get_db_connection('meals.db')
    meal = conn.execute('SELECT * FROM meals WHERE id = ?',
                        (meal_id,)).fetchone()
    conn.close()
    if meal is None:
        return jsonify({"message": "Meal not found"}), 404
    return jsonify({"name": meal["name"], "cost": meal["cost"]}), 200


@app.route('/meal', methods=['DELETE'])
def delete_meal():
    meal_id = request.args.get('id')
    meal_data = request.json
    name = meal_data.get('name')
    cost = meal_data.get('cost')
    conn = get_db_connection('meals.db')
    meal = conn.execute('SELECT * FROM meals WHERE id = ?', (meal_id,)).fetchone()
    if meal is None:
        conn.close()
        return jsonify({"message": "Meal not found"}), 404
    if name != meal['name'] or cost != meal['cost']:
        conn.close()
        return jsonify({"message": "Authentication failed"}), 409
    conn.execute('DELETE FROM meals WHERE id = ?', (meal_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Meal deleted successfully"}), 200


if __name__ == '__main__':
    initialize_database()
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        meal_ip = config_data['MealService']['ip']
        meal_port = config_data['MealService']['port']
    except KeyError:
        print("Order config missing")
        exit(1)
    app.run(host=meal_ip, port=meal_port, debug=True)