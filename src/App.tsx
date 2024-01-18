import { useMemo, useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import Header from "./components/Header";
import "./App.css";

import "@solana/wallet-adapter-react-ui/styles.css";
import Home from "./components/Home/Home";
import { Grid } from "@mui/material";
import { BalanceContext } from "./contexts/useBalanceContext";
import { StatusContext } from "./contexts/useStatusContext";
import { PrizeNumberContext } from "./contexts/usePrizeNumberContext";
import { Status } from "./constants/Constants";

function App() {
  const [balance, setBalance] = useState<number>(0);
  const [status, mappingStatusTo] = useState<Status>(Status.BEFORE_DEPOSITE);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const solNetwork = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  /**
   * initialize all the wallets you want to use
   */
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [solNetwork]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <StatusContext.Provider
            value={{ status: status, mappingStatusTo: mappingStatusTo }}
          >
            <BalanceContext.Provider
              value={{ balance1: balance, setBalance1: setBalance }}
            >
              <PrizeNumberContext.Provider
                value={{
                  prizeNumber: prizeNumber,
                  setPrizeNumber: setPrizeNumber,
                }}
              >
                {/* <Grid maxWidth={"1600px"} margin={"auto"}> */}
                <Grid
                  
                >
                  <Header />
                  <Home />
                </Grid>
              </PrizeNumberContext.Provider>
            </BalanceContext.Provider>
          </StatusContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
