export type Task = {
  id: number;
  index: number;
  startDate: Date;
  endDate: Date;
  result: number;
  previousResult: number;
  percentage: number;
  active: boolean;
};

export const tokenConfig = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
  }
};
