import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  console.error("Element with id 'root' not found in document!");
}
else {
  const root = createRoot(rootElement as HTMLElement);
  root.render(<App />);
}