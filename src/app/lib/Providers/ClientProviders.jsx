"use client";

import { Provider } from "react-redux";
import Providers from "./Providers";
import { Toaster } from "sonner";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { store } from "@/redux/store";



const ClientProviders = ({ children }) => {
  return (
    <Providers>
      <Provider store={store}>
        <AppRouterCacheProvider >
          <Toaster position="top-center" richColors />
          {children}
        </AppRouterCacheProvider>
      </Provider>
    </Providers>
  );
};

export default ClientProviders;
