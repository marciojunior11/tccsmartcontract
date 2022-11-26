import { BrowserRouter } from "react-router-dom";

import './shared/forms/TraducoesYup';
import 'react-toastify/dist/ReactToastify.css';

import { AppRoutes } from "./routes";
import { Sidemenu } from "./shared/components";
import { AppThemeProvider, DrawerProvider } from "./shared/contexts";
import { ToastContainer } from "react-toastify";
import { EthProvider } from "./shared/contexts/ethereum";

function App() {
  return (
      <EthProvider>
        <ToastContainer/>
        <AppThemeProvider>
          <DrawerProvider>
            <BrowserRouter>
              <Sidemenu>
                <AppRoutes/>
              </Sidemenu>
            </BrowserRouter>
          </DrawerProvider>
        </AppThemeProvider>
      </EthProvider>
  );
}

export default App;
