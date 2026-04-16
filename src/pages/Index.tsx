import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import IncomeCard from "@/components/IncomeCard";
import ExpenseCard from "@/components/ExpenseCard";
import Dashboard from "@/components/Dashboard";

interface Item {
  id: string;
  name: string;
  amount: number;
}

const Index = () => {
  const [incomes, setIncomes] = useState<Item[]>([
    { id: "1", name: "Зарплата", amount: 0 },
  ]);
  const [expenses, setExpenses] = useState<Item[]>([
    { id: "2", name: "Аренда", amount: 0 },
    { id: "3", name: "Продукты", amount: 0 },
  ]);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const makeHandlers = (setter: React.Dispatch<React.SetStateAction<Item[]>>) => ({
    add: () => setter((prev) => [...prev, { id: Date.now().toString(), name: "", amount: 0 }]),
    remove: (id: string) => setter((prev) => prev.filter((e) => e.id !== id)),
    update: (id: string, field: "name" | "amount", value: string | number) =>
      setter((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))),
  });

  const incomeHandlers = makeHandlers(setIncomes);
  const expenseHandlers = makeHandlers(setExpenses);

  return (
    <div className="min-h-screen pb-12">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-6 px-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="gradient-fill p-3 rounded-2xl">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold gradient-text">
            Калькулятор семейного бюджета
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Ваш путь к финансовой свободе</p>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <IncomeCard
            incomes={incomes}
            onAdd={incomeHandlers.add}
            onRemove={incomeHandlers.remove}
            onUpdate={incomeHandlers.update}
          />
          <ExpenseCard
            expenses={expenses}
            onAdd={expenseHandlers.add}
            onRemove={expenseHandlers.remove}
            onUpdate={expenseHandlers.update}
          />
        </div>

        <Dashboard
          incomes={incomes}
          expenses={expenses}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
      </div>
    </div>
  );
};

export default Index;
