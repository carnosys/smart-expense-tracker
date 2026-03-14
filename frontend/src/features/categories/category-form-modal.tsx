import { useEffect, useState } from "react";

import { Button } from "../../components/ui/button";
import { ErrorAlert } from "../../components/ui/error-alert";
import { Input } from "../../components/ui/input";
import { Modal } from "../../components/ui/modal";
import type { Category } from "../../types/categories";

type CategoryFormModalProps = {
  open: boolean;
  category: Category | null;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string }) => Promise<unknown>;
};

export function CategoryFormModal({
  open,
  category,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
  }, [category]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ name, description });
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit category" : "Create category"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <ErrorAlert message={error} /> : null}
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : category ? "Save changes" : "Create category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
