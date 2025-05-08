import { useContext } from "react";
import AdminPanelContext from "./AdminPanelContext";

const TopLikedProducts = () => {
  const { state } = useContext(AdminPanelContext);

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Top Liked Products</h2>
      <ul className="space-y-3">
        {state.topLikedProducts.map((product) => (
          <li key={product.id} className="border-b pb-2">
            <div className="font-semibold">{product.name}</div>
            <div className="text-sm">Rating: {product.average_rating} | Reviews: {product.total_reviews}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopLikedProducts;
