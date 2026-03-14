export type Expense = {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  occurred_at: string;
  title: string;
  note: string;
};

export type ExpensePayload = {
  category_id: number;
  amount: number;
  occurred_at: string;
  title: string;
  note: string;
};

export type ExpenseListResponse = {
  items: Expense[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
