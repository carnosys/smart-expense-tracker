import { useEffect, useState } from "react";

import { Button } from "../../components/ui/button";
import { ErrorAlert } from "../../components/ui/error-alert";
import { Input } from "../../components/ui/input";
import { Modal } from "../../components/ui/modal";
import type { Goal } from "../../types/goals";

type GoalFormModalProps = {
  open: boolean;
  goal: Goal | null;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: { goal_limit: number }) => Promise<unknown>;
};

export function GoalFormModal({
  open,
  goal,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: GoalFormModalProps) {
  const [goalLimit, setGoalLimit] = useState("");

  useEffect(() => {
    setGoalLimit(goal ? String(goal.goal_limit) : "");
  }, [goal]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ goal_limit: Number(goalLimit) });
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Update goal" : "Set monthly goal"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? <ErrorAlert message={error} /> : null}
        <Input
          label="Goal limit"
          min="0"
          step="0.01"
          type="number"
          value={goalLimit}
          onChange={(event) => setGoalLimit(event.target.value)}
        />
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : goal ? "Save goal" : "Create goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
