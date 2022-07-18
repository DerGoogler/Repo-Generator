import { dom } from "googlers-tools";
import { CssBaseline, Box, ThemeProvider } from "@mui/material";
import App from "./App";
import theme from "./theme";

// Styles
import "./styles/default.scss";

dom.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box>
      <main>
        <App />
      </main>
    </Box>
  </ThemeProvider>,
  "app"
);
