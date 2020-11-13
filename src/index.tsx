// Import deps
import React from "react";
import { render } from "react-dom";

// Import components
import { App } from "./components/app";

// Import styles
import "./styles/styles.css";

// Find div container
const rootElement = document.getElementById("root");

// Render App component in the DOM
render(<App />, rootElement);
