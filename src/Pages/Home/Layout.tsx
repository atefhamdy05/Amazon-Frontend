import { useEffect } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Cookies.get("access_token")) {
      dispatch(setAuth(jwtDecode(Cookies.get("access_token") || "")));
    }
  }, [dispatch, Cookies.get("access_token")]);
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
