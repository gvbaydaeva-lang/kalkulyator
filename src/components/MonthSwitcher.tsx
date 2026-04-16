import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { MONTH_NAMES } from "@/types/budget";

interface Props {
  year: number;
  month: number; // 0-11
  onChange: (year: number, month: number) => void;
}

const MonthSwitcher = ({ year, month, onChange }: Props) => {
  const go = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] p-3 flex items-center justify-between gap-2 max-w-md mx-auto"
    >
      <button
        onClick={() => go(-1)}
        className="p-2.5 rounded-2xl hover:bg-muted/60 transition-colors"
        aria-label="Предыдущий месяц"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex items-center gap-2 flex-1 justify-center">
        <div className="gradient-fill p-2 rounded-xl">
          <Calendar className="w-4 h-4 text-primary-foreground" />
        </div>
        <select
          value={month}
          onChange={(e) => onChange(year, Number(e.target.value))}
          className="bg-transparent font-display font-bold text-base text-foreground outline-none cursor-pointer"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onChange(Number(e.target.value), month)}
          className="bg-transparent font-display font-bold text-base text-foreground outline-none cursor-pointer"
        >
          {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => go(1)}
        className="p-2.5 rounded-2xl hover:bg-muted/60 transition-colors"
        aria-label="Следующий месяц"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>
    </motion.div>
  );
};

export default MonthSwitcher;
