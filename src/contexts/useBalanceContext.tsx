import { createContext, useContext } from "react";

interface BalanceContextType {
  balance1: number;
  setBalance1: (bal: number) => void;
}

export const BalanceContext = createContext<BalanceContextType>({
  balance1: 0,
  setBalance1: () => {},
});

export const useBalanceContext = () => {
  return useContext(BalanceContext);
};
