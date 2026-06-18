/**
 * Form component for adding/editing expenses
 */

import React, { useEffect, useState } from "react";
import { ExpenseFormData } from "../types";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { createCategory, fetchCategories } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const categoryRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
  };

  const categorySelectStyle: React.CSSProperties = {
    flex: 1,
  };

  // Load the latest categories whenever the form is opened.
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create a new category and immediately update the select options.
  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required");
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError("");

    try {
      const createdCategory = await createCategory(trimmedName);
      await loadCategories();
      handleChange("category", createdCategory.name);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      setCategoryError("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div style={categoryRowStyle}>
        <div style={categorySelectStyle}>
          <SelectBox
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            fullWidth
            required
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsCategoryModalOpen(true)}
          disabled={isSubmitting}
        >
          Add Category
        </Button>
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setNewCategoryName("");
          setCategoryError("");
        }}
        title="Add New Category"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            label="Category Name"
            type="text"
            placeholder="e.g. Savings"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              if (categoryError) setCategoryError("");
            }}
            error={categoryError}
            fullWidth
            required
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setNewCategoryName("");
                setCategoryError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateCategory}
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
