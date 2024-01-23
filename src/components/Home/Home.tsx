import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  Transaction,
  PublicKey,
  ParsedAccountData,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  burn,
  getMint,
} from "@solana/spl-token";
import { Grid, List, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { ToastContainer, toast } from "react-toastify";
import { useBalanceContext } from "src/contexts/useBalanceContext";
import { useStatusContext } from "src/contexts/useStatusContext";
import { BE_PUBKEY, BE_WALLET_KP, MINT, Status } from "src/constants/Constants";
import TOKENLOGO from "assets/svg/token_logo.svg";
import INFO from "assets/svg/information-circle.svg";
// import HISTORY from "assets/svg/calendar.svg";
import CROSS from "assets/svg/cross.svg";
import Roulette from "../Roulette/Roulette";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";
import base58 from "bs58";

// const PATTERN = /^[0-9]*[.,]?[0-9]*$/;
const PLEASECONNECTWALLET = "Wallet is not connected";
const INPUTDEPOSITEAMOUNT = "Input Deposite Amount";
const NOTENOUGHBALANCE = "Not Enough Balance";
const ONCONNECTION = "Wait for Connection!";


const Home = () => {
  const wallet = useWallet();
  console.log("--------", wallet);
  const { connection } = useConnection();
  const { balance1, setBalance1 } = useBalanceContext();
  const { status, mappingStatusTo } = useStatusContext();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [helpAnchor, setHelpAnchor] = useState<boolean>(false);
  // const [historyAnchor, setHistoryAnchor] = useState<boolean>(false);
  // @ts-ignore
  const [mint, setMint] = useState<string>(MINT);
  // const [tokenAccount, setTokenAccount] = useState("");
  const [isInputDisabled,setIsInputDisabled]=useState<boolean>(false);

  /**
   * @dev create a token mint if there is not a mint
   */
  // const createMint = async () => {
  //   const mint = Keypair.generate();
  //   const { sendTransaction } = wallet;
  //   const token_owner_pk = new PublicKey(BE_PUBKEY);
  //   if (!connection || !token_owner_pk) return;

  //   const lamports = await getMinimumBalanceForRentExemptMint(connection);
  //   const transaction = new Transaction();

  //   transaction.add(
  //     SystemProgram.createAccount({
  //       fromPubkey: token_owner_pk,
  //       newAccountPubkey: mint.publicKey,
  //       space: MINT_SIZE,
  //       lamports,
  //       programId: TOKEN_PROGRAM_ID,
  //     }),
  //     createInitializeMintInstruction(
  //       mint.publicKey,
  //       0,
  //       token_owner_pk,
  //       token_owner_pk,
  //       TOKEN_PROGRAM_ID
  //     )
  //   );

  //   sendTransaction(transaction, connection, {
  //     signers: [mint],
  //   }).then((sig) => {
  //     setMint(mint.publicKey.toString());
  //     console.log("createMintSig: ", sig, ":", mint.publicKey.toString());
  //   });
  // };

  /**
   *  @dev create an associated token account
   */
  // const createTokenAccount = async () => {
  //   const token_mint = new PublicKey(mint);
  //   if (!token_mint || !wallet.publicKey) {
  //     console.log("mint error");
  //     return;
  //   }

  //   const transaction = new Transaction();
  //   const owner = new PublicKey(BE_PUBKEY);

  //   const associatedToken = await getAssociatedTokenAddress(
  //     token_mint,
  //     owner,
  //     false,
  //     TOKEN_PROGRAM_ID,
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );
  //   console.log(
  //     "🚀 ~ createTokenAccount ~ associatedToken:",
  //     associatedToken.toString()
  //   );

  //   transaction.add(
  //     createAssociatedTokenAccountInstruction(
  //       wallet.publicKey,
  //       associatedToken,
  //       owner,
  //       token_mint,
  //       TOKEN_PROGRAM_ID,
  //       ASSOCIATED_TOKEN_PROGRAM_ID
  //     )
  //   );


  //   const signature = await wallet.sendTransaction(transaction, connection);
  //   setTokenAccount(associatedToken.toString());

  //   const tx = await connection.confirmTransaction(signature, "confirmed");
  //   console.log("🚀 ~ createTokenAccount ~ tx:", tx);
  // };

  /**
   * @dev mint some amount to game TokenAccount
   */
  // const mintToGamTokenAccount = async (amount: number) => {
  //   if (!connection || !wallet.publicKey) {
  //     return;
  //   }
  //   const transaction = new Transaction();

  //   const mintPubKey = new PublicKey(mint);
  //   const recipientPubKey = new PublicKey(BE_PUBKEY);
  //   const gameKeypair = Keypair.fromSecretKey(base58.decode(BE_WALLET_KP));

  //   const associatedToken = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     gameKeypair,
  //     new PublicKey(mint),
  //     recipientPubKey
  //   );
  //   console.log(
  //     "🚀 ~ mintToGamTokenAccount ~ associatedToken:",
  //     associatedToken.toString()
  //   );

  //   transaction.add(
  //     createMintToInstruction(
  //       mintPubKey,
  //       associatedToken.address,
  //       recipientPubKey,
  //       amount
  //     )
  //   );

  //   const signature = await wallet.sendTransaction(transaction, connection);

  //   await connection.confirmTransaction(signature, "confirmed");

  //   setTokenAccount(associatedToken.toString());

  //   const account = await getAccount(connection, associatedToken.address);
  //   console.log("game token account balance:", Number(account.amount));
  //   setBalance1(Number(account.amount));
  // };

  /**
   * @dev send amount of reward token to user
   */
  const sendToUser = async (amount: number) => {
    const mintPubKey = new PublicKey(mint);
    const gameTokenAccountPk = new PublicKey(BE_PUBKEY);
    const gameKeypair = Keypair.fromSecretKey(base58.decode(BE_WALLET_KP));
    if (!wallet.publicKey) {
      console.log("wallet error");
      return;
    }

    const gameTokenAccount = await getAssociatedTokenAddress(
      mintPubKey,
      gameTokenAccountPk,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log(
      "🚀 ~ sendToUser ~ gameTokenAccount:",
      gameTokenAccount.toString()
    );

    const destinationAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      gameKeypair,
      mintPubKey,
      wallet.publicKey
    );
    console.log(
      "🚀 ~ sendToUser ~ destinationAccount:",
      destinationAccount.address.toString()
    );

    const mintInfo = await connection.getParsedAccountInfo(mintPubKey);
    const mintDecimal = (mintInfo.value?.data as ParsedAccountData).parsed.info
      .decimals as number;

    const tx = new Transaction();
    tx.add(
      createTransferInstruction(
        gameTokenAccount,
        destinationAccount.address,
        gameTokenAccountPk,
        amount * Math.pow(10, mintDecimal),
        [],
        TOKEN_PROGRAM_ID
      )
    );
    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latestBlockhash.blockhash;
    // tx.feePayer = wallet.publicKey;
    const signature = await sendAndConfirmTransaction(connection, tx, [
      gameKeypair,
    ]);
    // const result = await connection.confirmTransaction(signature, "confirmed");
    console.log("result", signature);
  };

  const getBalanceOfUserTokenAccount = async () => {
    const mintPubKey = new PublicKey(mint);
    const gameKeypair = Keypair.fromSecretKey(base58.decode(BE_WALLET_KP));
    if (!wallet.publicKey) {
      console.log("wallet error");
      return;
    }
    const userAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      gameKeypair,
      mintPubKey,
      wallet.publicKey
    );
    const info = await getAccount(connection, userAccount.address);
    console.log("🚀 ~ depositToken _> mint  ~ info:", info);
    // const tokenBalance = Number(info.amount);
    const tokenMint = await getMint(connection, info.mint);
    const balance = Number(info.amount) / 10 ** tokenMint.decimals;
    console.log('balance, ', balance)
    return balance;
  }

  const depositToken = async (amount: number) => {
    const mintPubKey = new PublicKey(mint);
    // const gameTokenAccountPk = new PublicKey(BE_PUBKEY);
    const gameKeypair = Keypair.fromSecretKey(base58.decode(BE_WALLET_KP));
    if (!wallet.publicKey) {
      console.log("wallet error");
      return;
    }
    const gameTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      gameKeypair,
      mintPubKey,
      gameKeypair.publicKey
    );
    console.log(
      "🚀 ~ depositToken ~ gameTokenAccount:",
      gameTokenAccount.address.toBase58()
    );

    const userAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      gameKeypair,
      mintPubKey,
      wallet.publicKey
    );
    console.log(
      "🚀 ~ depositToken ~ userAccount:",
      userAccount.address.toString()
    );
    console.log("Balance (using Solana-Web3.js): ", balance1);

    const mintInfo = await connection.getParsedAccountInfo(mintPubKey);
    const mintDecimal = (mintInfo.value?.data as ParsedAccountData).parsed.info
      .decimals as number;

    const tx = new Transaction();
    tx.add(
      createTransferInstruction(
        userAccount.address,
        gameTokenAccount.address,
        wallet.publicKey,
        amount * Math.pow(10, mintDecimal)
      )
    );
    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = wallet.publicKey;
    const signature = await wallet.sendTransaction(tx, connection);
    const result = await connection.confirmTransaction(signature, "confirmed");
    console.log("result++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", result);
  };

  /**
   * @dev burn token at game wallet
   */
  const burnToken = async (amount: number) => {
    const gameKeypair = Keypair.fromSecretKey(base58.decode(BE_WALLET_KP));
    const mintPk = new PublicKey(mint);
    const gameOwnerPk = new PublicKey(BE_PUBKEY);

    const gameTokenAccount = await getAssociatedTokenAddress(
      mintPk,
      gameOwnerPk,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const transactionSignature = await burn(
      connection,
      gameKeypair,
      gameTokenAccount,
      mintPk,
      gameOwnerPk,
      amount
    );
    console.log("Burn succeeded, and the signature ", transactionSignature);
  };

  /**
   * set deposite token amount
   *
   */
  const handleTokenAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const regex = /^(?!0\d)\d*(\.\d*)?$/;
    if (input === '' || regex.test(input)) {
      setTokenAmount(input);
    }
  };

  /**
   * deposite $TOKE token
   */
  const handleDeposite = async () => {
    
    if (!isWalletConnected) {
      toast.error(PLEASECONNECTWALLET, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    if (Number(tokenAmount) <= 0) {
      toast.error(INPUTDEPOSITEAMOUNT, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    const balance: any = await getBalanceOfUserTokenAccount();
    if (balance == undefined) {
      console.log("balance not evaluated;");
      toast.error(ONCONNECTION, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      return;
    }
    setBalance1(balance);
    if (Number(tokenAmount) >= balance) {
      console.log("token not enough", balance);
      toast.error(NOTENOUGHBALANCE, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return
    }
    try {
      setIsInputDisabled(true);
      await depositToken(
        Number(tokenAmount)
      );
      mappingStatusTo(Status.AFTER_DEPOSITE);
      
    } catch (error) {
      console.log("Error happened in deposit")
    }
   
  };
  const handleSpin = () => {
    mappingStatusTo(Status.BEFORE_SPIN);
    setIsInputDisabled(false);
    /**start api call for spin */
    /**end api call for spin */
    // setTokenAmount("");
    // depositToken(Number(tokenAmount));
  };

  const showHelp = () => {
    console.log("Help");
    setHelpAnchor(!helpAnchor);
  };

  // const showHistory = () => {
  //   console.log("History");
  //   setHistoryAnchor(!historyAnchor);
  // };



  useEffect(() => {
    if (wallet.connected) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
      mappingStatusTo(Status.BEFORE_DEPOSITE);
    }
  }, [wallet, wallet.connected]);

  /**
   * This function and the sub-functions used here is not necessary
   * because, it creates temp token,
   * you won't use this function after you make fixed tokens for game
   */
  // const createToken = async () => {
  //   await createMint();
  //   await createTokenAccount();
  //   await mintToGamTokenAccount(1000);
  // };

  return (
    <>
      {/* <button onClick={createToken}>Create Token</button> */}
      {/* <button onClick={() => depositToken(20)}>to GameWallet</button> */}
      {/* <button onClick={() => sendToUser(20)}>to User</button> */}
      {/* <button onClick={() => burnToken(5)}>Burn at game wallet</button> */}
      <Grid
        container
        flexDirection={"column"}
        justifyContent={"center"}
        gap={"20px"}
        position={"absolute"}
      >
        <Typography
          fontFamily={"Acme"}
          fontSize={"44px"}
          fontStyle={"normal"}
          fontWeight={500}
          lineHeight={"50px"}
          textAlign={"center"}
          className="fair-betting"
        >
           WHEEL OF TOKE
        </Typography>
        <Grid container justifyContent={"center"}>
          <Roulette tokenAmount={tokenAmount} sendToUser={sendToUser} burnToken={burnToken}/>
        </Grid>
        <Grid container justifyContent={"center"}>
          <Typography
            color={"#777FB6"}
            fontFamily={"k"}
            fontSize={"14px"}
            fontStyle={"normal"}
            fontWeight={800}
            lineHeight={"20px"}
            textAlign={"center"}
            textTransform={"uppercase"}
          >
            select amount:
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          sx={{
            paddingX: "16px",
            paddingY: "14px",
            alignItems: "center",
            gap: "10px",
            borderRadius: "12px",
            border: "1px solid #212631",
            bgcolor: "#1C202C",
            width: { sm: "500px", xs: "80%" },
            height: "56px",
            margin: "auto",
            background: "#040824",
          }}
        >
          <img src={TOKENLOGO} alt="TOKENLOGO"></img>
          <input
            type="text"
            // pattern="^[0-9]*[.,]?[0-9]*$"
            className="deposite-amount"
            placeholder="0.00"
            value={tokenAmount}
            disabled={isInputDisabled}
            onChange={handleTokenAmount}
          />
          <Typography
            color={"#777FB6"}
            fontFamily={"Rubik"}
            fontSize={"14px"}
            fontStyle={"normal"}
            fontWeight={500}
            lineHeight={"20px"}
            textAlign={"center"}
          >
            $TOKE
          </Typography>
        </Grid>
        <Grid container justifyContent={"center"} marginBottom={"85px"}>
          <Button
            variant="contained"
            sx={{
              fontSize: "18px",
              display: "flex",
              width: { sm: "500px", xs: "80%" },
              height: "48px",
              padding: "12px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              background:
                "var(--Prime-Gradient, linear-gradient(180deg, #00B0F8 0%, #00ADEA 100%))",
              borderRadius: "8px",
            }}
            onClick={
              status == Status.BEFORE_DEPOSITE || status == Status.AFTER_SPIN
                ? handleDeposite
                : handleSpin
            }

          >
            <Typography
              color={"#FFF"}
              fontFamily={"Acme"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={400}
              lineHeight={"24px"}
              textAlign={"center"}
            >
              {status == Status.BEFORE_DEPOSITE || status == Status.AFTER_SPIN
                ? "DEPOSIT NOW"
                : "SPIN NOW"}
            </Typography>
          </Button>
        </Grid>
        <Grid
          position={"absolute"}
          right={"0px"}
          top={{ xs: "10%", md: "50%" }}
          sx={{
            transform: "translateY(-50%)",
          }}
        >
          <Grid
            container
            marginBottom={"10px"}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              display: "flex",
              padding: "12px 24px 12px 12px",
              alignItems: "cente",
              gap: "10px",
              borderRadius: "100px 0px 0px 100px",
              background: "linear-gradient(180deg, #333A71 0%, #1A204F 100%)",
              boxShadow:
                "0px -2.5px 0px 0px #141A43 inset, 0px 2px 0px 0px #3A427B inset, -2px 12px 16px 0px rgba(0, 0, 0, 0.16)",
            }}
            onClick={showHelp}
          >
            <Drawer
              anchor={"right"}
              open={helpAnchor}
              onClose={() => setHelpAnchor(!helpAnchor)}
            >
              <Grid
                sx={{
                  background: "#091042",
                  width: { xs: "100%", sm: "500px" },
                  height: "100vh",
                }}
              >
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    padding: "24px",
                    gap: "8px",
                    borderBottom: "1px solid #202754",
                  }}
                >
                  <Grid container gap={"10px"} width={"fit-content"}>
                    <img src={INFO} alt="INFO" />
                    <Typography
                      color={"#FFF"}
                      fontFamily={"Acme"}
                      fontSize={"16px"}
                      fontStyle={"normal"}
                      fontWeight={400}
                      lineHeight={"20px"}
                      textAlign={"center"}
                    >
                      How fair is the spin?
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    alignItems={"center"}
                    width={"fit-content"}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <img src={CROSS} alt="CROSS" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  flexDirection={"column"}
                  sx={{
                    paddingX: "24px",
                    paddingY: "16px",
                    gap: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontFamily: "Acme",
                      fontSize: "16px",
                      fontStyle: "normal",
                      lineHeight: "24px",
                    }}
                  >
                    Let’s us explain what makes out platform using a fair play
                    policy for you in this platform.
                  </Typography>
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontFamily: "Acme",
                      fontSize: "16px",
                      fontStyle: "normal",
                      lineHeight: "24px",
                    }}
                  >
                    How the logic we use on the platform:
                  </Typography>
                  <List
                    sx={{
                      color: "#FFF",
                      fontFamily: "Acme",
                      fontSize: "16px",
                      fontStyle: "normal",
                      lineHeight: "24px",
                      listStyle: "disc",
                      paddingLeft: "24px",
                    }}
                  >
                    <li key={"draw"}>2 for DRAW (25% odds)</li>
                    <li key={"double"}>2 for DOUBLE (25% odds)</li>
                    <li key={"lose"}>2 for LOSE (25% odds)</li>
                    <li key={"burn"}>2 for BURN (25% odds)</li>
                  </List>
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontFamily: "Acme",
                      fontSize: "16px",
                      fontStyle: "normal",
                      lineHeight: "24px",
                    }}
                  >
                    Let’s us explain what makes out platform using a fair play
                    policy for you in this platform.
                  </Typography>
                </Grid>
              </Grid>
            </Drawer>
            <img src={INFO} alt="INFO" />
            <Typography
              color={"#FFF"}
              fontFamily={"Acme"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={400}
              lineHeight={"20px"}
              textAlign={"center"}
              display={{ xs: "none", md: "block" }}
            >
              How fair is the spin?
            </Typography>
          </Grid>
          {/* <Grid
            container
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              float: "right",
              display: "flex",
              padding: "12px 24px 12px 12px",
              alignItems: "cente",
              gap: "10px",
              borderRadius: "100px 0px 0px 100px",
              background: "linear-gradient(180deg, #333A71 0%, #1A204F 100%)",
              boxShadow:
                "0px -2.5px 0px 0px #141A43 inset, 0px 2px 0px 0px #3A427B inset, -2px 12px 16px 0px rgba(0, 0, 0, 0.16)",
            }}
            onClick={showHistory}
          >
            <Drawer
              anchor={"right"}
              open={historyAnchor}
              onClose={() => setHelpAnchor(!historyAnchor)}
            >
              <Grid
                sx={{
                  background: "#091042",
                  width: { xs: "100%", sm: "500px" },
                  height: "100vh",
                  overflowY: "auto",
                }}
              >
                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    padding: "24px",
                    gap: "8px",
                    borderBottom: "1px solid #202754",
                  }}
                >
                  <Grid container gap={"10px"} width={"fit-content"}>
                    <img src={HISTORY} alt="HISTORY" />
                    <Typography
                      color={"#FFF"}
                      fontFamily={"Acme"}
                      fontSize={"16px"}
                      fontStyle={"normal"}
                      fontWeight={400}
                      lineHeight={"20px"}
                      textAlign={"center"}
                    >
                      Betting History
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    alignItems={"center"}
                    width={"fit-content"}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <img src={CROSS} alt="CROSS" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  flexDirection={"column"}
                  sx={{
                    paddingX: "24px",
                    paddingY: "12px",
                    gap: "12px",
                  }}
                >
                  {bettingHistory.map((history, index) => {
                    return (
                      <div key={index}>
                        <Grid
                          container
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          sx={{
                            gap: "14px",
                          }}
                        >
                          <img src={history.image} alt="image" />
                          <Typography
                            sx={{
                              color: "#FFF",
                              fontFamily: "Rubik",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "24px",
                            }}
                          >
                            {history.bettingResult}
                            <br />
                            <span className="amount">Amount: </span>
                            {history.bettingAmount} $TOKE
                          </Typography>
                          <Typography>
                            <span className="prizeAmount">
                              {history.prizeAmount} $TOKE
                            </span>
                            <br />
                            <span className="date">{history.date}</span>
                          </Typography>
                        </Grid>
                      </div>
                    );
                  })}
                </Grid>
              </Grid>
            </Drawer>
            <img src={HISTORY} alt="HISTORY" />
            <Typography
              color={"#FFF"}
              fontFamily={"Acme"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={400}
              lineHeight={"20px"}
              textAlign={"center"}
              display={{ xs: "none", md: "block" }}
            >
              History
            </Typography>
          </Grid> */}
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default Home;
