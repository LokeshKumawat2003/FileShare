import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom"; // ✅ Import Router
import { AuthProvider } from "./context/AuthContext";

const rootEl = document.getElementById("root");

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider>
            <AuthProvider>
          <App />
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
