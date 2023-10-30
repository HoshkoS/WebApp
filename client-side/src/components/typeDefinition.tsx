export type Task = {
  id: number;
  index: number;
  startDate: Date;
  endDate: Date;
  Results: number;
  percentsDone: number;
  active: boolean;
};

export const tokenConfig = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
  }
};
