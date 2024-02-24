import requests

GATEWAY_URI = "http://127.0.0.1:14000/"  # Change the port to match the review service

review_list = [
    {
        "meal_id": 1,
        "customer_id": 101,
        "review_description": "Delicious and well-seasoned meal.",
        "rating": 5
    },
    {
        "meal_id": 2,
        "customer_id": 102,
        "review_description": "Quite good but a bit too spicy for my taste.",
        "rating": 4
    },
    {
        "meal_id": 3,
        "customer_id": 103,
        "review_description": "Not as expected, was a bit cold.",
        "rating": 2
    }
]

def test_populate_review_db(review_list):
    for review_data in review_list:
        response = requests.post(GATEWAY_URI + "review", json=review_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response.json())

def test_get_review_by_id(review_id_to_get):
    response = requests.get(GATEWAY_URI + f"review?review_id={review_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Review id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_update_review(review_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"review?review_id={review_id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_delete_review(review_id_to_delete, review_data):
    response = requests.delete(GATEWAY_URI + f"review?review_id={review_id_to_delete}", json=review_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

# Test cases:

test_review_id = 4454871729
update_data = {
    "review_description": "Updated review text here.",
    "rating": 4
}

# POST 
# test_populate_review_db(review_list)

# GET
# test_get_review_by_id(test_review_id) 

# PUT
# test_update_review(test_review_id, update_data)  

# DELETE
review_to_delete = review_list[0]
# for key, value in update_data.items(): #update the address manually if you previously ran test_update_address
#     review_to_delete[key] = value
test_delete_review(test_review_id, review_to_delete)  
