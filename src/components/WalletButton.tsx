import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "./WalletButton.css";

const WalletButton = () => {
  return (
    <div>
      <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger" />
    </div>
  );
};

export default WalletButton;
