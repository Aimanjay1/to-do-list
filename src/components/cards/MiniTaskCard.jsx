import { useState } from "react";
import { PRIORITY_CONFIG, KANBAN_COLS, DEFAULT_FOLDERS } from "../../constants";
import { iconBtn } from "../../constants/styles";

export function MiniTaskCard({ task, folders, onComplete, onCancel, onEdit, onDelete, draggable=false, onDragStart, compact=false }) {
  const [isDragging, setIsDragging] = useState(false);
  const p = PRIORITY_CONFIG[task.priority];
  const folder = folders.find(f=>f.id===task.folderId);
  const isOverdue = task.dueDate&&!task.completed&&!task.cancelled&&new Date(task.dueDate)<new Date(new Date().toDateString());
  const daysUntil = task.dueDate?Math.ceil((new Date(task.dueDate)-new Date(new Date().toDateString()))/86400000):null;
  return (
    <div draggable={draggable} onDragStart={draggable?e=>{setIsDragging(true);e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("taskId",task.id);if(onDragStart)onDragStart(task.id);}:undefined} onDragEnd={draggable?()=>setIsDragging(false):undefined}
      style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${isOverdue?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.08)"}`, borderRadius:12, padding:compact?"10px 12px":"12px 14px", display:"flex", flexDirection:"column", gap:7, transition:"all 0.15s", opacity:isDragging?0.2:task.cancelled?0.5:1, cursor:draggable?"grab":"default", userSelect:"none", position:"relative" }}>
      {isOverdue&&<div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#ef4444,#f97316)", borderRadius:"12px 12px 0 0" }} />}
      <div style={{ display:"flex", alignItems:"flex-start", gap:7 }}>
        {draggable&&<span style={{ color:"#2d3748", fontSize:13, marginTop:1, flexShrink:0, cursor:"grab" }}>⠿</span>}
        {!task.completed&&!task.cancelled&&<button onClick={()=>onComplete(task.id)} style={{ width:16,height:16,borderRadius:"50%",border:`2px solid ${p?.color||"#64748b"}`,background:"transparent",cursor:"pointer",flexShrink:0,marginTop:2 }} />}
        {task.completed&&<div style={{ width:16,height:16,borderRadius:"50%",background:"#10b981",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff" }}>✓</div>}
        <span style={{ flex:1, color:task.completed?"#64748b":"#f1f5f9", fontSize:13, fontWeight:500, textDecoration:task.completed?"line-through":"none", lineHeight:1.4 }}>{task.title}</span>
        <div style={{ display:"flex", gap:3, flexShrink:0 }}>
          {!task.completed&&!task.cancelled&&<><button onClick={()=>onEdit(task)} style={iconBtn}>✏️</button><button onClick={()=>onCancel(task.id)} style={iconBtn}>✕</button></>}
          {(task.completed||task.cancelled)&&<button onClick={()=>onDelete(task.id)} style={{...iconBtn,color:"#ef4444"}}>🗑</button>}
        </div>
      </div>
      {task.description&&!compact&&<p style={{ margin:0, color:"#64748b", fontSize:11, paddingLeft:draggable?20:23 }}>{task.description}</p>}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", paddingLeft:draggable?20:23 }}>
        {task.dueDate&&<span style={{ fontSize:10, color:isOverdue?"#ef4444":daysUntil===0?"#f97316":"#64748b", fontWeight:isOverdue?600:400 }}>📅 {isOverdue?"Overdue!":daysUntil===0?"Today":task.dueDate}{task.dueTime?` · ${task.dueTime}`:""}</span>}
        {task.isScheduled&&<span style={{ fontSize:10, padding:"1px 5px", borderRadius:4, background:"rgba(245,158,11,0.1)", color:"#f59e0b" }}>🔁 {task.repeatType}</span>}
        {task.reminderBefore>0&&!task.completed&&<span style={{ fontSize:10, color:"#475569" }}>⏰ {task.reminderBefore<60?`${task.reminderBefore}m`:`${task.reminderBefore/60}h`}</span>}
        {KANBAN_COLS.find(c=>c.key===task.kanbanStatus)&&p&&<span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, background:p.bg, color:p.color, fontWeight:500 }}>{p.icon} {p.label}</span>}
      </div>
    </div>
  );
}
