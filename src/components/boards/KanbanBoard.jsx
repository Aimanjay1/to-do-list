import { useState, useRef } from "react";
import { KANBAN_COLS } from "../../constants";
import { MiniTaskCard } from "../cards/MiniTaskCard";

export function KanbanBoard({ tasks, folders, folderId, onComplete, onCancel, onEdit, onDelete, onStatusChange, onNewTask }) {
  const [dragOver, setDragOver] = useState(null);
  const enterCount = useRef({});
  const colTasks=(key)=>tasks.filter(t=>t.folderId===folderId&&!t.cancelled&&t.kanbanStatus===key);
  const onDragOver =(e,k)=>{e.preventDefault();e.dataTransfer.dropEffect="move";};
  const onDragEnter=(e,k)=>{e.preventDefault();enterCount.current[k]=(enterCount.current[k]||0)+1;setDragOver(k);};
  const onDragLeave=(e,k)=>{enterCount.current[k]=Math.max((enterCount.current[k]||1)-1,0);if(!enterCount.current[k])setDragOver(p=>p===k?null:p);};
  const onDrop     =(e,k)=>{e.preventDefault();const id=e.dataTransfer.getData("taskId");enterCount.current[k]=0;setDragOver(null);if(id)onStatusChange(id,k);};
  return (
    <div style={{ display:"flex", gap:14, height:"100%", overflowX:"auto", paddingBottom:8 }}>
      {KANBAN_COLS.map(col=>{
        const isOver=dragOver===col.key; const ctasks=colTasks(col.key);
        return <div key={col.key} onDragOver={e=>onDragOver(e,col.key)} onDragEnter={e=>onDragEnter(e,col.key)} onDragLeave={e=>onDragLeave(e,col.key)} onDrop={e=>onDrop(e,col.key)} style={{ flex:"0 0 260px", display:"flex", flexDirection:"column", background:isOver?`${col.color}10`:col.bg, border:`${isOver?2:1}px solid ${isOver?col.color:col.border}`, borderRadius:16, padding:14, transition:"all 0.15s", boxShadow:isOver?`0 0 0 4px ${col.color}18`:"none", maxHeight:"100%", minHeight:320, position:"relative" }}>
          {isOver&&<div style={{ position:"absolute", inset:8, border:`2px dashed ${col.color}60`, borderRadius:10, pointerEvents:"none", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ background:`${col.color}22`, backdropFilter:"blur(4px)", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, color:col.color, fontFamily:"'DM Sans',sans-serif" }}>Drop → {col.icon} {col.label}</span></div>}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}><span style={{ fontSize:15 }}>{col.icon}</span><span style={{ fontSize:13, fontWeight:700, color:col.color }}>{col.label}</span>{ctasks.length>0&&<span style={{ background:`${col.color}20`, color:col.color, fontSize:11, fontWeight:700, padding:"1px 7px", borderRadius:20 }}>{ctasks.length}</span>}</div>
            <button onClick={()=>onNewTask(col.key)} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"#64748b", width:24, height:24, borderRadius:6, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, overflowY:"auto", opacity:isOver?0.25:1, transition:"opacity 0.12s" }}>
            {ctasks.map(task=><MiniTaskCard key={task.id} task={task} folders={folders} onComplete={onComplete} onCancel={onCancel} onEdit={onEdit} onDelete={onDelete} draggable={true} compact={true} />)}
            {ctasks.length===0&&!isOver&&<div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, paddingTop:20, cursor:"pointer" }} onClick={()=>onNewTask(col.key)}><div style={{ fontSize:22, color:"#1e293b" }}>＋</div><div style={{ fontSize:11, color:"#334155", fontStyle:"italic" }}>Add a task</div></div>}
          </div>
        </div>;
      })}
    </div>
  );
}
