import { useContext } from "react";
import AdminPanelContext from "./AdminPanelContext";
import DailyOrderChart from "./DailyOrderChart";
import MonthlyOrderChart from "./MonthlyOrderChart";
import DailySalesChart from "./DailySalesChart";
import MonthlySalesChart from "./MonthlySalesChart";
import { BarChart3, CalendarDays, DollarSign } from "lucide-react";

const DashboardHome = () => {
  const { state } = useContext(AdminPanelContext);

  if (state.loading)
    return (
      <p className="text-center p-8 text-gray-500">Loading dashboard...</p>
    );
  if (state.error)
    return <p className="text-center p-8 text-red-500">Error: {state.error}</p>;

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-md p-6 rounded-2xl flex items-center gap-4">
          <BarChart3 className="text-blue-600" size={36} />
          <div>
            <h2 className="text-sm text-gray-500">Weekly Orders</h2>
            <p className="text-2xl font-semibold">{state.weeklyOrders}</p>
          </div>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl flex items-center gap-4">
          <CalendarDays className="text-green-600" size={36} />
          <div>
            <h2 className="text-sm text-gray-500">Monthly Orders</h2>
            <p className="text-2xl font-semibold">{state.monthlyOrders}</p>
          </div>
        </div>
        <div className="bg-white shadow-md p-6 rounded-2xl flex items-center gap-4">
          <DollarSign className="text-amber-500" size={36} />
          <div>
            <h2 className="text-sm text-gray-500">Sales This Month</h2>
            <p className="text-2xl font-semibold">
              ৳{state.salesThisMonth.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <section className="space-y-8 w-full">
        <h2 className="text-xl font-bold text-gray-800">📊 Analytics Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Daily charts - take full width on medium and larger screens */}
          <div className="md:col-span-2">
            <DailyOrderChart />
          </div>
          <div className="md:col-span-2">
            <DailySalesChart />
          </div>

          {/* Monthly charts - side by side */}
          <div>
            <MonthlyOrderChart />
          </div>
          <div>
            <MonthlySalesChart />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
