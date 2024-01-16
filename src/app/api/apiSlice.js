import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const deployment = process.env.NODE_ENV;
const baseQuery = fetchBaseQuery({
  baseUrl:
    deployment === "production"
      ? "https://votifyapi-q9zc.onrender.com/votify/api/v1"
      : process.env.REACT_APP_DOMAIN,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "User",
    "Election",
    "Ballot",
    "AddVoter",
    "Vote",
    "Result",
    "Profile",
    "Analytics",
    "Email",
  ],
  endpoints: (builder) => ({}),
});
