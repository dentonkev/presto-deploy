import { createContext, useState, type ReactNode } from "react";
import ErrorModal from "../components/ErrorModal";

const ErrorContext = createContext<(msg: string) => void>(() => {});

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const showErrorMsg = (msg: string) => setErrorMsg(msg);
  const clearErrorMsg = () => setErrorMsg("");

  return (
    <ErrorContext.Provider value={showErrorMsg}>
      {children}
      {errorMsg && <ErrorModal message={errorMsg} onClose={clearErrorMsg} />}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
