import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { PRIORITY_CONFIG, DEFAULT_FOLDERS } from "../../constants";
import { CircularProgress } from "../common/CircularProgress";
import { ChartTooltip } from "../common/ChartTooltip";

export function HomePage({ tasks, folders, onNavigate, onNewTask }) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayStr = today.toISOString().split("T")[0];
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const ds = d.toISOString().split("T")[0];
    const count = tasks.filter(t => t.completed && t.completedAt?.startsWith(ds)).length;
    const label = d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
    return { date: label, completed: count, fullDate: ds };
  });

  const maxVal = Math.max(...chartData.map(d=>d.completed), 1);

  const monthTasks    = tasks.filter(t => new Date(t.createdAt) >= monthStart);
  const monthDone     = tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt) >= monthStart).length;
  const monthTotal    = tasks.filter(t => !t.cancelled && new Date(t.createdAt) >= monthStart).length;
  const monthPct      = monthTotal > 0 ? Math.round((monthDone / monthTotal) * 100) : 0;
  const monthName     = today.toLocaleDateString("en-US", { month:"long" });

  const doneToday = tasks.filter(t => t.completed && t.completedAt?.startsWith(todayStr)).length;
  const activeTotal = tasks.filter(t => !t.completed && !t.cancelled).length;

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const had = tasks.some(t => t.completed && t.completedAt?.startsWith(ds));
    if (had) streak++; else break;
  }

  const repeatTasks = tasks.filter(t => t.isScheduled && !t.completed && !t.cancelled).slice(0, 6);

  const folderBriefs = folders.map(f => {
    const folderTasks = tasks.filter(t => t.folderId === f.id && !t.completed && !t.cancelled);
    const urgent = folderTasks.filter(t => t.priority === "urgent-important");
    const preview = folderTasks.slice(0, 3);
    const total   = folderTasks.length;
    const doneCnt = tasks.filter(t => t.folderId === f.id && t.completed).length;
    const percent = total + doneCnt > 0 ? Math.round((doneCnt / (total + doneCnt)) * 100) : 0;
    return { ...f, total, doneCnt, percent, urgent: urgent.length, preview };
  });

  const repeatIcon = (t) => t.repeatType === "daily" ? "🌅" : t.repeatType === "weekly" ? "📅" : "🗓";
  const repeatLabel = (t) => {
    if(t.repeatType==="daily") return "Every day";
    if(t.repeatType==="weekly") return `Every ${t.repeatDay || "week"}`;
    if(t.repeatType==="monthly") return `Day ${t.repeatDate || 1} monthly`;
    return "Scheduled";
  };

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", height:"100%", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>
          {greeting} ✦
        </h1>
        <p style={{ color:"#475569", fontSize:13 }}>
          {today.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
          {doneToday > 0 && <span style={{ marginLeft:12, color:"#10b981", fontWeight:500 }}>· {doneToday} task{doneToday>1?"s":""} completed today 🎉</span>}
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {[
          { icon:"⚡", label:"Active Tasks",     value:activeTotal,  color:"#3b82f6", sub:"pending" },
          { icon:"✓",  label:"Done Today",        value:doneToday,    color:"#10b981", sub:"completed" },
          { icon:"📅", label:"Monthly Rate",      value:`${monthPct}%`, color:"#f59e0b", sub:`${monthName}` },
          { icon:"🔥", label:"Day Streak",        value:streak,       color:"#ef4444", sub:"consecutive days" },
        ].map(s=>(
          <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, boxShadow:`0 0 8px ${s.color}` }} />
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:"#f1f5f9", fontFamily:"'Playfair Display',serif", lineHeight:1, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#64748b" }}>{s.label}</div>
            <div style={{ fontSize:11, color:"#334155", marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:16, marginBottom:28 }}>
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"22px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:"#e2e8f0" }}>Daily Completions</div>
              <div style={{ fontSize:12, color:"#475569", marginTop:2 }}>Tasks completed per day — last 30 days</div>
            </div>
            <div style={{ fontSize:11, color:"#334155", background:"rgba(255,255,255,0.04)", padding:"4px 10px", borderRadius:8 }}>30 days</div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={chartData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false} axisLine={false} allowDecimals={false} domain={[0, maxVal+1]} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke:"rgba(245,158,11,0.2)", strokeWidth:1 }} />
              <Area type="monotone" dataKey="completed" stroke="#f59e0b" strokeWidth={2.5} fill="url(#goldGrad)" dot={false} activeDot={{ r:5, fill:"#f59e0b", stroke:"#0b0e1a", strokeWidth:2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"22px 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ textAlign:"center", width:"100%" }}>
            <div style={{ fontSize:15, fontWeight:600, color:"#e2e8f0", marginBottom:4 }}>Monthly Progress</div>
            <div style={{ fontSize:12, color:"#475569" }}>{monthName}</div>
          </div>
          <CircularProgress pct={monthPct} size={118} stroke={11} color={monthPct>=80?"#10b981":monthPct>=50?"#f59e0b":"#ef4444"} />
          <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { label:"Completed", count:monthDone, color:"#10b981" },
              { label:"Remaining", count:Math.max(monthTotal-monthDone,0), color:"#64748b" },
              { label:"Total this month", count:monthTotal, color:"#3b82f6" },
            ].map(row=>(
              <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#64748b" }}>{row.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:row.color }}>{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:12 }}>
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:"#e2e8f0" }}>🔁 Repeatable Tasks</div>
              <div style={{ fontSize:12, color:"#475569", marginTop:2 }}>Your scheduled routines</div>
            </div>
            <span style={{ background:"rgba(245,158,11,0.12)", color:"#f59e0b", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{tasks.filter(t=>t.isScheduled&&!t.completed&&!t.cancelled).length} active</span>
          </div>
          {repeatTasks.length === 0 ? (
            <div style={{ color:"#334155", fontSize:13, textAlign:"center", padding:"20px 0" }}>No scheduled tasks yet</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {repeatTasks.map(t => {
                const folder = DEFAULT_FOLDERS.find(f=>f.id===t.folderId) || { color:"#64748b", icon:"📁", name:t.folderId };
                const p = PRIORITY_CONFIG[t.priority];
                return (
                  <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:11, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{repeatIcon(t)}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                      <div style={{ fontSize:11, color:"#475569", marginTop:2, display:"flex", gap:8 }}>
                        <span>{repeatLabel(t)}</span>
                        {t.dueTime && <span>· {t.dueTime}</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                      <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:p.bg, color:p.color, fontWeight:600 }}>{p.icon}</span>
                      <span style={{ fontSize:10, color:folder.color }}>{folder.icon}</span>
                    </div>
                  </div>
                );
              })}
              {tasks.filter(t=>t.isScheduled&&!t.completed&&!t.cancelled).length > 6 && (
                <div style={{ fontSize:12, color:"#475569", textAlign:"center", paddingTop:4 }}>
                  +{tasks.filter(t=>t.isScheduled&&!t.completed&&!t.cancelled).length - 6} more scheduled tasks
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {folderBriefs.map(f => (
            <div key={f.id} onClick={()=>onNavigate(f.id)} style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${f.color}22`, borderRadius:16, padding:"16px 18px", cursor:"pointer", transition:"all 0.2s", flex:1 }} className="folder-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{f.icon}</span>
                  <div>
                    <span style={{ fontSize:14, fontWeight:600, color:f.color }}>{f.name}</span>
                    <span style={{ marginLeft:7, fontSize:10, padding:"2px 6px", borderRadius:4, background:`${f.color}18`, color:f.color, fontWeight:600, letterSpacing:"0.04em" }}>{f.boardType==="kanban"?"KANBAN":"MATRIX"}</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {f.urgent > 0 && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"rgba(239,68,68,0.12)", color:"#ef4444", fontWeight:600 }}>🔥 {f.urgent} urgent</span>}
                  <span style={{ fontSize:11, color:"#64748b" }}>{f.total} pending</span>
                </div>
              </div>

              {f.preview.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {f.preview.map(t => {
                    const p = PRIORITY_CONFIG[t.priority];
                    return (
                      <div key={t.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:p.color, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:"#94a3b8", flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</span>
                        {t.dueDate && <span style={{ fontSize:10, color:"#334155", flexShrink:0 }}>{t.dueDate===new Date().toISOString().split("T")[0]?"Today":t.dueDate}</span>}
                      </div>
                    );
                  })}
                  {f.total > 3 && <div style={{ fontSize:11, color:"#334155", paddingLeft:12, marginTop:2 }}>+{f.total-3} more tasks</div>}
                </div>
              ) : (
                <div style={{ fontSize:12, color:"#334155", fontStyle:"italic" }}>No pending tasks — all clear! ✓</div>
              )}

              {(f.total + f.doneCnt) > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${f.percent}%`, background:f.color, borderRadius:4, transition:"width 0.6s ease" }} />
                  </div>
                  <div style={{ fontSize:10, color:"#334155", marginTop:4 }}>{f.percent}% complete</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
