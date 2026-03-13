export const PRIORITY_CONFIG = {
  "urgent-important": { label:"Do Now",    color:"#ef4444", bg:"rgba(239,68,68,0.12)",   icon:"🔥", desc:"Urgent & Important" },
  "important":        { label:"Schedule",  color:"#3b82f6", bg:"rgba(59,130,246,0.12)",  icon:"📌", desc:"Important, Not Urgent" },
  "urgent":           { label:"Delegate",  color:"#f97316", bg:"rgba(249,115,22,0.12)",  icon:"⚡", desc:"Urgent, Not Important" },
  "low":              { label:"Eliminate", color:"#6b7280", bg:"rgba(107,114,128,0.12)", icon:"🌿", desc:"Not Urgent & Not Important" },
};

export const KANBAN_COLS = [
  { key:"backlog",     label:"Backlog",     icon:"📋", color:"#64748b", bg:"rgba(100,116,139,0.07)", border:"rgba(100,116,139,0.2)" },
  { key:"in-progress", label:"In Progress", icon:"⚙️", color:"#3b82f6", bg:"rgba(59,130,246,0.07)",  border:"rgba(59,130,246,0.2)"  },
  { key:"review",      label:"Review",      icon:"🔍", color:"#f59e0b", bg:"rgba(245,158,11,0.07)",  border:"rgba(245,158,11,0.2)"  },
  { key:"done",        label:"Done",        icon:"✅", color:"#10b981", bg:"rgba(16,185,129,0.07)",  border:"rgba(16,185,129,0.2)"  },
];

export const PRIORITY_QUADRANTS = [
  { key:"urgent-important", subtitle:"🔥 Do First",  label:"Urgent & Important",        color:"#ef4444", bg:"rgba(239,68,68,0.06)",   border:"rgba(239,68,68,0.18)",   dropBorder:"#ef4444" },
  { key:"important",        subtitle:"📌 Schedule",  label:"Important, Not Urgent",     color:"#3b82f6", bg:"rgba(59,130,246,0.06)",  border:"rgba(59,130,246,0.18)",  dropBorder:"#3b82f6" },
  { key:"urgent",           subtitle:"⚡ Delegate",  label:"Urgent, Not Important",     color:"#f97316", bg:"rgba(249,115,22,0.06)",  border:"rgba(249,115,22,0.18)",  dropBorder:"#f97316" },
  { key:"low",              subtitle:"🌿 Eliminate", label:"Not Urgent & Not Important",color:"#6b7280", bg:"rgba(107,114,128,0.06)", border:"rgba(107,114,128,0.15)", dropBorder:"#6b7280" },
];

export const DEFAULT_FOLDERS = [
  { id:"work",     name:"Work",     icon:"💼", color:"#6366f1", boardType:"kanban" },
  { id:"study",    name:"Study",    icon:"📚", color:"#8b5cf6", boardType:"matrix" },
  { id:"personal", name:"Personal", icon:"🌟", color:"#ec4899", boardType:"matrix" },
];
