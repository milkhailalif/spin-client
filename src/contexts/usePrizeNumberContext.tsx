import { createContext, useContext } from "react";

interface PrizeNumberContextType {
  prizeNumber: number;
  setPrizeNumber: (num: number) => void;
}

export const PrizeNumberContext = createContext<PrizeNumberContextType>({
  prizeNumber: 0,
  setPrizeNumber: () => {},
});

export const usePrizeNumberContext = () => {
  return useContext(PrizeNumberContext);
};
