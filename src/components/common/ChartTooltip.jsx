export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1e2235", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ color:"#64748b", fontSize:11, marginBottom:4 }}>{label}</div>
      <div style={{ color:"#f59e0b", fontSize:18, fontWeight:700, fontFamily:"'Playfair Display',serif" }}>{payload[0].value}</div>
      <div style={{ color:"#94a3b8", fontSize:11 }}>tasks completed</div>
    </div>
  );
}
