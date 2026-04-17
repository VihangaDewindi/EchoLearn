export const getTagStyles = (tag: string = "") => {
  const t = tag.toUpperCase();
  switch (t) {
    case "SCIENCE":
      return "bg-teal-600 shadow-teal-100";
    case "IT":
    case "INFORMATION & TECHNOLOGY":
      return "bg-slate-700 shadow-slate-100";
    case "GEOGRAPHY":
      return "bg-emerald-600 shadow-emerald-100";
    case "ENGLISH":
      return "bg-purple-600 shadow-purple-100";
    case "MATH":
      return "bg-blue-600 shadow-blue-100";
    case "ART":
      return "bg-rose-600 shadow-rose-100";
    case "HISTORY":
      return "bg-amber-700 shadow-amber-100";
    case "LANGUAGES":
      return "bg-green-600 shadow-green-100";
    default:
      return "bg-indigo-600 shadow-indigo-100";
  }
};

export const getAccessibilityStyles = (rating: number = 0) => {
  if (rating >= 95) return "bg-green-50 text-green-700 border-green-200";
  if (rating >= 85) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
};
