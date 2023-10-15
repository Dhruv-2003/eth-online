import React, { createContext, useContext } from "react";

export const AuthContext = React.createContext<any>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
