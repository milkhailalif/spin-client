import ReactDOM from "react-dom/client";
import { Buffer as BufferPolyfill } from "buffer";
declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
