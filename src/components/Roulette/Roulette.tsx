import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import DOUBLE from "assets/img/double1.png";
import BURN from "assets/img/burn.png";
import DRAW from "assets/img/draw.png";
import BOMB from "assets/img/bomb.png";
import { Wheel } from "./components/Wheel";
// import { getRandomInt } from "./utils";
import { Status } from "src/constants/Constants";
import { useStatusContext } from "src/contexts/useStatusContext";
import { usePrizeNumberContext } from "src/contexts/usePrizeNumberContext";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#091042",
  maxWidth: "450px",
  height: "fit-content",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  borderRadius: "0px 0px 16px 16px",
  borderColor: "#091042",
};

const Roulette = ({ tokenAmount, sendToUser, burnToken }: { tokenAmount: any, sendToUser: (tokenAmount: number) => void, burnToken: (tokenAmount: number) => void }) => {

  const { status, mappingStatusTo } = useStatusContext();
  const { prizeNumber, setPrizeNumber } = usePrizeNumberContext();
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);

  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    // Make a request to the backend to access the getRandomInt function
    const fetchRandomNumber = async () => {
      try {
        const response = await axios.get('https://spin-server.vercel.app/getRandomInt');
        setRandomNumber(response.data.result);

      } catch (error) {
        console.error('Error fetching random number:', error);
      }
    };
    fetchRandomNumber();
  });

  const handleOpen = () => setOpen(true);
  const handleCollect = () => {
    setOpen(false);
    mappingStatusTo(Status.AFTER_SPIN);
    if (prizeNumber % 4 == 1) {
      sendToUser(3 * Number(tokenAmount));
    }
    if (prizeNumber % 4 == 2) {
      sendToUser(2 * Number(tokenAmount));
    }
    if (prizeNumber % 4 == 3) {
      burnToken(Number(tokenAmount));
    }

  };

  const handleDeplayedOpen = () => {
    setTimeout(() => {
      handleOpen();
      // // transfer();
    }, 1000);
  };

  const onClick = () => {
    if (!spinning) {
      setSpinning(true);
      console.log(randomNumber);
      setPrizeNumber(randomNumber);
      setMustSpin(true);
    }
  };

  useEffect(() => {
    if (status == Status.BEFORE_SPIN) {
      onClick();
    }
  }, [status]);

  return (
    <>
      <div className="wheelContainer">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={() => {
            setSpinning(false);
            setMustSpin(false);
            handleDeplayedOpen();
          }}
        />
      </div>
      <Modal open={open} sx={{ background: "#090E33" }}>
        <Box sx={style}>
          <Typography
            color={"#FFF"}
            textAlign={"center"}
            fontFamily={"Acme"}
            fontSize={"28px"}
            fontStyle={"normal"}
            fontWeight={400}
            lineHeight={"37px"}
          >
            {prizeNumber % 4 == 1
              ? "Congratulations!!! You win Double Prize"
              : prizeNumber % 4 == 2
                ? "you got burn Good luck next time!"
                : prizeNumber % 4 == 3
                  ? "Good!!! You get a draw"
                  : "You got bombed! better luck next time"}
          </Typography>
          <Grid>
            {prizeNumber % 4 === 1 ? (
              <img src={DOUBLE} alt="double" />
            ) : prizeNumber % 4 === 2 ? (
              <img src={BURN} alt="DRAW" />
            ) : prizeNumber % 4 === 3 ? (
              <img src={DRAW} alt="BURN" />
            ) : (
              <img src={BOMB} alt="BOMB" />
            )}
          </Grid>
          <Grid container flexDirection={"column"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              sx={{
                fontSize: "18px",
                display: "flex",
                height: "48px",
                padding: "12px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                background:
                  "var(--Prime-Gradient, linear-gradient(180deg, #00B0F8 0%, #00ADEA 100%))",
                borderRadius: "8px",
              }}
              onClick={handleCollect}
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
                {prizeNumber % 4 == 1 ? "Collect" : "Back"}
              </Typography>
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Roulette;
