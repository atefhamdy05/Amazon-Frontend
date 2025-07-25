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

    createProduct: builder.mutation({
      query: (formData: FormData) => ({
        url: base_url,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});
export const { useList_productQuery } = usersApiSlice;
export const { useCreateProductMutation } = usersApiSlice;
