import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setLogout } from "../features/authSlice";
import { Mutex } from "async-mutex";
import { toast } from "react-toastify";
const mutex = new Mutex();
import Cookies from "js-cookie";

// بيجهز ال
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/`,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/users/jwt/refresh/",
            method: "POST",
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          // api.dispatch(setAuth(refreshResult.data?.access));
          // ts ignore

          Cookies.set("access_token", refreshResult.data?.access);
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(setLogout());
          // window.location.href = '/auth/login'; // Redirect to login
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  } else if (result.error && result.error.status === 403) {
    toast.error("you don't have permissions to procced this action");
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    // 'users',
  ],
});
