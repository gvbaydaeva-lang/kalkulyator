import { Receipt, Plus, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    className="glass rounded-[2rem] p-6 space-y-5 relative overflow-hidden"
  >
    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-red-400/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-3">
        <div className="bg-destructive/10 p-2.5 rounded-2xl">
          <Receipt className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Расходы</h2>
          <p className="text-xs text-muted-foreground">Ежемесячные траты</p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="bg-destructive text-destructive-foreground p-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-destructive/20"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3 relative">
      <AnimatePresence>
        {expenses.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-2 items-center group"
          >
            <div className="w-1.5 h-10 rounded-full bg-red-400/40" />
            <input
              type="text"
              value={exp.name}
              onChange={(e) => onUpdate(exp.id, "name", e.target.value)}
              placeholder="Название"
              className="flex-1 glass rounded-xl px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-destructive/20 transition-all"
            />
            <div className="relative w-28">
              <input
                type="number"
                value={exp.amount || ""}
                onChange={(e) => onUpdate(exp.id, "amount", Number(e.target.value))}
                placeholder="0"
                className="w-full glass rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-destructive/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₽</span>
            </div>
            <button
              onClick={() => onRemove(exp.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {expenses.length === 0 && (
        <div className="text-center py-6">
          <ShoppingCart className="w-8 h-8 text-destructive/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Нажмите + чтобы добавить расход</p>
        </div>
      )}
    </div>

    {expenses.length > 0 && (
      <div className="flex justify-between items-center pt-2 border-t border-border/50">
        <span className="text-sm text-muted-foreground font-medium">Итого</span>
        <span className="text-lg font-bold text-destructive">
          {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString("ru-RU")} ₽
        </span>
      </div>
    )}
  </motion.div>
);

export default ExpenseCard;
