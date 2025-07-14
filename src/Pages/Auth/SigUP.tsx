import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../../redux/api/usersApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setAuth } from "../../redux/features/authSlice";
import Cookies from "js-cookie";

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

      // ✅ التوجيه للصفحة الرئيسية
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        className="mb-3 w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="mb-3 w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-3 w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="mb-3 w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="re_password"
        value={form.re_password}
        onChange={handleChange}
        placeholder="Confirm Password"
        className="mb-3 w-full p-2 border rounded"
        required
      />

      {isError && (
        <div className="text-red-500 mb-2">
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isLoading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
};
