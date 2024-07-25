import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#fff",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});

export default darkTheme;
