
import BasicTabs from "./TabPanel";
import { createTheme, ThemeProvider, PaletteColorOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "@mui/material/styles/createPalette";

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { foundry, optimism, optimismGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider } = configureChains(
    [optimism, optimismGoerli, foundry],
    [
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'zkWitches',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

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
    <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <BasicTabs />
            </ThemeProvider>
        </RainbowKitProvider>
    </WagmiConfig>
    )
}