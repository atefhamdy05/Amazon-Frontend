import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../redux/features/productsSlice";
import type { RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/api/productsApiSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, count, page, loading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts(page) as any);
  }, [dispatch, page]);

  const totalPages = Math.ceil(count / 6);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="font-bold mt-2">{product.title}</h3>
                <p>{product.price} $</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setPage(i + 1))}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
