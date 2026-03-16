// Utility script file
export const initializeApp = () => {
  console.log("App initialized");
};

export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};
