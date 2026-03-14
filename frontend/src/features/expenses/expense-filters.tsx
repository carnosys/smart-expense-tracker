import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import type { Category } from "../../types/categories";

type ExpenseFiltersProps = {
  categories: Category[];
  categoryId: string;
  fromDate: string;
  toDate: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

const sortOptions = [
  { label: "Latest first", value: "-occurred_at" },
  { label: "Oldest first", value: "occurred_at" },
  { label: "Highest amount", value: "-amount" },
  { label: "Lowest amount", value: "amount" },
];

export function ExpenseFilters({
  categories,
  categoryId,
  fromDate,
  toDate,
  sort,
  onCategoryChange,
  onFromDateChange,
  onToDateChange,
  onSortChange,
  onReset,
}: ExpenseFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Select
        label="Category"
        options={[
          { label: "All categories", value: "" },
          ...categories.map((category) => ({ label: category.name, value: String(category.id) })),
        ]}
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
      />
      <Input
        label="From date"
        type="date"
        value={fromDate}
        onChange={(event) => onFromDateChange(event.target.value)}
      />
      <Input
        label="To date"
        type="date"
        value={toDate}
        onChange={(event) => onToDateChange(event.target.value)}
      />
      <Select
        label="Sort"
        options={sortOptions}
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
      />
      <div className="flex items-end">
        <Button className="w-full" onClick={onReset} type="button" variant="secondary">
          Reset filters
        </Button>
      </div>
    </div>
  );
}
