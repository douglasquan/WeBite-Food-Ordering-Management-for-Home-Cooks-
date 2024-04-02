from sqlalchemy.exc import IntegrityError
from flask import *
import os
from enum import Enum
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'order.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class OrderStatus(Enum):
    PAID = 'PAID'
    UNPAID = 'UNPAID'


class Order(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    chef_id = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, nullable=False)
    meal_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    price = db.Column(db.Float, nullable=False, default=0)
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.UNPAID)


with app.app_context():
    db.create_all()


@app.route("/order", methods=["POST"])
def create_order():
    if request.method == "POST":
        try:
            data = request.json
            status = data.get("status", "").upper() if data.get("status") is not None else None
            order = Order(
                chef_id=data['chef_id'],
                customer_id=data['customer_id'],
                meal_id=data['meal_id'],
                quantity=data.get("quantity"),
                price=data.get("price"),
                status=status
            )
            db.session.add(order)
            db.session.commit()
            return jsonify({'message': 'New order created', 'order_id': order.order_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the order already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/order/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({
        'chef_id': order.chef_id,
        'customer_id': order.customer_id,
        'meal_id': order.meal_id,
        'quantity': order.quantity,
        'price': order.price,
        'status': order.status.value
    }), 200


@app.route('/order/chef/<int:chef_id>', methods=['GET'])
def get_orders_by_chef(chef_id):
    # return a list of orders prepared by the specified chef.
    orders = Order.query.filter_by(chef_id=chef_id).all()
    if not orders:
        # No orders found for the chef, return a 404 response
        return jsonify({'error': 'No orders found for the given chef_id'}), 404

    # Convert the list of order objects into a list of dictionaries
    orders_data = [{
        'order_id': order.order_id,
        'customer_id': order.customer_id,
        'meal_id': order.meal_id,
        'quantity': order.quantity,
        'price': order.price,
        'status': order.status.value
    } for order in orders]

    # Return the list of orders as a JSON response
    return jsonify(orders_data), 200


@app.route('/order/customer/<int:customer_id>', methods=['GET'])
def get_orders_by_customer(customer_id):
    # return a list of orders prepared by the specified chef.
    orders = Order.query.filter_by(customer_id=customer_id).all()
    if not orders:
        # No orders found for the customer, return a 404 response
        return jsonify({'error': 'No orders found for the given customer_id'}), 404

    # Convert the list of order objects into a list of dictionaries
    orders_data = [{
        'order_id': order.order_id,
        'chef_id': order.chef_id,
        'meal_id': order.meal_id,
        'quantity': order.quantity,
        'price': order.price,
        'status': order.status.value
    } for order in orders]

    # Return the list of orders as a JSON response
    return jsonify(orders_data), 200


@app.route('/order/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json

    # Update quantity if present in request JSON
    if 'quantity' in data:
        order.quantity = data['quantity']

    # Update status if present in request JSON
    if 'status' in data:
        try:
            # Ensure the provided status is valid
            status_update = OrderStatus(data['status'].upper())
            order.status = status_update
        except ValueError:
            # Return an error response if an invalid status is provided
            return jsonify({'error': 'Invalid status value'}), 400

    db.session.commit()
    return jsonify({'message': 'Order updated successfully'}), 200


@app.route('/order/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'order deleted successfully'}), 200


if __name__ == '__main__':
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        order_ip = config_data['OrderService']['ip']
        order_port = config_data['OrderService']['port']
    except KeyError:
        print("Order config missing")
        exit(1)
    app.run(host=order_ip, port=order_port, debug=True)
