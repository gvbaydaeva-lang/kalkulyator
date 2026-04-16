import { BarChart3, Lightbulb, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { motion } from "framer-motion";

interface IncomeItem {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface Props {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  totalIncome: number;
  totalExpenses: number;
}

const Dashboard = ({ incomes, expenses, totalIncome, totalExpenses }: Props) => {
  const balance = totalIncome - totalExpenses;
  const maxValue = Math.max(totalIncome, totalExpenses, 1);
  const incomePercent = (totalIncome / maxValue) * 100;
  const expensePercent = (totalExpenses / maxValue) * 100;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const recommendations: string[] = [];
  if (totalIncome === 0 && totalExpenses === 0) {
    recommendations.push("👋 Введите ваши доходы и расходы, чтобы получить персональные рекомендации.");
  } else {
    if (balance < 0) {
      recommendations.push("🚨 Расходы превышают доходы! Рекомендуем пересмотреть траты и найти возможности для экономии.");
    }
    if (balance >= 0 && savingsRate < 10 && totalIncome > 0) {
      recommendations.push("⚠️ Вы откладываете менее 10% дохода. Попробуйте сократить необязательные расходы.");
    }
    if (savingsRate >= 10 && savingsRate < 20) {
      recommendations.push("👍 Неплохо! Вы откладываете " + savingsRate + "% дохода. Идеальная цель — 20%.");
    }
    if (savingsRate >= 20) {
      recommendations.push("🎉 Отлично! Вы откладываете " + savingsRate + "% дохода — это прекрасный показатель!");
    }
    if (expenses.length > 0) {
      const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
      if (sorted[0] && sorted[0].amount > 0) {
        const topPercent = totalExpenses > 0 ? Math.round((sorted[0].amount / totalExpenses) * 100) : 0;
        recommendations.push(`📊 Самый крупный расход: «${sorted[0].name || "Без названия"}» — ${topPercent}% от всех трат.`);
      }
    }
    if (balance > 0) {
      const dailyFreedom = Math.floor(balance / (totalExpenses / 30 || 1));
      recommendations.push(`🛡️ У вас ${dailyFreedom} дней финансовой свободы в этом месяце.`);
    }
    if (incomes.length === 1 && totalIncome > 0) {
      recommendations.push("💡 У вас один источник дохода. Подумайте о диверсификации для финансовой стабильности.");
    }
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
        <div className="absolute top-0 left-0 w-full h-1 rounded-t-[2rem]"
          style={{
            background: balance >= 0
              ? "linear-gradient(90deg, #22c55e, #4ade80)"
              : "linear-gradient(90deg, #ef4444, #f87171)"
          }}
        />
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-2xl ${balance >= 0 ? "bg-green-500/15" : "bg-red-500/15"}`}>
            <Scale className={`w-5 h-5 ${balance >= 0 ? "text-green-600" : "text-red-500"}`} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Баланс</h3>
            <p className="text-xs text-muted-foreground">Доходы минус расходы</p>
          </div>
        </div>

        <div className="text-center py-3">
          <motion.span
            key={balance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl md:text-5xl font-display font-bold ${balance >= 0 ? "text-green-600" : "text-red-500"}`}
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
            {/* Income bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">Доходы</span>
                </div>
                <span className="text-sm font-bold text-green-600">{totalIncome.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="h-6 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${incomePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Expense bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-foreground">Расходы</span>
                </div>
                <span className="text-sm font-bold text-red-500">{totalExpenses.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="h-6 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #ef4444, #f87171)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${expensePercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>

            {/* Breakdown lists */}
            {incomes.filter(i => i.amount > 0).length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Детализация доходов</p>
                <div className="space-y-1.5">
                  {incomes.filter(i => i.amount > 0).map(inc => (
                    <div key={inc.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{inc.name || "Без названия"}</span>
                      <span className="font-medium text-green-600">+{inc.amount.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expenses.filter(e => e.amount > 0).length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Детализация расходов</p>
                <div className="space-y-1.5">
                  {expenses.filter(e => e.amount > 0).map(exp => (
                    <div key={exp.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{exp.name || "Без названия"}</span>
                      <span className="font-medium text-red-500">-{exp.amount.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
