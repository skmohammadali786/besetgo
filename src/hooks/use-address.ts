
"use client";

import { useContext } from "react";
import { AddressContext } from "@/contexts/address-provider";

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
