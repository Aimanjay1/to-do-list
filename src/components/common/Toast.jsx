import { useEffect } from "react";

export function Toast({ message, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return ()=>clearTimeout(t); },[onClose]);
  const colors={success:"#10b981",warning:"#f59e0b",info:"#3b82f6"};
  return <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:colors[type]||colors.info, color:"#fff", padding:"12px 20px", borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, boxShadow:"0 8px 32px rgba(0,0,0,0.4)", display:"flex", alignItems:"center", gap:10, maxWidth:340, animation:"slideIn 0.3s ease" }}>{type==="success"?"✓":type==="warning"?"⏰":"ℹ"} {message}<button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:16 }}>×</button></div>;
}
