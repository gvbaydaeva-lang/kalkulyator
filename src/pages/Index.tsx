import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import LedgerCard from "@/components/LedgerCard";
import Dashboard from "@/components/Dashboard";
import MonthSwitcher from "@/components/MonthSwitcher";
import ComparisonCard from "@/components/ComparisonCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useBudget } from "@/hooks/useBudget";
import { MONTH_NAMES, monthKey, prevMonthKey } from "@/types/budget";

const Index = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const { state, getMonth, addEntry, removeEntry, addCategory } = useBudget();

  const curKey = monthKey(year, month);
  const prevKey = prevMonthKey(curKey);
  const curMonth = getMonth(curKey);
  const prevMonth = getMonth(prevKey);

  const defaultDate = useMemo(() => {
    const t = new Date();
    if (t.getFullYear() === year && t.getMonth() === month) {
      return t.toISOString().slice(0, 10);
    }
    return `${curKey}-01`;
  }, [year, month, curKey]);

  const prevMonthName = (() => {
    const [py, pm] = prevKey.split("-").map(Number);
    return `${MONTH_NAMES[pm - 1]} ${py}`;
  })();

  return (
    <div className="min-h-screen pb-12">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-6 px-6 text-center text-base font-sans"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="gradient-fill p-3 rounded-2xl">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl gradient-text font-extrabold text-left">
            Калькулятор семейного бюджета
          </h1>
        </div>
        <p className="text-muted-foreground text-sm text-center border-primary-foreground border-none mx-0 border-0">             Ваш путь к финансовой свободе</p>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6">
        <MonthSwitcher
          year={year}
          month={month}
          onChange={(y, m) => { setYear(y); setMonth(m); }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <LedgerCard
            kind="income"
            entries={curMonth.entries.filter((e) => e.kind === "income")}
            categories={state.categories}
            defaultDate={defaultDate}
            onAdd={(d) => addEntry(curKey, { ...d, kind: "income" })}
            onRemove={(id) => removeEntry(curKey, id)}
            onAddCategory={(name, emoji) => addCategory({ name, emoji, kind: "income" })}
          />
          <LedgerCard
            kind="expense"
            entries={curMonth.entries.filter((e) => e.kind === "expense")}
            categories={state.categories}
            defaultDate={defaultDate}
            onAdd={(d) => addEntry(curKey, { ...d, kind: "expense" })}
            onRemove={(id) => removeEntry(curKey, id)}
            onAddCategory={(name, emoji) => addCategory({ name, emoji, kind: "expense" })}
          />
        </div>

        <div className="space-y-5">
          <Dashboard entries={curMonth.entries} categories={state.categories} />
          <ComparisonCard
            currentEntries={curMonth.entries}
            previousEntries={prevMonth.entries}
            categories={state.categories}
            prevMonthName={prevMonthName}
          />
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Index;
