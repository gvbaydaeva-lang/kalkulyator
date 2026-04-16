import { Receipt, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface Expense {
  id: string;
  name: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "name" | "amount", value: string | number) => void;
}

const ExpenseCard = ({ expenses, onAdd, onRemove, onUpdate }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="glass rounded-[2rem] p-6 space-y-5"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-destructive/10 p-2.5 rounded-2xl">
          <Receipt className="w-5 h-5 text-destructive" />
        </div>
        <h2 className="font-display text-lg font-bold text-foreground">Расходы</h2>
      </div>
      <button
        onClick={onAdd}
        className="gradient-fill text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3">
      {expenses.map((exp) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={exp.name}
            onChange={(e) => onUpdate(exp.id, "name", e.target.value)}
            placeholder="Название"
            className="flex-1 glass rounded-xl px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <div className="relative w-28">
            <input
              type="number"
              value={exp.amount || ""}
              onChange={(e) => onUpdate(exp.id, "amount", Number(e.target.value))}
              placeholder="0"
              className="w-full glass rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₽</span>
          </div>
          <button
            onClick={() => onRemove(exp.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      {expenses.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">Нажмите + чтобы добавить расход</p>
      )}
    </div>
  </motion.div>
);

export default ExpenseCard;
