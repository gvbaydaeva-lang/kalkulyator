import { BarChart3, Lightbulb, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Category, Entry } from "@/types/budget";

interface Props {
  entries: Entry[];
  categories: Category[];
}

const Dashboard = ({ entries, categories }: Props) => {
  const incomeEntries = entries.filter((e) => e.kind === "income");
  const expenseEntries = entries.filter((e) => e.kind === "expense");
  const totalIncome = incomeEntries.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenseEntries.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const maxValue = Math.max(totalIncome, totalExpenses, 1);
  const incomePercent = (totalIncome / maxValue) * 100;
  const expensePercent = (totalExpenses / maxValue) * 100;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const sumByCat = (list: Entry[]) => {
    const m = new Map<string, number>();
    list.forEach((e) => m.set(e.categoryId, (m.get(e.categoryId) ?? 0) + e.amount));
    return Array.from(m.entries())
      .map(([id, sum]) => ({ cat: categories.find((c) => c.id === id), sum }))
      .sort((a, b) => b.sum - a.sum);
  };

  const incomeByCat = sumByCat(incomeEntries);
  const expenseByCat = sumByCat(expenseEntries);

  const recommendations: string[] = [];
  if (totalIncome === 0 && totalExpenses === 0) {
    recommendations.push("👋 Добавьте доходы и расходы за месяц, чтобы получить персональные рекомендации.");
  } else {
    if (balance < 0) recommendations.push("🚨 Расходы превышают доходы! Пересмотрите крупные траты.");
    if (balance >= 0 && savingsRate < 10 && totalIncome > 0)
      recommendations.push("⚠️ Вы откладываете менее 10% дохода. Попробуйте сократить необязательные расходы.");
    if (savingsRate >= 10 && savingsRate < 20)
      recommendations.push(`👍 Неплохо! Вы откладываете ${savingsRate}% дохода. Идеальная цель — 20%.`);
    if (savingsRate >= 20)
      recommendations.push(`🎉 Отлично! Вы откладываете ${savingsRate}% дохода — прекрасный показатель!`);

    if (expenseByCat[0] && expenseByCat[0].sum > 0) {
      const top = expenseByCat[0];
      const topPercent = totalExpenses > 0 ? Math.round((top.sum / totalExpenses) * 100) : 0;
      recommendations.push(`📊 Самая крупная категория расходов: ${top.cat?.emoji ?? ""} «${top.cat?.name ?? "?"}» — ${topPercent}% от всех трат.`);
    }
    if (balance > 0 && totalExpenses > 0) {
      const dailyFreedom = Math.floor(balance / (totalExpenses / 30));
      recommendations.push(`🛡️ У вас ${dailyFreedom} дней финансовой свободы в этом месяце.`);
    }
    if (incomeByCat.length === 1 && totalIncome > 0)
      recommendations.push("💡 У вас один источник дохода. Подумайте о диверсификации для финансовой стабильности.");
  }

  const hasData = totalIncome > 0 || totalExpenses > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-5"
    >
      {/* Balance summary */}
      <div className="glass rounded-[2rem] p-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-[2rem]"
          style={{
            background: balance >= 0
              ? "linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.6))"
              : "linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--accent)))",
          }}
        />
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-2xl ${balance >= 0 ? "bg-secondary/15" : "bg-destructive/15"}`}>
            <Scale className={`w-5 h-5 ${balance >= 0 ? "text-secondary" : "text-destructive"}`} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Баланс месяца</h3>
            <p className="text-xs text-muted-foreground">Доходы минус расходы</p>
          </div>
        </div>

        <div className="text-center py-3">
          <motion.span
            key={balance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl md:text-5xl font-display font-bold ${balance >= 0 ? "text-secondary" : "text-destructive"}`}
          >
            {hasData ? (balance >= 0 ? "+" : "") + balance.toLocaleString("ru-RU") + " ₽" : "—"}
          </motion.span>
          {hasData && totalIncome > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {savingsRate >= 0 ? `Вы сохраняете ${savingsRate}% дохода` : "Дефицит бюджета"}
            </p>
          )}
        </div>
      </div>

      {/* Income vs Expenses bars */}
      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="gradient-fill p-2.5 rounded-2xl">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Сравнение</h3>
            <p className="text-xs text-muted-foreground">Доходы и расходы</p>
          </div>
        </div>

        {hasData ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Доходы</span>
                </div>
                <span className="text-sm font-bold text-secondary">{totalIncome.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="h-6 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.6))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${incomePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">Расходы</span>
                </div>
                <span className="text-sm font-bold text-destructive">{totalExpenses.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="h-6 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--accent)))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${expensePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Ожидаем данных...</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-[2rem] p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-accent/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="gradient-fill p-2.5 rounded-2xl">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Рекомендации</h3>
            <p className="text-xs text-muted-foreground">Персональные советы</p>
          </div>
        </div>
        <div className="space-y-3 relative">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-2xl px-4 py-3"
            >
              {rec}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
