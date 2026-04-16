import { useState } from "react";
import { Plus, Check, MessageSquare, Calendar as CalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, EntryKind } from "@/types/budget";

interface Props {
  kind: EntryKind;
  categories: Category[];
  defaultDate: string; // yyyy-mm-dd
  onSubmit: (data: { categoryId: string; amount: number; date: string; note?: string }) => void;
  onAddCategory: (name: string, emoji: string) => Category;
  accent: "green" | "red";
}

const EMOJIS = ["🛒", "🚗", "☕", "🏠", "🎬", "💊", "👕", "✈️", "🎁", "📚", "💼", "💻", "💰", "🎓", "🏋️", "📦", "🔁", "🧸", "💅", "🐾", "🧩", "✨"];

const EntryForm = ({ kind, categories, defaultDate, onSubmit, onAddCategory, accent }: Props) => {
  const filtered = categories.filter((c) => c.kind === kind);
  const [categoryId, setCategoryId] = useState(filtered[0]?.id ?? "");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(EMOJIS[0]);

  const accentRing = accent === "green" ? "focus:ring-green-400/40" : "focus:ring-red-400/40";
  const accentBtn = accent === "green"
    ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
    : "bg-destructive hover:opacity-90 shadow-destructive/30";
  const accentTileActive = accent === "green"
    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105"
    : "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105";
  const accentBorder = accent === "green" ? "border-green-400/40" : "border-red-400/40";

  const selectedCat = filtered.find((c) => c.id === categoryId);

  const handleSubmit = () => {
    if (!categoryId || !amount || amount <= 0) return;
    onSubmit({ categoryId, amount: Number(amount), date, note: note.trim() || undefined });
    setAmount("");
    setNote("");
  };

  const handleAddCategory = () => {
    const name = newName.trim();
    if (!name) return;
    const created = onAddCategory(name, newEmoji);
    setCategoryId(created.id);
    setNewName("");
    setShowNew(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-muted/40 rounded-2xl p-3.5"
    >
      {/* Step 1: Категория */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
            1. Выберите категорию
          </p>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> своя
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {filtered.map((c) => {
            const active = categoryId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`flex flex-col items-center justify-center gap-1 px-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active ? accentTileActive : "bg-background/80 text-foreground hover:bg-background hover:scale-[1.02]"
                }`}
              >
                <span className="text-xl leading-none">{c.emoji}</span>
                <span className="text-[11px] leading-tight text-center line-clamp-2">{c.name}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 bg-background/70 rounded-xl p-2 mt-1">
                <select
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="bg-background rounded-lg px-2 text-base outline-none"
                >
                  {EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Название категории"
                  className={`flex-1 min-w-0 bg-background rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 ${accentRing}`}
                />
                <button
                  onClick={handleAddCategory}
                  className={`${accentBtn} text-white p-1.5 rounded-lg shrink-0`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step 2: Сумма + дата */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
          2. Сумма и дата
        </p>
        <div className="flex gap-2">
          <div className={`relative flex-1 bg-background rounded-xl border-2 ${amount ? accentBorder : "border-transparent"} transition-colors`}>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0"
              className={`w-full bg-transparent rounded-xl pl-3 pr-8 py-3 text-lg font-bold outline-none min-w-0`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold pointer-events-none">₽</span>
          </div>
          <div className="relative bg-background rounded-xl">
            <CalIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`bg-transparent rounded-xl pl-7 pr-2 py-3 text-xs font-medium outline-none focus:ring-2 ${accentRing} w-[130px]`}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Комментарий */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide flex items-center gap-1.5">
          <MessageSquare className="w-3 h-3" />
          3. Комментарий {selectedCat && <span className="text-muted-foreground font-normal normal-case tracking-normal">— например, для «{selectedCat.name}»</span>}
        </p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={kind === "expense" ? "Например: оплата за университет" : "Например: премия за квартал"}
          className={`w-full bg-background rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ${accentRing}`}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!categoryId || !amount || Number(amount) <= 0}
        className={`w-full ${accentBtn} text-white py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
      >
        <Plus className="w-4 h-4" />
        Добавить {kind === "income" ? "доход" : "расход"}
      </button>
    </motion.div>
  );
};

export default EntryForm;
