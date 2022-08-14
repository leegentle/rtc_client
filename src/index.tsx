import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root")!);
if (!root) throw new Error("Failed to find the root element");
root.render(<App />);
reportWebVitals();
