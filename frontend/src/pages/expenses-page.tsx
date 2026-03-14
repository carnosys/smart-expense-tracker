import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { listCategories } from "../api/categories";
import { createExpense, deleteExpense, listExpenses, updateExpense } from "../api/expenses";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorAlert } from "../components/ui/error-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../components/ui/table";
import { useAuth } from "../features/auth/use-auth";
import { ExpenseFilters } from "../features/expenses/expense-filters";
import { ExpenseFormPanel } from "../features/expenses/expense-form-panel";
import { formatCurrency } from "../lib/format";
import type { Expense } from "../types/expenses";

function toApiFromDate(value: string) {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00`).toISOString();
}

function toApiToDate(value: string) {
  if (!value) return undefined;
  return new Date(`${value}T23:59:59`).toISOString();
}

export function ExpensesPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);

  const page = Number(searchParams.get("page") ?? "1");
  const sort = searchParams.get("sort") ?? "-occurred_at";
  const categoryId = searchParams.get("category_id") ?? "";
  const fromDate = searchParams.get("from_date") ?? "";
  const toDate = searchParams.get("to_date") ?? "";

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(token!),
  });

  const expensesQuery = useQuery({
    queryKey: ["expenses", page, sort, categoryId, fromDate, toDate],
    queryFn: () =>
      listExpenses(token!, {
        page,
        limit: 20,
        sort,
        category_id: categoryId || undefined,
        from_date: toApiFromDate(fromDate),
        to_date: toApiToDate(toDate),
      }),
  });

  const categoryLookup = useMemo(() => {
    return new Map((categoriesQuery.data ?? []).map((category) => [category.id, category.name]));
  }, [categoriesQuery.data]);

  const saveExpenseMutation = useMutation({
    mutationFn: async (payload: {
      category_id: number;
      amount: number;
      occurred_at: string;
      title: string;
      note: string;
    }) => {
      if (editingExpense) {
        return updateExpense(token!, editingExpense.id, payload);
      }
      return createExpense(token!, payload);
    },
    onSuccess: async () => {
      setError(null);
      setEditingExpense(null);
      setIsPanelOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (caughtError) => {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save expense");
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: number) => deleteExpense(token!, expenseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  return (
    <main className="space-y-6">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Expenses</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Track every outflow</h1>
          </div>
          <Button
            onClick={() => {
              setEditingExpense(null);
              setError(null);
              setIsPanelOpen(true);
            }}
            type="button"
          >
            Add expense
          </Button>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] px-6 py-6">
        <ExpenseFilters
          categories={categoriesQuery.data ?? []}
          categoryId={categoryId}
          fromDate={fromDate}
          onCategoryChange={(value) => updateParam("category_id", value)}
          onFromDateChange={(value) => updateParam("from_date", value)}
          onReset={() => setSearchParams(new URLSearchParams())}
          onSortChange={(value) => updateParam("sort", value)}
          onToDateChange={(value) => updateParam("to_date", value)}
          sort={sort}
          toDate={toDate}
        />
      </Card>

      {expensesQuery.error ? (
        <ErrorAlert
          message={
            expensesQuery.error instanceof Error
              ? expensesQuery.error.message
              : "Unable to load expenses"
          }
        />
      ) : null}

      {expensesQuery.data && expensesQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Occurred at</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesQuery.data.items.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{categoryLookup.get(expense.category_id) ?? expense.category_id}</TableCell>
                  <TableCell>{expense.occurred_at.slice(0, 10)}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingExpense(expense);
                          setError(null);
                          setIsPanelOpen(true);
                        }}
                        type="button"
                        variant="secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteExpenseMutation.mutate(expense.id)}
                        type="button"
                        variant="ghost"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Page {expensesQuery.data.meta.page} of {expensesQuery.data.meta.pages}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                type="button"
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                disabled={page >= expensesQuery.data.meta.pages}
                onClick={() => setPage(Math.min(expensesQuery.data.meta.pages, page + 1))}
                type="button"
                variant="secondary"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          description="Add an expense or adjust the filters to start seeing monthly activity."
          title="No expenses found"
        />
      )}

      <ExpenseFormPanel
        categories={categoriesQuery.data ?? []}
        error={error}
        expense={editingExpense}
        isSubmitting={saveExpenseMutation.isPending}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={(payload) => saveExpenseMutation.mutateAsync(payload)}
        open={isPanelOpen}
      />
    </main>
  );
}
