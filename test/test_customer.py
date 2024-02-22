import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

customer_list = [
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password_hash": "hash1"
    }
    ,
    {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "password_hash": "hash2"
    }
    ,
    {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "password_hash": "hash3"
    }
    ,
    {
        "name": "Bob Brown",
        "email": "bob@example.com",
        "password_hash": "hash4"
    }
    ,
    {
        "name": "Emily Davis",
        "email": "emily@example.com",
        "password_hash": "hash5"
    }

]


def test_create_customer_db(customer_list):
    for customer_data in customer_list:
        customer_data["command"] = "create"
        response = requests.post(GATEWAY_URI + "customer", json=customer_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response)


def test_get_customer_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"customer?id={id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("customer id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_update_customer(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"customer?id={id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_delete_customer(id_to_delete, order_data):
    response = requests.delete(GATEWAY_URI + f"customer?id={id_to_delete}", json=order_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())



def test_customer_login(email_to_login, password_to_login, login_data):
    login_data["command"] = "login"
    #print(login_data)
    response = requests.post(GATEWAY_URI + f"customer?email={email_to_login}&password_hash={password_to_login}", json=login_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response)


update_data = {
    "name": "John Low",
    "email": "john2@example.com	",
}

customer_to_delete = {
    "customer_id": 1005,
    "chef_id": 2005,
    "quantity": 2,
    "price": 20.0,
}


if __name__ == '__main__':
    # Populate the customers.db with customers
    # test_create_customer_db(customer_list)

    # Get a customer by ID
    # test_get_customer_by_id(1)

    # not yet implemented
    # # Update a customer's information
    # test_update_customer(1, update_data)

    # require authentication
    # # Delete a customer
    # test_delete_customer(1, customer_to_delete)
    # test_get_customer_by_id(1)
    login_data = {"command": "login"}
    test_customer_login("jane@example.com", "hash2", login_data)
