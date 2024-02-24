import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

orders_json = {
   "orders": [{
        "customer_id": 1001,
        "chef_id": 2001,
        "quantity": 2,
        "price": 25.99,
    }
    ,
    {
        "customer_id": 1002,
        "chef_id": 2002,
        "quantity": 1,
        "price": 12.5,
    }
    ,
    {
        "customer_id": 1003,
        "chef_id": 2003,
        "quantity": 3,
        "price": 30.75,
    },
    {
        "customer_id": 1004,
        "chef_id": 2004,
        "quantity": 4,
        "price": 45.0,
    },
    {
        "customer_id": 1005,
        "chef_id": 2005,
        "quantity": 2,
        "price": 20.0,
    }]
}


def test_populate_order_db(order_list):
    response = requests.post(GATEWAY_URI + "food/order", json=order_list)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


if __name__ == '__main__':
    test_populate_order_db(orders_json)
