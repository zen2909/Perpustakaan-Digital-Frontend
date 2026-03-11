import api from "./api";

export const monthlyfines = () => {
  return api.get("/loans/monthly-fines");
};
export const monthlyloans = () => {
  return api.get("/loans/monthly-loans");
};
