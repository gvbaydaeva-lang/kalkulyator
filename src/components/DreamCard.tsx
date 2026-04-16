import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  dreamName: string;
  dreamAmount: number;
  onNameChange: (v: string) => void;
  onAmountChange: (v: number) => void;
}

const DreamCard = ({ dreamName, dreamAmount, onNameChange, onAmountChange }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="glass rounded-[2rem] p-6 space-y-5 border border-accent/20"
    style={{ background: "linear-gradient(135deg, hsl(245 58% 51% / 0.05), hsl(270 60% 55% / 0.1))" }}
  >
    <div className="flex items-center gap-3">
      <div className="gradient-fill p-2.5 rounded-2xl">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <h2 className="font-display text-lg font-bold gradient-text">Моя Мечта</h2>
    </div>

    <div className="space-y-4">
      <input
        type="text"
        value={dreamName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Путешествие на Бали..."
        className="w-full glass rounded-2xl px-4 py-3 text-base font-medium text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-accent/30 transition-all"
      />
      <div className="relative">
        <input
          type="number"
          value={dreamAmount || ""}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="Стоимость мечты"
          className="w-full glass rounded-2xl px-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-accent/30 transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
      </div>
    </div>
  </motion.div>
);

export default DreamCard;
