export type ReportSummary = {
  total_expenses: number;
  total_amount: number;
};

export type CategoryBreakdownItem = {
  category_id: number;
  category_name: string | null;
  total_amount: number;
  total_expenses: number;
};

export type ReportExpense = {
  id: number;
  category_id: number;
  category_name: string | null;
  amount: number;
  occurred_at: string;
  title: string;
  note: string;
};

export type MonthlyReport = {
  month: number;
  year: number;
  start_at: string;
  end_at: string;
  month_summary: ReportSummary;
  category_breakdown: CategoryBreakdownItem[];
  top_5_categories: CategoryBreakdownItem[];
  expenses: ReportExpense[];
};
