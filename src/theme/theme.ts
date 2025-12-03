import { createTheme, type ThemeOptions } from "@mui/material/styles";

const darkThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#999999",
    },
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#999999",
    },
  },
};

export const darkTheme = createTheme(darkThemeOptions);
