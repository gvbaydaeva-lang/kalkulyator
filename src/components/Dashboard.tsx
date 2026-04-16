import { Shield, Target, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

interface Props {
  totalIncome: number;
  totalExpenses: number;
  dreamName: string;
  dreamAmount: number;
}

const Dashboard = ({ totalIncome, totalExpenses, dreamName, dreamAmount }: Props) => {
  const freeBalance = Math.max(totalIncome - totalExpenses, 0);
  const dailyExpense = totalExpenses > 0 ? totalExpenses / 30 : 1;
  const freedomDays = Math.floor(freeBalance / dailyExpense);
  const monthsToDream = freeBalance > 0 && dreamAmount > 0 ? Math.ceil(dreamAmount / freeBalance) : 0;
  const dreamProgress = freeBalance > 0 && dreamAmount > 0 ? Math.min((freeBalance / dreamAmount) * 100, 100) : 0;

  const chartData = {
    labels: ["Ресурс на мечту", "Расходы"],
    datasets: [
      {
        data: [freeBalance, totalExpenses],
        backgroundColor: [
          "hsl(245, 58%, 51%)",
          "hsl(230, 20%, 88%)",
        ],
        borderWidth: 0,
        cutout: "75%",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: true }, legend: { display: false } },
  };

  const extraSaving = 2000;
  const currentMonths = monthsToDream;
  const newMonths = freeBalance + extraSaving > 0 && dreamAmount > 0
    ? Math.ceil(dreamAmount / (freeBalance + extraSaving))
    : 0;
  const savedDays = (currentMonths - newMonths) * 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-5"
    >
      {/* Freedom days */}
      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="gradient-fill p-2.5 rounded-2xl">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">Запас прочности</h3>
        </div>
        <div className="text-center py-2">
          <motion.span
            key={freedomDays}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-display font-bold gradient-text"
          >
            {totalIncome > 0 ? freedomDays : "—"}
          </motion.span>
          <p className="text-muted-foreground text-sm mt-2">
            {totalIncome > 0
              ? `Этот месяц дарит вам ${freedomDays} дней финансовой свободы`
              : "Введите доходы, чтобы увидеть ваш запас"}
          </p>
        </div>
      </div>

      {/* Donut chart */}
      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent/10 p-2.5 rounded-2xl">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">Колесо баланса</h3>
        </div>
        <div className="h-48 flex items-center justify-center relative">
          {totalIncome > 0 ? (
            <>
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-display font-bold text-foreground">
                  {totalIncome > 0 ? Math.round((freeBalance / totalIncome) * 100) : 0}%
                </span>
                <span className="text-xs text-muted-foreground">свободно</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Ожидаем данных...</p>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full gradient-fill" />
            <span className="text-xs text-muted-foreground">На мечту</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-border" />
            <span className="text-xs text-muted-foreground">Расходы</span>
          </div>
        </div>
      </div>

      {/* Dream progress */}
      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="gradient-fill p-2.5 rounded-2xl">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            {dreamName || "Мечта"}
          </h3>
        </div>

        <div className="relative h-5 rounded-full bg-muted overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full gradient-fill"
            initial={{ width: 0 }}
            animate={{ width: `${dreamProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{dreamProgress.toFixed(1)}%</span>
          <span className="font-semibold text-foreground">
            {dreamAmount > 0 && freeBalance > 0
              ? `${monthsToDream} мес.`
              : "—"}
          </span>
        </div>

        {dreamAmount > 0 && freeBalance > 0 && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Ваша мечта «{dreamName || "..."}» исполнится через{" "}
            <span className="font-semibold gradient-text">{monthsToDream} мес.</span>
          </p>
        )}
      </div>

      {/* Tip */}
      {totalIncome > 0 && dreamAmount > 0 && freeBalance > 0 && savedDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-[2rem] p-6"
          style={{ background: "linear-gradient(135deg, hsl(245 58% 51% / 0.06), hsl(270 60% 55% / 0.08))" }}
        >
          <div className="flex items-start gap-3">
            <div className="gradient-fill p-2 rounded-xl mt-0.5">
              <Lightbulb className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-foreground mb-1">Совет Навигатора</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Если отложить ещё {extraSaving.toLocaleString("ru-RU")}₽, мечта станет ближе на{" "}
                <span className="font-semibold text-foreground">{savedDays} дней</span>!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
