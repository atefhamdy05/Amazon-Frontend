import { useSearchParams } from "react-router-dom";
import { useList_productQuery } from "../../redux/api/productsApi";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useList_productQuery(
    { page: currentPage },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.results.map((product: any) => (
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

          <div className="flex items-center justify-center mt-6 space-x-2">
            {data?.previous && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                ⬅️
              </button>
            )}

            <span className="px-4 py-2 text-gray-800 font-semibold bg-gray-100 border border-gray-300 rounded-lg shadow">
              {currentPage}
            </span>

            {data?.next && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                ➡️
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
