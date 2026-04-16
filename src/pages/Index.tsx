import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import IncomeCard from "@/components/IncomeCard";
import ExpenseCard from "@/components/ExpenseCard";
import DreamCard from "@/components/DreamCard";
import Dashboard from "@/components/Dashboard";

interface Expense {
  id: string;
  name: string;
  amount: number;
}

const Index = () => {
  const [mainIncome, setMainIncome] = useState(0);
  const [extraIncome, setExtraIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", name: "Аренда", amount: 0 },
    { id: "2", name: "Продукты", amount: 0 },
  ]);
  const [dreamName, setDreamName] = useState("");
  const [dreamAmount, setDreamAmount] = useState(0);

  const totalIncome = mainIncome + extraIncome;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const addExpense = useCallback(() => {
    setExpenses((prev) => [...prev, { id: Date.now().toString(), name: "", amount: 0 }]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateExpense = useCallback((id: string, field: "name" | "amount", value: string | number) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
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
            Family Budget Navigator
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Ваш путь к финансовой свободе</p>
      </motion.header>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — inputs */}
        <div className="space-y-5">
          <IncomeCard
            mainIncome={mainIncome}
            extraIncome={extraIncome}
            onMainChange={setMainIncome}
            onExtraChange={setExtraIncome}
          />
          <ExpenseCard
            expenses={expenses}
            onAdd={addExpense}
            onRemove={removeExpense}
            onUpdate={updateExpense}
          />
          <DreamCard
            dreamName={dreamName}
            dreamAmount={dreamAmount}
            onNameChange={setDreamName}
            onAmountChange={setDreamAmount}
          />
        </div>

        {/* Right — dashboard */}
        <Dashboard
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          dreamName={dreamName}
          dreamAmount={dreamAmount}
        />
      </div>
    </div>
  );
};

export default Index;
