import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import { createGenerateClassName, createMuiTheme, Theme } from '@material-ui/core/styles';
import { GenerateClassName, SheetsRegistry } from 'jss';

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: purple[700],
      light: purple[300],
      main: purple[500],
    },
    secondary: {
      dark: green[700],
      light: green[300],
      main: green[500],
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export interface MuiContext {
  theme: Theme;
  sheetsManager: Map<any, any>;
  sheetsRegistry: SheetsRegistry;
  generateClassName: GenerateClassName;
}

function createMuiContext(): MuiContext {
  return {
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    theme,
  };
}

let muiContext;

export default function withMaterialUI() {
  // @ts-ignore
  if (!process.browser) {
    return createMuiContext();
  }
  if (!muiContext) {
    muiContext = createMuiContext();
  }
  return muiContext;
}
