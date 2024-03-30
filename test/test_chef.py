import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

chef_list = [
    {
        "user_id": 1,
        "rating": 4.8,
        "description": " very good",
        "delivery_address_id": 1
    },
    {
        "user_id": 2,
        "rating": 3.8,
        "description": "so so",
        "delivery_address_id": 1
    },
    {
        "user_id": 3,
        "rating": 2.8,
        "description": " not good",
        "delivery_address_id": 1
    }
]


def test_populate_chef_db(chef_list):
    for chef_data in chef_list:
        response = requests.post(GATEWAY_URI + "user/chef", json=chef_data)
        print(response)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response.json())


def test_get_chef_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"user/chef/{id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Chef id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        # You should only try to decode the response if there's content.
        if response.text:
            print("Request failed with response:", response.json())


def test_update_chef(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"user/chef/{id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_delete_chef(id_to_delete):
    response = requests.delete(GATEWAY_URI + f"user/chef/{id_to_delete}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


# Populate the dataGATEWAY_URI with chefs
# test_populate_chef_db(chef_list)

# Get a chef by ID
test_get_chef_by_id(2)

# # Update a chef's information
update_data = {
    "description": "good",
    "rating": 4.1,
}
# test_update_chef(4, update_data)

# # Delete a chef

# test_delete_chef(4)
