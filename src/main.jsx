import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Game from "./game.jsx";
import Click from "./click.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Game />
    </StrictMode>
);
