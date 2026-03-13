export function CircularProgress({ pct, size=100, stroke=9, color="#f59e0b", label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1s ease" }} />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:20, fontWeight:700, color:"#f1f5f9", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{pct}%</span>
          <span style={{ fontSize:9, color:"#64748b", marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>done</span>
        </div>
      </div>
      {label    && <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600, textAlign:"center" }}>{label}</div>}
      {sublabel && <div style={{ fontSize:11, color:"#64748b", textAlign:"center" }}>{sublabel}</div>}
    </div>
  );
}
