import { useState, useRef } from "react";
import { PRIORITY_QUADRANTS } from "../../constants";
import { MiniTaskCard } from "../cards/MiniTaskCard";

export function MatrixBoard({ tasks, folders, folderId, onComplete, onCancel, onEdit, onDelete, onPriorityChange, onNewTask }) {
  const [dragOver, setDragOver] = useState(null);
  const enterCount = useRef({});
  const active=tasks.filter(t=>t.folderId===folderId&&!t.completed&&!t.cancelled);
  const onDragOver =(e,k)=>{e.preventDefault();e.dataTransfer.dropEffect="move";};
  const onDragEnter=(e,k)=>{e.preventDefault();enterCount.current[k]=(enterCount.current[k]||0)+1;setDragOver(k);};
  const onDragLeave=(e,k)=>{enterCount.current[k]=Math.max((enterCount.current[k]||1)-1,0);if(!enterCount.current[k])setDragOver(p=>p===k?null:p);};
  const onDrop     =(e,k)=>{e.preventDefault();const id=e.dataTransfer.getData("taskId");enterCount.current[k]=0;setDragOver(null);if(id)onPriorityChange(id,k);};
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"grid", gridTemplateColumns:"32px 1fr", gridTemplateRows:"22px 1fr", gap:0, flex:1, minHeight:0 }}>
        <div style={{ gridColumn:"2", gridRow:"1", display:"flex", alignItems:"center", gap:8, marginBottom:8, paddingLeft:4 }}><div style={{ height:1, width:20, background:"rgba(255,255,255,0.07)" }} /><span style={{ fontSize:10, color:"#475569", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>IMPORTANCE →</span><div style={{ height:1, flex:1, background:"rgba(255,255,255,0.07)" }} /></div>
        <div style={{ gridColumn:"1", gridRow:"2", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:10, color:"#475569", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", writingMode:"vertical-rl", transform:"rotate(180deg)" }}>URGENCY ↑</span></div>
        <div style={{ gridColumn:"2", gridRow:"2", display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"1fr 1fr", gap:12, minHeight:0 }}>
          {PRIORITY_QUADRANTS.map(q=>{
            const isOver=dragOver===q.key; const qtasks=active.filter(t=>t.priority===q.key);
            return <div key={q.key} onDragOver={e=>onDragOver(e,q.key)} onDragEnter={e=>onDragEnter(e,q.key)} onDragLeave={e=>onDragLeave(e,q.key)} onDrop={e=>onDrop(e,q.key)} style={{ background:isOver?`${q.dropBorder}14`:q.bg, border:`${isOver?2:1}px solid ${isOver?q.dropBorder:q.border}`, borderRadius:16, padding:14, display:"flex", flexDirection:"column", transition:"all 0.15s", boxShadow:isOver?`0 0 0 4px ${q.dropBorder}18`:"none", position:"relative", minHeight:140, overflow:"auto" }}>
              {isOver&&<div style={{ position:"absolute", inset:8, border:`2px dashed ${q.dropBorder}60`, borderRadius:10, pointerEvents:"none", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ background:`${q.dropBorder}22`, backdropFilter:"blur(4px)", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:700, color:q.color, fontFamily:"'DM Sans',sans-serif" }}>Drop → {q.subtitle}</span></div>}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexShrink:0 }}>
                <div><div style={{ fontSize:13, fontWeight:700, color:q.color }}>{q.subtitle}</div><div style={{ fontSize:10, color:"#475569", marginTop:1 }}>{q.label}</div></div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  {qtasks.length>0&&<span style={{ background:`${q.color}22`, color:q.color, fontSize:11, fontWeight:700, padding:"1px 7px", borderRadius:20 }}>{qtasks.length}</span>}
                  <button onClick={()=>onNewTask(q.key)} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"#64748b", width:22, height:22, borderRadius:6, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7, flex:1, overflowY:"auto", opacity:isOver?0.2:1, transition:"opacity 0.12s" }}>
                {qtasks.map(task=><MiniTaskCard key={task.id} task={task} folders={folders} onComplete={onComplete} onCancel={onCancel} onEdit={onEdit} onDelete={onDelete} draggable={true} compact={true} />)}
                {qtasks.length===0&&!isOver&&<div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, paddingTop:10, cursor:"pointer" }} onClick={()=>onNewTask(q.key)}><div style={{ fontSize:16, color:"#1e293b" }}>＋</div><div style={{ fontSize:10, color:"#334155", fontStyle:"italic" }}>Drag tasks here</div></div>}
              </div>
            </div>;
          })}
        </div>
      </div>
      <div style={{ marginTop:10, textAlign:"center", fontSize:11, color:"#334155" }}>⠿ Grab the handle and drag between quadrants to reprioritize</div>
    </div>
  );
}
