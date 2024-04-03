from sqlalchemy.exc import IntegrityError
from flask import Flask, request, jsonify
import json
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'meal.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

migrate = Migrate(app, db)


class Meal(db.Model):
    meal_id = db.Column(db.Integer, primary_key=True)
    chef_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(200), nullable=False, default="")
    cost = db.Column(db.Float, nullable=False, default=0)
    offer = db.Column(db.Boolean, default=False, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('chef_id', 'name', name='unique_chef_id_name'),
    )


with app.app_context():
    db.create_all()


@app.route("/meal", methods=["POST"])
def create_meal():
    if request.method == "POST":
        try:
            data = request.json
            name = data.get("name", "").strip().replace(" ", "_")
            meal = Meal(
                chef_id=data['chef_id'],
                name=name,
                cost=data.get("cost")
            )
            db.session.add(meal)
            db.session.commit()
            return jsonify({'message': 'New meal created', 'meal_id': meal.meal_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the meal already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/meal/<int:meal_id>', methods=['GET'])
def get_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    return jsonify({
        'chef_id': meal.chef_id,
        'name': meal.name,
        'cost': meal.cost,
        "offer": meal.offer
    }), 200


@app.route('/meal/chef/<int:chef_id>', methods=['GET'])
def get_meals_by_chef(chef_id):
    meals = Meal.query.filter_by(chef_id=chef_id).all()
    meals_data = [{
        'meal_id': meal.meal_id,
        'chef_id': meal.chef_id,
        'name': meal.name,
        'cost': meal.cost,
        "offer": meal.offer
    } for meal in meals]

    return jsonify(meals_data), 200


@app.route('/meal/name/<meal_name>', methods=['GET'])
def get_meals_by_name(meal_name):
    try:
        meal_name = meal_name.strip().replace(" ", "_")
        print(meal_name)
        meal = Meal.query.filter_by(name=meal_name).all()[0]
    except IndexError:
        return jsonify({"error": "no meal with given name"}), 400
    if not meal:
        # No meal found for the meal name, return a 404 response
        return jsonify({'error': 'No meal found for the given name'}), 404

    return jsonify({
        'meal_id': meal.meal_id,
        'chef_id': meal.chef_id,
        'name': meal.name,
        'cost': meal.cost,
        "offer": meal.offer
    }), 200


@app.route('/meal/<int:meal_id>', methods=['PUT'])
def update_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    data = request.json

    # Update fields only if they are present in the request JSON
    if 'name' in data:
        meal.name = data['name']
    if 'cost' in data:
        meal.cost = data['cost']
    if 'offer' in data:
        meal.offer = data['offer']

    print(meal.offer)
    db.session.commit()
    return jsonify({'message': 'meal updated successfully'}), 200


@app.route('/meal/<int:meal_id>', methods=['DELETE'])
def delete_meal(meal_id):
    meal = Meal.query.get_or_404(meal_id)
    db.session.delete(meal)
    db.session.commit()
    return jsonify({'message': 'Meal deleted successfully'}), 200


if __name__ == '__main__':
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        chef_ip = config_data['MealService']['ip']
        chef_port = config_data['MealService']['port']
        # print(f"chef port:{chef_port} chef ip: {chef_ip}")
    except KeyError:
        print("Meal config missing")
        exit(1)
    app.run(host=chef_ip, port=chef_port, debug=True)
