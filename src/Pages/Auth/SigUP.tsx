import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../../redux/api/usersApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setAuth } from "../../redux/features/authSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation(); // ← هنا login mutation

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    re_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({ form }).unwrap();

      // تسجيل الدخول التلقائي
      const loginRes = await loginUser({
        form: {
          username: form.username,
          password: form.password,
        },
      }).unwrap();

      // حفظ التوكنات
      Cookies.set("access_token", loginRes.access);
      Cookies.set("refresh_token", loginRes.refresh);

      // ✅ الآن جلب بيانات المستخدم من /users/me/
      const userRes = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/me/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginRes.access}`,
          },
        }
      );

      if (!userRes.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userRes.json();

      // ✅ حفظ بيانات المستخدم في الـ Redux
      dispatch(setAuth(userData));
      toast.success("Logged In Successfully !");
      // ✅ التوجيه للصفحة الرئيسية
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="lg:w-[50%] md:w-[70%] rounded-lg p-20 default-shadow bg-white">
        <form className="block" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

          {isError && (
            <div className="text-red-700 font-semibold text-center mb-8">
              {"data" in (error as any) &&
                typeof (error as any).data === "object" && (
                  <ul>
                    {Object.entries(
                      (error as any).data as Record<string, string[] | string>
                    ).map(([field, message], index) => (
                      <li key={index}>
                        <strong>{field}:</strong>{" "}
                        {Array.isArray(message) ? message.join(", ") : message}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          )}

          <label htmlFor="username" className="mb-4 block">
            <span className="text-sm font-medium text-gray-700">Username</span>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <label htmlFor="full_name" className="mb-4 block">
            <span className="text-sm font-medium text-gray-700">Full Name</span>
            <input
              type="text"
              name="full_name"
              id="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <label htmlFor="email" className="mb-4 block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <label htmlFor="password" className="mb-4 block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <label htmlFor="re_password" className="mb-4 block">
            <span className="text-sm font-medium text-gray-700">
              Confirm Password
            </span>
            <input
              type="password"
              name="re_password"
              id="re_password"
              value={form.re_password}
              onChange={handleChange}
              required
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer mt-8 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden w-full"
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          {/* زر للانتقال إلى صفحة تسجيل الدخول */}
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/login/")}
              className="text-indigo-600 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
