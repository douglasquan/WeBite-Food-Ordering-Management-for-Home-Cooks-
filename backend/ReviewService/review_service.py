from sqlalchemy.exc import IntegrityError
from flask import *
import os
from enum import Enum
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'review.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Review(db.Model):
    review_id = db.Column(db.Integer, primary_key=True)
    meal_id = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, nullable=False)
    review_description = db.Column(db.Text, nullable=False, default="no description")
    rating = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (
        db.UniqueConstraint('meal_id', 'customer_id', name='unique_meal_customer'),
    )


with app.app_context():
    db.create_all()


@app.route("/review", methods=["POST"])
def create_review():
    if request.method == "POST":
        try:
            data = request.json
            review = Review(
                meal_id=data['meal_id'],
                customer_id=data['customer_id'],
                review_description=data.get("review_description"),
                rating=data.get("rating")
            )
            db.session.add(review)
            db.session.commit()
            return jsonify({'message': 'New review created', 'review_id': review.review_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the review already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/review/<int:review_id>', methods=['GET'])
def get_review(review_id):
    review = Review.query.get_or_404(review_id)
    return jsonify({
        'meal_id': review.meal_id,
        'customer_id': review.customer_id,
        'review_description': review.review_description,
        'rating': review.rating
    }), 200


@app.route('/review/meal/<int:meal_id>', methods=['GET'])
def get_reviews_by_meal_id(meal_id):
    # return a list of reviews for a  specified meal.
    reviews = Review.query.filter_by(meal_id=meal_id).all()
    if not reviews:
        # No reviews found for the meal_id return a 404 response
        return jsonify({'error': 'No reviews found for the given meal_id'}), 404

    # Convert the list of review objects into a list of dictionaries
    reviews_data = [{
        'meal_id': review.meal_id,
        'customer_id': review.customer_id,
        'review_description': review.review_description,
        'rating': review.rating
    } for review in reviews]

    # Return the list of reviews as a JSON response
    return jsonify(reviews_data), 200


@app.route('/review/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    data = request.json

    # Update review_description if present in request JSON
    if 'review_description' in data:
        review.review_description = data['review_description']

    # Update rating if present in request JSON
    if 'rating' in data:
        review.rating = data['rating']

    db.session.commit()
    return jsonify({'message': 'review updated successfully'}), 200


@app.route('/review/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'review deleted successfully'}), 200


if __name__ == '__main__':
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        review_ip = config_data['ReviewService']['ip']
        review_port = config_data['ReviewService']['port']
    except KeyError:
        print("review config missing")
        exit(1)
    app.run(host=review_ip, port=review_port, debug=True)
