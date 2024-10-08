import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import router from "./router/router";
import { AuthContextProvider } from "./store/AuthContext/AuthContext";
import { queryClient } from "./config/api";
import { store } from "./store/redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
