
import BasicTabs from "./TabPanel";
import WalletConnector from "./WalletConnector";
import { createTheme, ThemeProvider, PaletteColorOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "@mui/material/styles/createPalette";


const { palette } = createTheme();

declare module "@mui/material/styles" {
    interface Palette {
        food: PaletteColorOptions;
        lumber: PaletteColorOptions;
        brigand: PaletteColorOptions;
        inquisitor: PaletteColorOptions;
    }
    interface PaletteOptions {
        food: PaletteColorOptions;
        lumber: PaletteColorOptions;
        brigand: PaletteColorOptions;
        inquisitor: PaletteColorOptions;
    }
  }
  
  declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        food: true;
        lumber: true;
        brigand: true;
        inquisitor: true;
    }
  }

  declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        food: true;
        lumber: true;
        brigand: true;
        inquisitor: true;
    }
  }

  declare module "@mui/material/Slider" {
    interface SliderPropsColorOverrides {
        food: true;
        lumber: true;
        brigand: true;
        inquisitor: true;
    }
  }

  declare module "@mui/material/Checkbox" {
    interface CheckboxPropsColorOverrides {
        food: true;
        lumber: true;
        brigand: true;
        inquisitor: true;
    }
  }

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        food: palette.augmentColor({ color: { main: "#F4AF37"} }),
        lumber: palette.augmentColor({ color: { main: "#228C22"}}),
        brigand: palette.augmentColor({ color: { main: "#56717D"}}),
        inquisitor: palette.augmentColor({ color: { main: "#8b0000"}})
    },
});

declare module "@mui/material/styles/createPalette" {
    interface CommonColors {
        food: string;
        lumber: string;
        brigand: string;
        inquisitor: string;
    }
  }

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BasicTabs />
            <WalletConnector />
        </ThemeProvider>
    )
}