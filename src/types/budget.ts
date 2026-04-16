export type EntryKind = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  kind: EntryKind;
}

export interface Entry {
  id: string;
  kind: EntryKind;
  categoryId: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  note?: string;
}

export interface MonthData {
  entries: Entry[];
}

export interface BudgetState {
  categories: Category[];
  months: Record<string, MonthData>; // key: "YYYY-MM"
}

export const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const monthKey = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;

export const prevMonthKey = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return monthKey(d.getFullYear(), d.getMonth());
};
