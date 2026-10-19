import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { DbProvider } from "@tanstack/react-db";
import { dbClient } from "./db/dbClient";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DbProvider client={dbClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </DbProvider>
    </StrictMode>,
  );
}
