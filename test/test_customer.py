import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

customer_list = [
    {
        "user_id": 1,
        "pickup_address_id": 101
    },
    {
        "user_id": 2,
        "pickup_address_id": 102
    },
    {
        "user_id": 3,
        "pickup_address_id": 103
    }
]


def test_populate_customer_db(customer_list):
    for customer_data in customer_list:
        response = requests.post(GATEWAY_URI + "user/customer", json=customer_data)
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
                print("Request failed with response:", response.json())


def test_get_customer_by_user_id(user_id_to_get):
    response = requests.get(GATEWAY_URI + f"user/customer/{user_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Customer with given user_id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")


def test_update_customer(user_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"user/customer/{user_id_to_update}", json=update_data)
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


def test_delete_customer(user_id_to_delete):
    response = requests.delete(GATEWAY_URI + f"user/customer/{user_id_to_delete}")
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

# Populate the database with customers
# test_populate_customer_db(customer_list)

# Get a customer by user ID
test_get_customer_by_user_id(2)

# Update a customer's information
update_data = {
    "pickup_address_id": 105
}
# test_update_customer(2, update_data)

# Delete a customer by user ID
# test_delete_customer(3)
