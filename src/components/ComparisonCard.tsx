import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, GitCompareArrows } from "lucide-react";
import { Category, Entry } from "@/types/budget";

interface Props {
  currentEntries: Entry[];
  previousEntries: Entry[];
  categories: Category[];
  prevMonthName: string;
}

const sumByCategory = (entries: Entry[]) => {
  const map = new Map<string, number>();
  entries.forEach((e) => map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount));
  return map;
};

const Trend = ({ delta, pct }: { delta: number; pct: number | null }) => {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs font-medium">
        <Minus className="w-3 h-3" /> без изменений
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-secondary" : "text-destructive"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(delta).toLocaleString("ru-RU")} ₽
      {pct !== null && <span className="opacity-70">({up ? "+" : ""}{pct.toFixed(0)}%)</span>}
    </span>
  );
};

const ComparisonCard = ({ currentEntries, previousEntries, categories, prevMonthName }: Props) => {
  const curIncome = currentEntries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
  const curExpense = currentEntries.filter((e) => e.kind === "expense").reduce((s, e) => s + e.amount, 0);
  const prevIncome = previousEntries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
  const prevExpense = previousEntries.filter((e) => e.kind === "expense").reduce((s, e) => s + e.amount, 0);
  const curBalance = curIncome - curExpense;
  const prevBalance = prevIncome - prevExpense;

  const calcPct = (cur: number, prev: number) => (prev === 0 ? null : ((cur - prev) / Math.abs(prev)) * 100);

  const metrics = [
    { label: "Доходы", cur: curIncome, prev: prevIncome, color: "text-secondary", invertGood: false },
    { label: "Расходы", cur: curExpense, prev: prevExpense, color: "text-destructive", invertGood: true },
    { label: "Баланс", cur: curBalance, prev: prevBalance, color: curBalance >= 0 ? "text-secondary" : "text-destructive", invertGood: false },
  ];

  // Category-level comparison (expenses only, where it matters most)
  const curMap = sumByCategory(currentEntries.filter((e) => e.kind === "expense"));
  const prevMap = sumByCategory(previousEntries.filter((e) => e.kind === "expense"));
  const allCatIds = new Set([...curMap.keys(), ...prevMap.keys()]);
  const catRows = Array.from(allCatIds)
    .map((id) => {
      const cat = categories.find((c) => c.id === id);
      const cur = curMap.get(id) ?? 0;
      const prev = prevMap.get(id) ?? 0;
      return { cat, cur, prev, delta: cur - prev };
    })
    .filter((r) => r.cur > 0 || r.prev > 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 6);

  // Summary text
  const summary: string[] = [];
  const noPrev = previousEntries.length === 0;
  if (noPrev) {
    summary.push(`📅 За ${prevMonthName} нет данных — начните вести учёт, чтобы увидеть сравнение.`);
  } else {
    const incDelta = curIncome - prevIncome;
    const expDelta = curExpense - prevExpense;
    const balDelta = curBalance - prevBalance;

    if (incDelta > 0) summary.push(`📈 Доходы выросли на ${incDelta.toLocaleString("ru-RU")} ₽ по сравнению с ${prevMonthName}.`);
    else if (incDelta < 0) summary.push(`📉 Доходы упали на ${Math.abs(incDelta).toLocaleString("ru-RU")} ₽ по сравнению с ${prevMonthName}.`);

    if (expDelta > 0) summary.push(`⚠️ Расходы увеличились на ${expDelta.toLocaleString("ru-RU")} ₽ — стоит обратить внимание.`);
    else if (expDelta < 0) summary.push(`✅ Вы сократили расходы на ${Math.abs(expDelta).toLocaleString("ru-RU")} ₽ — отличная работа!`);

    if (balDelta > 0) summary.push(`💚 Баланс улучшился на ${balDelta.toLocaleString("ru-RU")} ₽.`);
    else if (balDelta < 0) summary.push(`💔 Баланс ухудшился на ${Math.abs(balDelta).toLocaleString("ru-RU")} ₽.`);

    // biggest expense category change
    const topExpChange = catRows[0];
    if (topExpChange && topExpChange.cat && topExpChange.delta !== 0) {
      const verb = topExpChange.delta > 0 ? "выросли" : "снизились";
      summary.push(`${topExpChange.cat.emoji} Расходы на «${topExpChange.cat.name}» ${verb} на ${Math.abs(topExpChange.delta).toLocaleString("ru-RU")} ₽.`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-[2rem] p-6 space-y-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-center gap-3 relative">
        <div className="gradient-fill p-2.5 rounded-2xl">
          <GitCompareArrows className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-foreground">Сравнение с прошлым месяцем</h3>
          <p className="text-xs text-muted-foreground">vs {prevMonthName}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2 relative">
        {metrics.map((m) => {
          const delta = m.cur - m.prev;
          const pct = calcPct(m.cur, m.prev);
          return (
            <div key={m.label} className="bg-background/60 rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className={`font-display text-base font-bold ${m.color} mb-1`}>
                {m.cur.toLocaleString("ru-RU")} ₽
              </p>
              <Trend delta={delta} pct={pct} />
            </div>
          );
        })}
      </div>

      {/* Category breakdown */}
      {catRows.length > 0 && (
        <div className="space-y-2 relative">
          <p className="text-xs font-medium text-muted-foreground">Изменения по категориям расходов</p>
          {catRows.map(({ cat, cur, prev, delta }) => {
            const pct = calcPct(cur, prev);
            return (
              <div key={cat?.id ?? "x"} className="bg-background/60 rounded-xl p-2.5 flex items-center gap-2">
                <span className="text-base">{cat?.emoji ?? "❓"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{cat?.name ?? "Без категории"}</p>
                  <p className="text-xs text-muted-foreground">
                    {prev.toLocaleString("ru-RU")} → {cur.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <Trend delta={delta} pct={pct} />
              </div>
            );
          })}
        </div>
      )}

      {/* Narrative summary */}
      {summary.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50 relative">
          {summary.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl px-3 py-2"
            >
              {s}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ComparisonCard;
