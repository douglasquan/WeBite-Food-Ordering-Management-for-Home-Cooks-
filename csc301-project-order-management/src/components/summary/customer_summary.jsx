import React, { useState, useEffect } from "react";
import { getReq } from "../view_control.js"; // Adjust the import path as needed

const CustomerSummaryPage = ({ chefId }) => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({}); // To cache customer usernames

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersResponse = await getReq(`/order/chef/${chefId}`);
      setOrders(ordersResponse.data);
      // Extract unique customer IDs from orders
      const customerIds = [...new Set(ordersResponse.data.map((order) => order.customer_id))];

      // Fetch customer usernames
      customerIds.forEach(async (customerId) => {
        if (!customers[customerId]) {
          // Check if not already fetched
          try {
            const customerResponse = await getReq(`/customer/${customerId}`);
            const userResponse = await getReq(`/user/${customerResponse.data.user_id}`);
            setCustomers((prev) => ({ ...prev, [customerId]: userResponse.data.username }));
          } catch (error) {
            console.error(`Failed to fetch data for customer ID ${customerId}:`, error);
          }
        }
      });
    };

    if (chefId) {
      fetchOrders();
    }
  }, [chefId]);

  // This is a simplified way to organize data. For large datasets, consider optimizing the structure.
  const orderTable = orders.reduce((acc, order) => {
    const customerUsername = customers[order.customer_id] || "Fetching...";
    if (!acc[order.meal_name]) {
      acc[order.meal_name] = {};
    }
    acc[order.meal_name][customerUsername] = `${order.status} - $${order.price}`;
    return acc;
  }, {});

  return (
    <div>
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Meal </th>
            {Object.keys(customers).map((customerId) => (
              <th key={customerId}>{customers[customerId]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(orderTable).map(([mealName, customerOrders]) => (
            <tr key={mealName}>
              <td>{mealName}</td>
              {Object.values(customers).map((username, index) => (
                <td key={index}>{customerOrders[username] || "N/A"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSummaryPage;
