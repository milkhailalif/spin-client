import React, { useState, useEffect, useRef } from "react";
import SPINBOARD from "assets/img/spin-board.png";
import MOBILESPINBOARD from "assets/img/mobile-spin-board.png";
import Marker from "assets/svg/pointer.svg";
import LEFTSTARS from "assets/svg/left_stars.svg";
import RIGHTSTARS from "assets/svg/right_stars.svg";
import { getRotationDegrees } from "../utils";
import { RotationContainer } from "./styles";
import { Grid } from "@mui/material";

const STARTED_SPINNING = "started-spinning";
const START_SPINNING_TIME = 800;
const CONTINUE_SPINNING_TIME = 400;
const STOP_SPINNING_TIME = 4000;

interface WheelProps {
  mustStartSpinning: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
}

export const Wheel: React.FC<WheelProps> = ({
  mustStartSpinning,
  prizeNumber,
  onStopSpinning,
}) => {
  const [startrotationdegrees, setstartrotationdegrees] = useState<number>(0);
  const [finalrotationdegrees, setfinalrotationdegrees] = useState<number>(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState<boolean>(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState<boolean>(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState<boolean>(false);
  const mustStopSpinning = useRef<boolean>(false);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 300);
  };

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalrotationdegreesCalculated = getRotationDegrees(
        prizeNumber,
        8
      );
      setfinalrotationdegrees(finalrotationdegreesCalculated);
    }
  }, [mustStartSpinning,prizeNumber]);

  useEffect(() => {

    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setstartrotationdegrees(finalrotationdegrees);
    }
  }, [hasStoppedSpinning,finalrotationdegrees]);

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return "";
  };

  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <RotationContainer
          className={getRouletteClass()}
          startspinningtime={START_SPINNING_TIME}
          continuespinningtime={CONTINUE_SPINNING_TIME}
          stopspinningtime={STOP_SPINNING_TIME}
          startrotationdegrees={startrotationdegrees}
          finalrotationdegrees={finalrotationdegrees}
        >
          <Grid display={{ xs: "block", sm: "none" }}>
            <img src={MOBILESPINBOARD} alt="wheel" />
          </Grid>
          <Grid display={{ xs: "none", sm: "block" }}>
            <img src={SPINBOARD} alt="wheel" />
          </Grid>
        </RotationContainer>
        <img
          src={Marker}
          alt="marker"
          style={{
            position: "absolute",
            right: "0%",
            top: "0%",
            transform: "rotate(135deg) translate(50%, 50%)",
            width: "70px",
          }}
        />
        <Grid
          display={{ xs: "none", sm: "block" }}
          sx={{
            zIndex: -5,
            position: "absolute",
            top: "50%",
            left: "0%",
            transform: "translate(-60%, -50%)",
          }}
        >
          <img src={LEFTSTARS} alt="LEFTSTARS" />
        </Grid>
        <Grid
          display={{ xs: "none", sm: "block" }}
          sx={{
            position: "absolute",
            top: "50%",
            right: "0%",
            transform: "translate(60%, -50%)",
          }}
        >
          <img src={RIGHTSTARS} alt="RIGHTSTARS" />
        </Grid>
      </div>
    </>
  );
};
