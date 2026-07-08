export const OPERATION_OPTIONS = [
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "reverse", label: "Reverse String" },
  { value: "word_count", label: "Word Count" },
];

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "running", label: "Running" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

export const STATUS_COLORS = {
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
  },
  running: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/25",
  },
  success: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/25",
  },
  failed: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/25",
  },
};
