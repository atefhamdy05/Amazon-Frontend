import { useList_productQuery } from "../../redux/api/productsApi";

const ProductList = () => {
  const { data, isLoading } = useList_productQuery({ page: 1 });
  console.log(data);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.results.map((product: any) => (
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
        </>
      )}
    </div>
  );
};

export default ProductList;
