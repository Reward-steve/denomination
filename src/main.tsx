import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../src/assets/styles/animate.css";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { useRegisterSW } from 'virtual:pwa-register/react';

function PwaUpdater() {
  useRegisterSW({
    onNeedRefresh() {
      console.log('New version available!')
    },
    onOfflineReady() {
      console.log('App ready offline.')
    },
  })
  return null
}
// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // prevents refetching when switching tabs
      retry: 1, // retry once if request fails
      staleTime: 1000 * 60 * 2, // data stays fresh for 2 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PwaUpdater />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
