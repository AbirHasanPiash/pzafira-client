import { useContext } from "react";
import AdminPanelContext from "./AdminPanelContext";

const DashboardHome = () => {
  const { state } = useContext(AdminPanelContext);

  if (state.loading) return <p>Loading dashboard...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white shadow p-4 rounded-xl">
        <h2 className="text-lg font-semibold">Weekly Orders</h2>
        <p className="text-2xl">{state.weeklyOrders}</p>
      </div>
      <div className="bg-white shadow p-4 rounded-xl">
        <h2 className="text-lg font-semibold">Monthly Orders</h2>
        <p className="text-2xl">{state.monthlyOrders}</p>
      </div>
      <div className="bg-white shadow p-4 rounded-xl">
        <h2 className="text-lg font-semibold">Sales This Month</h2>
        <p className="text-2xl">৳{state.salesThisMonth.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DashboardHome;
