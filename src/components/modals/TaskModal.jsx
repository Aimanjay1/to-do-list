import { useState } from "react";
import { labelStyle, inputStyle } from "../../constants/styles";
import { PRIORITY_CONFIG, KANBAN_COLS } from "../../constants";

export function TaskModal({ task, folders, defaultFolderId, onSave, onClose }) {
  const defF = folders.find(f=>f.id===defaultFolderId)||folders[0];
  const [form, setForm] = useState(task||{ title:"", description:"", folderId:defF?.id||folders[0]?.id, priority:"urgent-important", kanbanStatus:"backlog", dueDate:"", dueTime:"", isScheduled:false, repeatType:"daily", repeatDay:"monday", repeatDate:1, reminderBefore:30 });
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const selF = folders.find(f=>f.id===form.folderId);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#1a1d2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:32, width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <h2 style={{ margin:0, color:"#f1f5f9", fontSize:20, fontFamily:"'Playfair Display',serif" }}>{task?"Edit Task":"New Task"}</h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#94a3b8", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div><label style={labelStyle}>Task Title *</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What needs to be done?" style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Add details..." rows={2} style={{...inputStyle,resize:"vertical"}} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Folder</label><select value={form.folderId} onChange={e=>set("folderId",e.target.value)} style={inputStyle}>{folders.map(f=><option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}</select></div>
            {selF?.boardType==="kanban"?(
              <div><label style={labelStyle}>Column</label><select value={form.kanbanStatus} onChange={e=>set("kanbanStatus",e.target.value)} style={inputStyle}>{KANBAN_COLS.map(c=><option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select></div>
            ):(
              <div><label style={labelStyle}>Priority</label><select value={form.priority} onChange={e=>set("priority",e.target.value)} style={inputStyle}>{Object.entries(PRIORITY_CONFIG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.desc}</option>)}</select></div>
            )}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={labelStyle}>Due Date</label><input type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Due Time</label><input type="time" value={form.dueTime} onChange={e=>set("dueTime",e.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", color:"#e2e8f0", fontSize:14, fontWeight:500 }}>
              <input type="checkbox" checked={form.isScheduled} onChange={e=>set("isScheduled",e.target.checked)} style={{ width:16,height:16,accentColor:"#f59e0b" }} />
              🔁 Repeating / Scheduled Task
            </label>
            {form.isScheduled&&(
              <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:12 }}>
                <div><label style={labelStyle}>Repeat</label>
                  <div style={{ display:"flex", gap:8 }}>{["daily","weekly","monthly"].map(r=><button key={r} onClick={()=>set("repeatType",r)} style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1px solid ${form.repeatType===r?"#f59e0b":"rgba(255,255,255,0.1)"}`, background:form.repeatType===r?"rgba(245,158,11,0.15)":"transparent", color:form.repeatType===r?"#f59e0b":"#94a3b8", cursor:"pointer", fontSize:13, textTransform:"capitalize", fontFamily:"'DM Sans',sans-serif" }}>{r}</button>)}</div>
                </div>
                {form.repeatType==="weekly"&&<div><label style={labelStyle}>Day of Week</label><select value={form.repeatDay} onChange={e=>set("repeatDay",e.target.value)} style={inputStyle}>{["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(d=><option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}</select></div>}
                {form.repeatType==="monthly"&&<div><label style={labelStyle}>Day of Month</label><select value={form.repeatDate} onChange={e=>set("repeatDate",parseInt(e.target.value))} style={inputStyle}>{Array.from({length:28},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select></div>}
              </div>
            )}
          </div>
          <div><label style={labelStyle}>⏰ Remind me before</label><select value={form.reminderBefore} onChange={e=>set("reminderBefore",parseInt(e.target.value))} style={inputStyle}>{[0,5,10,15,30,60,120,1440].map(m=><option key={m} value={m}>{m===0?"No reminder":m<60?`${m} min`:`${m/60} hour${m/60>1?"s":""}`}</option>)}</select></div>
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
            <button onClick={()=>form.title.trim()&&onSave(form)} style={{ flex:2, padding:"12px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#f59e0b,#ef4444)", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{task?"Update Task":"Create Task"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
