import { apiSlice } from "../services/apiSlice";

const base_url = "products/";
const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    list_product: builder.query({
      query: ({ page }: { page: Number }) => ({
        url: base_url,
        method: "GET",
        params: {
          page,
        },
      }),
    }),
  }),
});
export const { useList_productQuery } = usersApiSlice;
