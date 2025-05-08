import { useContext } from "react";
import AdminPanelContext from "./AdminPanelContext";

const TopUsers = () => {
  const { state } = useContext(AdminPanelContext);

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Top Users</h2>
      <ul className="space-y-3">
        {state.topUsers.map((user) => (
          <li key={user.id} className="border-b pb-2">
            <div className="font-semibold">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="text-blue-600 font-bold">৳{parseFloat(user.total_purchased).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
