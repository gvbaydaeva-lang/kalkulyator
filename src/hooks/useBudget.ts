import { useEffect, useState, useCallback } from "react";
import { BudgetState, Category, Entry, MonthData } from "@/types/budget";

const STORAGE_KEY = "budget-app-v1";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "c-salary", name: "Зарплата", emoji: "💼", kind: "income" },
  { id: "c-freelance", name: "Фриланс", emoji: "💻", kind: "income" },
  { id: "c-food", name: "Продукты", emoji: "🛒", kind: "expense" },
  { id: "c-transport", name: "Транспорт", emoji: "🚗", kind: "expense" },
  { id: "c-cafe", name: "Кафе", emoji: "☕", kind: "expense" },
  { id: "c-housing", name: "Жильё", emoji: "🏠", kind: "expense" },
];

const initialState: BudgetState = {
  categories: DEFAULT_CATEGORIES,
  months: {},
};

const load = (): BudgetState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      months: parsed.months ?? {},
    };
  } catch {
    return initialState;
  }
};

export const useBudget = () => {
  const [state, setState] = useState<BudgetState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getMonth = useCallback(
    (key: string): MonthData => state.months[key] ?? { entries: [] },
    [state.months]
  );

  const addEntry = useCallback((monthK: string, entry: Omit<Entry, "id">) => {
    setState((s) => {
      const month = s.months[monthK] ?? { entries: [] };
      const newEntry: Entry = { ...entry, id: crypto.randomUUID() };
      return {
        ...s,
        months: { ...s.months, [monthK]: { entries: [...month.entries, newEntry] } },
      };
    });
  }, []);

  const removeEntry = useCallback((monthK: string, entryId: string) => {
    setState((s) => {
      const month = s.months[monthK];
      if (!month) return s;
      return {
        ...s,
        months: {
          ...s.months,
          [monthK]: { entries: month.entries.filter((e) => e.id !== entryId) },
        },
      };
    });
  }, []);

  const addCategory = useCallback((cat: Omit<Category, "id">) => {
    const newCat: Category = { ...cat, id: crypto.randomUUID() };
    setState((s) => ({ ...s, categories: [...s.categories, newCat] }));
    return newCat;
  }, []);

  const removeCategory = useCallback((id: string) => {
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }));
  }, []);

  return { state, getMonth, addEntry, removeEntry, addCategory, removeCategory };
};
