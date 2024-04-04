import React, { useState, useEffect } from "react";
import { getReq } from "../view_control.js";
import Navbar from "../navbar/Navbar.jsx";

const CustomerSummaryPage = () => {
  const [orders, setOrders] = useState([]);
  const [mealNames, setMealNames] = useState({});
  const [customerId, setCustomerId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getCustomerId = async () => {
      try {
        const response = await getReq("user/customer/get-id");
        if (response.data.customer_id) {
          setCustomerId(response.data.customer_id);
          const userResponse = await getReq(`/user/${response.data.customer_id}`);
          setUsername(userResponse.data.username);
        } else {
          console.log("User is not recognized as a customer.");
        }
      } catch (error) {
        console.error("Failed to check customer status:", error);
      }
    };

    getCustomerId();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (customerId) {
        try {
          const ordersResponse = await getReq(`/order/customer/${customerId}`);
          setOrders(ordersResponse.data);

          // Fetch meal names for the orders
          const uniqueMealIds = [...new Set(ordersResponse.data.map((order) => order.meal_id))];
          for (const mealId of uniqueMealIds) {
            if (!mealNames[mealId]) {
              try {
                const mealResponse = await getReq(`/meal/${mealId}`);
                setMealNames((prev) => ({ ...prev, [mealId]: mealResponse.data.name }));
              } catch (error) {
                console.error(`Failed to fetch name for meal ID ${mealId}:`, error);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch customer's orders:", error);
        }
      }
    };

    fetchOrders();
  }, [customerId, mealNames]);

  return (
    <div>
      <Navbar />
      <h2 className='text-2xl font-bold my-5 text-center'>Order History</h2>
      {orders.length > 0 ? (
        <div className='overflow-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Meal Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {username}
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {mealNames[order.meal_id] || "Fetching..."}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{`${order.status} - $${order.price}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center my-5'>No orders currently.</div>
      )}
    </div>
  );
};

export default CustomerSummaryPage;