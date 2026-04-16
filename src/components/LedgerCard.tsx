import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Receipt, X, ChevronDown, ChevronUp, ListPlus } from "lucide-react";
import { Category, Entry, EntryKind } from "@/types/budget";
import EntryForm from "./EntryForm";

interface Props {
  kind: EntryKind;
  entries: Entry[];
  categories: Category[];
  defaultDate: string;
  onAdd: (data: { categoryId: string; amount: number; date: string; note?: string }) => void;
  onRemove: (id: string) => void;
  onAddCategory: (name: string, emoji: string) => Category;
}

const LedgerCard = ({ kind, entries, categories, defaultDate, onAdd, onRemove, onAddCategory }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const isIncome = kind === "income";
  const accent = isIncome ? "green" : "red";
  const Icon = isIncome ? TrendingUp : Receipt;
  const title = isIncome ? "Доходы" : "Расходы";
  const subtitle = isIncome ? "Все поступления за месяц" : "Все траты по дням";

  const total = entries.reduce((s, e) => s + e.amount, 0);

  // Group by category
  const byCategory = new Map<string, { cat: Category | undefined; sum: number; count: number }>();
  entries.forEach((e) => {
    const cat = categories.find((c) => c.id === e.categoryId);
    const existing = byCategory.get(e.categoryId) ?? { cat, sum: 0, count: 0 };
    existing.sum += e.amount;
    existing.count += 1;
    byCategory.set(e.categoryId, existing);
  });
  const grouped = Array.from(byCategory.values()).sort((a, b) => b.sum - a.sum);

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const visibleEntries = showAll ? sortedEntries : sortedEntries.slice(0, 5);

  const accentText = isIncome ? "text-green-600" : "text-destructive";
  const accentBg = isIncome ? "bg-green-500/15" : "bg-destructive/10";
  const accentIcon = isIncome ? "text-green-600" : "text-destructive";
  const accentBtn = isIncome
    ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
    : "bg-destructive hover:opacity-90 shadow-destructive/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isIncome ? 0.1 : 0.2 }}
      className="glass rounded-[2rem] p-6 space-y-4 relative overflow-hidden"
    >
      <div className={`absolute ${isIncome ? "top-0 right-0" : "bottom-0 left-0"} w-32 h-32 rounded-full ${isIncome ? "bg-green-400/10 -translate-y-1/2 translate-x-1/2" : "bg-red-400/10 translate-y-1/2 -translate-x-1/2"} blur-3xl`} />

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className={`${accentBg} p-2.5 rounded-2xl`}>
            <Icon className={`w-5 h-5 ${accentIcon}`} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`${accentBtn} text-white px-3 py-2 rounded-xl shadow-lg transition-all flex items-center gap-1.5 text-sm font-medium`}
        >
          <ListPlus className="w-4 h-4" />
          {showForm ? "Скрыть" : "Добавить"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden"
          >
            <EntryForm
              kind={kind}
              categories={categories}
              defaultDate={defaultDate}
              onSubmit={(d) => onAdd(d)}
              onAddCategory={onAddCategory}
              accent={accent}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregated by category */}
      {grouped.length > 0 && (
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">По категориям</p>
            <p className="text-[10px] text-muted-foreground">{grouped.length} {grouped.length === 1 ? "категория" : "категорий"}</p>
          </div>
          {grouped.map(({ cat, sum, count }) => {
            const pct = total > 0 ? (sum / total) * 100 : 0;
            return (
              <div key={cat?.id ?? "unknown"} className="bg-background/70 rounded-2xl p-3 hover:bg-background transition-colors">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xl shrink-0">{cat?.emoji ?? "❓"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{cat?.name ?? "Без категории"}</p>
                      <p className="text-[11px] text-muted-foreground">{count} {count === 1 ? "запись" : count < 5 ? "записи" : "записей"} · {Math.round(pct)}%</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${accentText} shrink-0 tabular-nums`}>
                    {sum.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${isIncome ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent entries */}
      {sortedEntries.length > 0 && (
        <div className="space-y-1.5 relative">
          <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Последние записи</p>
          <AnimatePresence>
            {visibleEntries.map((e) => {
              const cat = categories.find((c) => c.id === e.categoryId);
              const day = e.date.slice(8, 10);
              const month = e.date.slice(5, 7);
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className="flex items-center gap-2 bg-background/70 rounded-xl px-2.5 py-2 group hover:bg-background transition-colors"
                >
                  <div className="flex flex-col items-center justify-center bg-muted/70 rounded-lg px-1.5 py-0.5 shrink-0 min-w-[36px]">
                    <span className="text-[11px] font-bold text-foreground leading-tight">{day}</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">.{month}</span>
                  </div>
                  <span className="text-lg shrink-0">{cat?.emoji ?? "❓"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {cat?.name ?? "Без категории"}
                    </p>
                    {e.note && <p className="text-[11px] text-muted-foreground truncate italic">«{e.note}»</p>}
                  </div>
                  <span className={`text-sm font-bold ${accentText} shrink-0 tabular-nums`}>
                    {isIncome ? "+" : "−"}{e.amount.toLocaleString("ru-RU")} ₽
                  </span>
                  <button
                    onClick={() => onRemove(e.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {sortedEntries.length > 5 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 flex items-center justify-center gap-1"
            >
              {showAll ? <><ChevronUp className="w-3 h-3" /> Свернуть</> : <><ChevronDown className="w-3 h-3" /> Показать все ({sortedEntries.length})</>}
            </button>
          )}
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="text-center py-6 relative">
          <p className="text-sm text-muted-foreground">Нажмите «Добавить», чтобы записать {isIncome ? "доход" : "расход"}</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-border/50 relative">
          <span className="text-sm text-muted-foreground font-medium">Итого за месяц</span>
          <span className={`text-lg font-bold ${accentText}`}>
            {total.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default LedgerCard;
