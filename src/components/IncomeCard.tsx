import { Wallet, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  mainIncome: number;
  extraIncome: number;
  onMainChange: (v: number) => void;
  onExtraChange: (v: number) => void;
}

const IncomeCard = ({ mainIncome, extraIncome, onMainChange, onExtraChange }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="glass rounded-[2rem] p-6 space-y-5"
  >
    <div className="flex items-center gap-3">
      <div className="gradient-fill p-2.5 rounded-2xl">
        <Wallet className="w-5 h-5 text-primary-foreground" />
      </div>
      <h2 className="font-display text-lg font-bold text-foreground">Доходы</h2>
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Основной доход</label>
        <div className="relative">
          <input
            type="number"
            value={mainIncome || ""}
            onChange={(e) => onMainChange(Number(e.target.value))}
            placeholder="0"
            className="w-full glass rounded-2xl px-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" /> Дополнительный
        </label>
        <div className="relative">
          <input
            type="number"
            value={extraIncome || ""}
            onChange={(e) => onExtraChange(Number(e.target.value))}
            placeholder="0"
            className="w-full glass rounded-2xl px-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default IncomeCard;
