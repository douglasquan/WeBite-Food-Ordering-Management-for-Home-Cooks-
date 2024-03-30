import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

review_list = [
    {
        "meal_id": 1,
        "customer_id": 2,
        "review_description": "Delicious and satisfying meal.",
        "rating": 5
    },
    {
        "meal_id": 2,
        "customer_id": 3,
        "review_description": "Good taste but too pricey.",
        "rating": 3
    },
    {
        "meal_id": 1,
        "customer_id": 1,
        "review_description": "Quite average, nothing special.",
        "rating": 2
    }
]

def test_populate_review_db(review_list):
    for review_data in review_list:
        response = requests.post(GATEWAY_URI + "review", json=review_data)
        print(response)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            if response.text:
                try:
                    print("Request failed with response:", response.json())
                except ValueError:
                    print("Response is not in JSON format")

def test_get_review_by_review_id(review_id_to_get):
    response = requests.get(GATEWAY_URI + f"review/{review_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Review with given review_id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_get_reviews_by_meal_id(meal_id_to_get):
    response = requests.get(GATEWAY_URI + f"review/meal/{meal_id_to_get}")
    if response.status_code == 200:
        try:
            reviews_data = response.json()
            print("Reviews found for the meal:", reviews_data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("No reviews found for the given meal_id.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_update_review(review_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"review/{review_id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_delete_review(review_id_to_delete):
    response = requests.delete(GATEWAY_URI + f"review/{review_id_to_delete}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

# Example usage:

# Populate the database with reviews
# test_populate_review_db(review_list)

# Get a review by review ID
# test_get_review_by_review_id(1)

# Get reviews by meal ID
# test_get_reviews_by_meal_id(1)

# Update a review's information
update_data = {
    "review_description": "Actually, it was quite good.",
    "rating": 4
}
# test_update_review(1, update_data)

# Delete a review by review ID
test_delete_review(2)
