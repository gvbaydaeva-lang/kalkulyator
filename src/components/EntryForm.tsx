import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Category, EntryKind } from "@/types/budget";

interface Props {
  kind: EntryKind;
  categories: Category[];
  defaultDate: string; // yyyy-mm-dd
  onSubmit: (data: { categoryId: string; amount: number; date: string; note?: string }) => void;
  onAddCategory: (name: string, emoji: string) => Category;
  accent: "green" | "red";
}

const EMOJIS = ["🛒", "🚗", "☕", "🏠", "🎬", "💊", "👕", "✈️", "🎁", "📚", "💼", "💻", "💰", "🎓", "🏋️"];

const EntryForm = ({ kind, categories, defaultDate, onSubmit, onAddCategory, accent }: Props) => {
  const filtered = categories.filter((c) => c.kind === kind);
  const [categoryId, setCategoryId] = useState(filtered[0]?.id ?? "");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(EMOJIS[0]);

  const accentRing = accent === "green" ? "focus:ring-green-400/30" : "focus:ring-red-400/30";
  const accentBtn = accent === "green"
    ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
    : "bg-destructive hover:opacity-90 shadow-destructive/20";

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
      className="space-y-3 bg-muted/40 rounded-2xl p-3"
    >
      <div className="flex flex-wrap gap-1.5">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryId === c.id
                ? accent === "green"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-destructive text-destructive-foreground shadow-md"
                : "bg-background/80 text-foreground hover:bg-background"
            }`}
          >
            <span className="mr-1">{c.emoji}</span>{c.name}
          </button>
        ))}
        <button
          onClick={() => setShowNew((v) => !v)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-background/80 text-muted-foreground hover:text-foreground border border-dashed border-border transition-all"
        >
          <Plus className="w-3 h-3 inline -mt-0.5" /> категория
        </button>
      </div>

      {showNew && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2 bg-background/60 rounded-xl p-2"
        >
          <div className="flex gap-2">
            <select
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              className="bg-background rounded-lg px-2 text-sm outline-none"
            >
              {EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Название категории"
              className={`flex-1 bg-background rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 ${accentRing}`}
            />
            <button
              onClick={handleAddCategory}
              className={`${accentBtn} text-white p-1.5 rounded-lg`}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-[1.2fr_1fr_auto] gap-2 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`bg-background rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 ${accentRing}`}
        />
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Сумма"
            className={`w-full bg-background rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 ${accentRing}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₽</span>
        </div>
        <button
          onClick={handleSubmit}
          className={`${accentBtn} text-white p-2.5 rounded-xl shadow-lg transition-all`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Заметка (необязательно)"
        className={`w-full bg-background rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 ${accentRing}`}
      />
    </motion.div>
  );
};

export default EntryForm;
