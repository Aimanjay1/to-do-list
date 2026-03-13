import { useState } from "react";
import { labelStyle, inputStyle } from "../../constants/styles";
import { PRIORITY_CONFIG, KANBAN_COLS } from "../../constants";

export function NewFolderModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [boardType, setBoardType] = useState(null);
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("#6366f1");
  const ICONS  = ["📁","💼","📚","🌟","🎯","🏠","⚙️","💡","🎨","🚀","🔬","💪"];
  const COLORS = ["#6366f1","#8b5cf6","#ec4899","#ef4444","#f97316","#f59e0b","#10b981","#14b8a6","#3b82f6","#06b6d4"];
  const canSave = name.trim() && boardType;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(10px)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#141727", border:"1px solid rgba(255,255,255,0.1)", borderRadius:24, padding:36, width:"100%", maxWidth:560, fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h2 style={{ margin:0, color:"#f1f5f9", fontSize:22, fontFamily:"'Playfair Display',serif", fontWeight:700 }}>New Folder</h2>
            <p style={{ margin:"4px 0 0", color:"#475569", fontSize:13 }}>Choose a board type to organize your tasks</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none", color:"#94a3b8", width:34, height:34, borderRadius:8, cursor:"pointer", fontSize:18 }}>×</button>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={labelStyle}>Board Type *</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div onClick={()=>setBoardType("kanban")} style={{ cursor:"pointer", border:`2px solid ${boardType==="kanban"?"#3b82f6":"rgba(255,255,255,0.08)"}`, borderRadius:16, padding:20, background:boardType==="kanban"?"rgba(59,130,246,0.08)":"rgba(255,255,255,0.02)", transition:"all 0.2s", position:"relative" }}>
              {boardType==="kanban"&&<div style={{ position:"absolute", top:10, right:10, width:18, height:18, background:"#3b82f6", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff" }}>✓</div>}
              <div style={{ display:"flex", gap:5, marginBottom:14, height:52 }}>
                {[{c:"#64748b",n:2},{c:"#3b82f6",n:1},{c:"#f59e0b",n:1},{c:"#10b981",n:1}].map((col,i)=>(
                  <div key={i} style={{ flex:1, background:`${col.c}18`, borderRadius:6, padding:"4px 5px", display:"flex", flexDirection:"column", gap:3 }}>
                    {Array.from({length:col.n}).map((_,j)=><div key={j} style={{ height:10, background:`${col.c}50`, borderRadius:3 }} />)}
                  </div>
                ))}
              </div>
              <div style={{ color:boardType==="kanban"?"#60a5fa":"#e2e8f0", fontSize:15, fontWeight:700, marginBottom:4 }}>Kanban Board</div>
              <div style={{ color:"#64748b", fontSize:12, lineHeight:1.5 }}>Backlog → In Progress → Review → Done. Best for <span style={{ color:"#94a3b8" }}>project tasks & sprints</span>.</div>
            </div>
            <div onClick={()=>setBoardType("matrix")} style={{ cursor:"pointer", border:`2px solid ${boardType==="matrix"?"#f59e0b":"rgba(255,255,255,0.08)"}`, borderRadius:16, padding:20, background:boardType==="matrix"?"rgba(245,158,11,0.07)":"rgba(255,255,255,0.02)", transition:"all 0.2s", position:"relative" }}>
              {boardType==="matrix"&&<div style={{ position:"absolute", top:10, right:10, width:18, height:18, background:"#f59e0b", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#000" }}>✓</div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:14, height:52 }}>
                {["#ef4444","#3b82f6","#f97316","#6b7280"].map((c,i)=>(
                  <div key={i} style={{ background:`${c}18`, borderRadius:5, border:`1px solid ${c}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:16, height:5, background:`${c}60`, borderRadius:3 }} />
                  </div>
                ))}
              </div>
              <div style={{ color:boardType==="matrix"?"#fbbf24":"#e2e8f0", fontSize:15, fontWeight:700, marginBottom:4 }}>Priority Matrix</div>
              <div style={{ color:"#64748b", fontSize:12, lineHeight:1.5 }}>Eisenhower 4-quadrant board. Best for <span style={{ color:"#94a3b8" }}>daily, weekly & personal tasks</span>.</div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelStyle}>Folder Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Q2 Sprint, Study Plan, Health..." style={inputStyle} autoFocus />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelStyle}>Icon</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ICONS.map(i=><button key={i} onClick={()=>setIcon(i)} style={{ width:36, height:36, borderRadius:8, border:`2px solid ${icon===i?"#f59e0b":"rgba(255,255,255,0.08)"}`, background:icon===i?"rgba(245,158,11,0.12)":"rgba(255,255,255,0.04)", cursor:"pointer", fontSize:16 }}>{i}</button>)}
          </div>
        </div>
        <div style={{ marginBottom:28 }}>
          <label style={labelStyle}>Color</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {COLORS.map(c=><button key={c} onClick={()=>setColor(c)} style={{ width:28, height:28, borderRadius:"50%", border:`3px solid ${color===c?"#fff":"transparent"}`, background:c, cursor:"pointer", outline:color===c?`2px solid ${c}`:"none", outlineOffset:2 }} />)}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 16px", flex:1 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <div>
              <div style={{ color:color, fontSize:14, fontWeight:600 }}>{name||"Folder name"}</div>
              <div style={{ color:"#475569", fontSize:11 }}>{boardType==="kanban"?"Kanban Board":boardType==="matrix"?"Priority Matrix":"No board type selected"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding:"11px 18px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={()=>canSave&&onSave({name:name.trim(),icon,color,boardType})} style={{ padding:"11px 22px", borderRadius:12, border:"none", background:canSave?"linear-gradient(135deg,#f59e0b,#ef4444)":"rgba(255,255,255,0.06)", color:canSave?"#fff":"#475569", cursor:canSave?"pointer":"not-allowed", fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>Create Folder</button>
        </div>
      </div>
    </div>
  );
}
