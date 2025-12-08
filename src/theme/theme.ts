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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px", // MUI uses px for borderRadius: 1 = 4px
          marginBottom: "4px",
        },
      },
    },
  },
};

export const darkTheme = createTheme(darkThemeOptions);
