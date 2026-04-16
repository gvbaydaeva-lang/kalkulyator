import { TrendingUp, Plus, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Income {
  id: string;
  name: string;
  amount: number;
}

interface Props {
  incomes: Income[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "name" | "amount", value: string | number) => void;
}

const IncomeCard = ({ incomes, onAdd, onRemove, onUpdate }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="glass rounded-[2rem] p-6 space-y-5 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-green-400/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-3">
        <div className="bg-green-500/15 p-2.5 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Доходы</h2>
          <p className="text-xs text-muted-foreground">Все источники дохода</p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3 relative">
      <AnimatePresence>
        {incomes.map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-2 items-center group"
          >
            <div className="w-1.5 h-10 rounded-full bg-green-400/40" />
            <input
              type="text"
              value={inc.name}
              onChange={(e) => onUpdate(inc.id, "name", e.target.value)}
              placeholder="Название дохода"
              className="flex-1 min-w-0 glass rounded-xl px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-green-400/30 transition-all"
            />
            <div className="relative w-32 shrink-0">
              <input
                type="number"
                value={inc.amount || ""}
                onChange={(e) => onUpdate(inc.id, "amount", Number(e.target.value))}
                placeholder="0"
                className="w-full glass rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-green-400/30 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₽</span>
            </div>
            <button
              onClick={() => onRemove(inc.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {incomes.length === 0 && (
        <div className="text-center py-6">
          <Sparkles className="w-8 h-8 text-green-400/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Нажмите + чтобы добавить доход</p>
        </div>
      )}
    </div>

    {incomes.length > 0 && (
      <div className="flex justify-between items-center pt-2 border-t border-border/50">
        <span className="text-sm text-muted-foreground font-medium">Итого</span>
        <span className="text-lg font-bold text-green-600">
          {incomes.reduce((s, i) => s + i.amount, 0).toLocaleString("ru-RU")} ₽
        </span>
      </div>
    )}
  </motion.div>
);

export default IncomeCard;
