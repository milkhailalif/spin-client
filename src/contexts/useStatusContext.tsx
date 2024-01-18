import { createContext, useContext } from "react";
import { Status } from "src/constants/Constants";

interface StatusContextType {
  status: Status;
  mappingStatusTo: (bal: Status) => void;
}

export const StatusContext = createContext<StatusContextType>({
  status: Status.BEFORE_DEPOSITE,
  mappingStatusTo: () => {},
});

export const useStatusContext = () => {
  return useContext(StatusContext);
};
