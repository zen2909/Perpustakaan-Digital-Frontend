import api from "./api";

export const monthlyfines = () => {
  return api.get("/loans/monthly-fines");
};
export const monthlyloans = () => {
  return api.get("/loans/monthly-loans");
};
export const getAllLoans = () => {
  return api.get("/loans/all");
};
export const getLoan = (id) => {
  return api.get(`/loans/${id}`);
};

export const approveLoan = (id) => {
  return api.post(`/loans/${id}/approve`);
};

export const scanBorrow = (data) => {
  return api.post("/loans/scan-borrow", data);
};

export const scanReturn = (data) => {
  return api.post("/loans/scan-return", data);
};
export const deleteLoan = (id) => {
  return api.delete(`/admin/loans/${id}`);
};

export const createFinePayment = (loanId) => {
  return api.post(`/payments/fine/${loanId}`);
};

export const getPaymentStatus = (loanId) => {
  return api.get(`/payments/fine/${loanId}/status`);
};

export const getMemberloans = () => {
  return api.get("/loans");
};
export const storeLoan = (data) => {
  return api.post("/loans", data);
};
export const getTotalLoans = () => {
  return api.get("/loans/total-loans");
};
export const getTotalActiveLoans = () => {
  return api.get("/loans/total-active-loans");
};
export const getTotalOverdueLoans = () => {
  return api.get("/loans/total-overdue-loans");
};
export const getTotalFinesToday = () => {
  return api.get("/loans/total-fines-today");
};
export const getTotalFinesMonth = () => {
  return api.get("/loans/total-fines-month");
};
