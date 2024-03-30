import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

order_list = [
    {
        "chef_id": 1,
        "customer_id": 2,
        "quantity": 3,
        "price": 10.5,
        "status": "unpaid"
    },
    {
        "chef_id": 2,
        "customer_id": 3,
        "quantity": 2,
        "price": 20.0,
        "status": "paid"
    },
    {
        "chef_id": 1,
        "customer_id": 1,
        "quantity": 1,
        "price": 15.0,
        "status": "unpaid"
    }
]

def test_populate_order_db(order_list):
    for order_data in order_list:
        response = requests.post(GATEWAY_URI + "order", json=order_data)
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

def test_get_order_by_order_id(order_id_to_get):
    response = requests.get(GATEWAY_URI + f"order/{order_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Order with given order_id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_update_order(order_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"order/{order_id_to_update}", json=update_data)
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

def test_delete_order(order_id_to_delete):
    response = requests.delete(GATEWAY_URI + f"order/{order_id_to_delete}")
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


def test_get_orders_by_chef(chef_id):
    response = requests.get(GATEWAY_URI + f"order/chef/{chef_id}")

    if response.status_code == 200:
        try:
            orders_data = response.json()
            print("orders found for the chef:", orders_data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("No orders found for the given chef_id.")
    else:
        print("Request failed.")
        try:
            error_response = response.json()
            print("Error:", error_response)
        except ValueError:
            print("Error response is not in JSON format")



# Example usage:

# Populate the database with orders
# test_populate_order_db(order_list)

# Get an order by order ID
# test_get_order_by_order_id(1)

# Update an order's information
update_data = {
    "quantity": 4,
    "status": "paid"
}
# test_update_order(1, update_data)

# Delete an order by order ID
test_delete_order(2)
