import React, { createContext, useContext, useState } from "react";

const PhoneVisibilityContext = createContext();

export const usePhoneVisibility = () => {
  const context = useContext(PhoneVisibilityContext);
  if (!context) {
    throw new Error(
      "usePhoneVisibility must be used within a PhoneVisibilityProvider"
    );
  }
  return context;
};

export const PhoneVisibilityProvider = ({ children }) => {
  const [visiblePhoneId, setVisiblePhoneId] = useState(null);

  const showPhone = (phoneId) => {
    setVisiblePhoneId(phoneId);
  };

  const hidePhone = () => {
    setVisiblePhoneId(null);
  };

  const isPhoneVisible = (phoneId) => {
    return visiblePhoneId === phoneId;
  };

  const value = {
    visiblePhoneId,
    showPhone,
    hidePhone,
    isPhoneVisible,
  };

  return (
    <PhoneVisibilityContext.Provider value={value}>
      {children}
    </PhoneVisibilityContext.Provider>
  );
};
