import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLoginUserMutation } from "../../redux/api/usersApi";
import { setAuth } from "../../redux/features/authSlice";
import { jwtDecode } from "jwt-decode";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const form = {
      username: user.username,
      password: user.password,
    };

    loginUser({ form })
      .unwrap()
      .then((res) => {
        dispatch(setAuth(jwtDecode(res?.access)));
        Cookies.set("access_token", res?.access);
        Cookies.set("refresh_token", res?.refresh);

        toast.success("Logged In Successfully !");
        navigate("/");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="lg:w-[50%] md:w-p[70%] rounded-lg p-20 default-shadow ">
        <form action="" className="block" onSubmit={onSubmit}>
          {error?.data ? (
            <div className="text-red-700 font-semibold text-center mb-8">
              {error?.data?.detail}
            </div>
          ) : null}

          <label htmlFor="Username" className="mb-7">
            <span className="text-sm font-medium text-gray-700">
              {" "}
              Username{" "}
            </span>

            <input
              type="text"
              onChange={onChange}
              id="Username"
              name="username"
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <label htmlFor="password" className="mt-12">
            <span className="text-sm font-medium text-gray-700">
              {" "}
              password{" "}
            </span>

            <input
              type="password"
              onChange={onChange}
              id="password"
              name="password"
              className="mt-0.5 w-full rounded p-2 border-gray-300 shadow-sm sm:text-sm outline-none border-none"
            />
          </label>

          <button
            className="cursor-pointer mt-8 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
            type="submit"
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
