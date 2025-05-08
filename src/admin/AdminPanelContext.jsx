import React, { createContext, useReducer, useEffect } from "react";
import api from "../api/axios";

const AdminPanelContext = createContext();

const initialState = {
  loading: true,
  error: null,
  weeklyOrders: 0,
  monthlyOrders: 0,
  topLikedProducts: [],
  topUsers: [],
  salesThisMonth: 0,
  salesLastMonth: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AdminPanelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const localData = localStorage.getItem("adminDashboard");
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/adminuser/api/admin-dashboard/");
        const data = {
          weeklyOrders: response.data.weekly_orders,
          monthlyOrders: response.data.monthly_orders,
          topLikedProducts: response.data.top_liked_products,
          topUsers: response.data.top_users,
          salesThisMonth: response.data.sales_this_month,
          salesLastMonth: response.data.sales_last_month,
        };

        dispatch({ type: "FETCH_SUCCESS", payload: data });
        localStorage.setItem("adminDashboard", JSON.stringify(data));
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchDashboard();
  }, []);

  return (
    <AdminPanelContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminPanelContext.Provider>
  );
};

export default AdminPanelContext;
