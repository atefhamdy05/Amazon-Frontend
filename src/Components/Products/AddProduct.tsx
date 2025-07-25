// src/pages/AddProduct.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateProductMutation } from "../../redux/api/productsApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  const [createProduct, { isLoading, error }] = useCreateProductMutation();
  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      await createProduct(data).unwrap();
      toast.success("✅ Product added successfully!");
      navigate("/");
    } catch (err) {
      toast.error("❌ Failed to add product.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="lg:w-[50%] md:w-[70%] rounded-lg p-10 bg-white default-shadow">
        <form
          className="block space-y-6"
          onSubmit={onSubmit}
          encType="multipart/form-data"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Add Product</h2>

          <label htmlFor="title" className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              type="text"
              name="title"
              id="title"
              onChange={onChange}
              value={formData.title}
              className="mt-1 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border"
              required
            />
          </label>

          <label htmlFor="description" className="block">
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              name="description"
              id="description"
              onChange={onChange}
              value={formData.description}
              className="mt-1 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border h-28 resize-none"
              required
            />
          </label>

          <label htmlFor="price" className="block">
            <span className="text-sm font-medium text-gray-700">Price ($)</span>
            <input
              type="number"
              name="price"
              id="price"
              onChange={onChange}
              value={formData.price}
              className="mt-1 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border"
              required
            />
          </label>

          <label htmlFor="image" className="block">
            <span className="text-sm font-medium text-gray-700">
              Product Image
            </span>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={onChange}
              className="mt-1 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full mt-4 rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">
              ❌ Failed to add product.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
