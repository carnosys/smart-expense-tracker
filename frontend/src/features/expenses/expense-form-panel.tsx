import { useEffect, useState } from "react";

import { Button } from "../../components/ui/button";
import { ErrorAlert } from "../../components/ui/error-alert";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { SlideOver } from "../../components/ui/slide-over";
import type { Category } from "../../types/categories";
import type { Expense } from "../../types/expenses";

type ExpenseFormPanelProps = {
  open: boolean;
  expense: Expense | null;
  categories: Category[];
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    category_id: number;
    amount: number;
    occurred_at: string;
    title: string;
    note: string;
  }) => Promise<unknown>;
};

function toDateTimeInputValue(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function ExpenseFormPanel({
  open,
  expense,
  categories,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: ExpenseFormPanelProps) {
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setCategoryId(expense ? String(expense.category_id) : String(categories[0]?.id ?? ""));
    setAmount(expense ? String(expense.amount) : "");
    setOccurredAt(expense ? toDateTimeInputValue(expense.occurred_at) : "");
    setTitle(expense?.title ?? "");
    setNote(expense?.note ?? "");
  }, [categories, expense]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      category_id: Number(categoryId),
      amount: Number(amount),
      occurred_at: new Date(occurredAt).toISOString(),
      title,
      note,
    });
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={expense ? "Edit expense" : "Add expense"}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <ErrorAlert message={error} /> : null}
        <Select
          label="Category"
          options={categories.map((category) => ({
            label: category.name,
            value: String(category.id),
          }))}
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        />
        <Input
          label="Amount"
          min="0"
          step="0.01"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input
          label="Occurred at"
          type="datetime-local"
          value={occurredAt}
          onChange={(event) => setOccurredAt(event.target.value)}
        />
        <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Note
          <textarea
            className="min-h-32 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : expense ? "Save expense" : "Create expense"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
