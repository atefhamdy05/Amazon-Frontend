import { apiSlice } from "../services/apiSlice";
const base_url = "users/";
const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ form }: { form: { username: string; password: string } }) => ({
        url: base_url + "jwt/create/",
        method: "POST",
        body: form,
      }),
    }),

    registerUser: builder.mutation({
      query: ({ form }) => ({
        url: base_url,
        method: "POST",
        body: form,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = usersApiSlice;
