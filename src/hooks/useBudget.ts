import { useEffect, useState, useCallback } from "react";
import { BudgetState, Category, Entry, MonthData } from "@/types/budget";

const STORAGE_KEY = "budget-app-v1";

const DEFAULT_CATEGORIES: Category[] = [
  // Доходы
  { id: "c-salary", name: "Зарплата", emoji: "💼", kind: "income" },
  { id: "c-freelance", name: "Фриланс", emoji: "💻", kind: "income" },
  { id: "c-bonus", name: "Премия", emoji: "🎁", kind: "income" },
  { id: "c-investments", name: "Инвестиции", emoji: "📈", kind: "income" },
  { id: "c-other-income", name: "Прочее", emoji: "✨", kind: "income" },
  // Расходы — самые популярные
  { id: "c-food", name: "Продукты", emoji: "🛒", kind: "expense" },
  { id: "c-transport", name: "Транспорт", emoji: "🚗", kind: "expense" },
  { id: "c-cafe", name: "Кафе и рестораны", emoji: "☕", kind: "expense" },
  { id: "c-housing", name: "Жильё и ЖКХ", emoji: "🏠", kind: "expense" },
  { id: "c-clothes", name: "Одежда", emoji: "👕", kind: "expense" },
  { id: "c-marketplace", name: "Маркетплейсы", emoji: "📦", kind: "expense" },
  { id: "c-education", name: "Образование", emoji: "🎓", kind: "expense" },
  { id: "c-kids", name: "Дети и садик", emoji: "🧸", kind: "expense" },
  { id: "c-subscriptions", name: "Подписки", emoji: "🔁", kind: "expense" },
  { id: "c-health", name: "Здоровье", emoji: "💊", kind: "expense" },
  { id: "c-entertainment", name: "Развлечения", emoji: "🎬", kind: "expense" },
  { id: "c-beauty", name: "Красота", emoji: "💅", kind: "expense" },
  { id: "c-pets", name: "Питомцы", emoji: "🐾", kind: "expense" },
  { id: "c-travel", name: "Путешествия", emoji: "✈️", kind: "expense" },
  { id: "c-other-expense", name: "Прочее", emoji: "🧩", kind: "expense" },
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
