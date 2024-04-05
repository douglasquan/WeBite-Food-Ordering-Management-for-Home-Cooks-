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
          const userResponse = await getReq(`/user/${response.data.user_id}`);
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
          const ordersWithDate = await Promise.all(
            ordersResponse.data.map(async (order) => {
              try {
                const mealResponse = await getReq(`/meal/${order.meal_id}`);
                return {
                  ...order,
                  mealName: mealResponse.data.name,
                  dateCreated: order.date, // Assuming this is the correct key for the date
                };
              } catch (error) {
                console.error(`Failed to fetch details for meal ID ${order.meal_id}:`, error);
                return {
                  ...order,
                  mealName: "Unknown", // Default value if meal name can't be fetched
                  dateCreated: "Unknown", // Default value if date can't be fetched
                };
              }
            })
          );

          setOrders(ordersWithDate);
        } catch (error) {
          console.error("Failed to fetch customer's orders:", error);
        }
      }
    };

    fetchOrders();
  }, [customerId]);

  return (
    <div className='bg-custom-grey min-h-screen flex flex-col'>
      <Navbar />
      <h2 className='text-2xl font-bold my-5 text-center'>Order History</h2>
      {orders.length > 0 ? (
        <div className='overflow-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider'>
                  Meal Name
                </th>
                <th className='px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider'>
                  Date Ordered
                </th>
              </tr>
            </thead>
            <tbody className='bg-custom-light-orange divide-y divide-gray-200'>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {order.mealName.replace(/_/g, " ")}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      order.status === "PAID"
                        ? "text-green-500"
                        : order.status === "UNPAID"
                        ? "text-red-500"
                        : ""
                    }`}
                  >{`${order.status} - $${order.price}`}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{order.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center my-5'>No orders currently.</div>
      )}
      <div className='flex-grow'></div>

      {/* Footer */}
      <footer className='bg-gray-800 w-full py-4'>
        <p className='text-center text-sm text-gray-300'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CustomerSummaryPage;
