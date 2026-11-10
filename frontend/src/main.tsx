import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.scss";

const root = document.getElementById("root");

if (root === null) {
  throw new Error("No se encontró el elemento raíz de la aplicación.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
