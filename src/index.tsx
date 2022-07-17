import { createRoot } from "react-dom/client";
import { CssBaseline, Box, ThemeProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import App from "./App";
import theme from "./theme";

// Styles
import "./styles/default.scss";

// Setup root node where our React app will be attached to
const app = document.createElement("app");
document.body.appendChild(app);

// Render the app component
const container = document.querySelector("app");
const root = createRoot(container!);
root.render(
  <>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <main>
            <App />
          </main>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  </>
);
