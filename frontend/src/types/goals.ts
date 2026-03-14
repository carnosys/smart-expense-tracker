export type Goal = {
  id: number;
  user_id: number;
  created_at: string;
  goal_limit: number;
};

export type GoalPayload = {
  goal_limit: number;
};

export type GoalProgress = {
  goal_id: number;
  month: number;
  year: number;
  goal_limit: number;
  total_expense: number;
  difference: number;
};
