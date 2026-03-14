import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategory, deleteCategory, listCategories, updateCategory } from "../api/categories";
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
import { CategoryFormModal } from "../features/categories/category-form-modal";
import type { Category } from "../types/categories";

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(token!),
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (payload: { name: string; description: string }) => {
      if (editingCategory) {
        return updateCategory(token!, editingCategory.id, payload);
      }
      return createCategory(token!, payload);
    },
    onSuccess: async () => {
      setError(null);
      setModalOpen(false);
      setEditingCategory(null);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (caughtError) => {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => deleteCategory(token!, categoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function handleCreate() {
    setEditingCategory(null);
    setError(null);
    setModalOpen(true);
  }

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setError(null);
    setModalOpen(true);
  }

  return (
    <main className="space-y-6">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Categories
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Organize your spending buckets</h1>
          </div>
          <Button onClick={handleCreate} type="button">
            Add category
          </Button>
        </div>
      </Card>

      {categoriesQuery.error ? (
        <ErrorAlert
          message={
            categoriesQuery.error instanceof Error
              ? categoriesQuery.error.message
              : "Unable to load categories"
          }
        />
      ) : null}

      {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesQuery.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(category)} type="button" variant="secondary">
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
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
      ) : (
        <EmptyState
          description="Create categories like groceries, housing, and transport to keep the dashboard readable."
          title="No categories yet"
        />
      )}

      <CategoryFormModal
        category={editingCategory}
        error={error}
        isSubmitting={saveCategoryMutation.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={(payload) => saveCategoryMutation.mutateAsync(payload)}
        open={modalOpen}
      />
    </main>
  );
}
