export const getRotationDegrees = (
  prizeNumber: number,
  numberOfPrizes: number
) => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const prizeRotation = degreesPerPrize * (numberOfPrizes - prizeNumber);

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2
    ? -360 + prizeRotation
    : prizeRotation;
};

