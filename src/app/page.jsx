"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PRIORITY_CONFIG, KANBAN_COLS, DEFAULT_FOLDERS } from "@/constants";
import { SAMPLE_TASKS } from "@/data";
import { inputStyle } from "@/constants/styles";
import { Toast, ChartTooltip, CircularProgress } from "@/components/common";
import { NewFolderModal, TaskModal } from "@/components/modals";
import { KanbanBoard, MatrixBoard } from "@/components/boards";
import { HomePage, ListView } from "@/components/views";
import { MiniTaskCard } from "@/components/cards";

export default function App() {
  const [tasks,   setTasks]   = useState(SAMPLE_TASKS);
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [selectedFolder, setSelectedFolder] = useState("home");
  const [activeTab, setActiveTab]           = useState("board");
  const [showTaskModal,   setShowTaskModal]   = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingTask,     setEditingTask]     = useState(null);
  const [newTaskDefaults, setNewTaskDefaults] = useState({});
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const notifiedRef = useRef(new Set());

  let taskIdCounter = 2000;
  const genId = () => `t${++taskIdCounter}`;

  const addToast = useCallback((msg,type="info")=>{ const id=Date.now()+Math.random(); setToasts(p=>[...p,{id,message:msg,type}]); },[]);

  useEffect(()=>{
    const check=()=>{ const now=new Date(); tasks.filter(t=>!t.completed&&!t.cancelled&&t.dueDate&&t.dueTime&&t.reminderBefore>0).forEach(task=>{ const due=new Date(`${task.dueDate}T${task.dueTime}`); const diff=(due-now)/60000; if(diff>0&&diff<=task.reminderBefore&&!notifiedRef.current.has(task.id)){ notifiedRef.current.add(task.id); addToast(`⏰ "${task.title}" due in ${Math.round(diff)} min!`,"warning"); } }); };
    check(); const iv=setInterval(check,60000); return ()=>clearInterval(iv);
  },[tasks,addToast]);

  useEffect(()=>{ if("Notification" in window&&Notification.permission==="default") Notification.requestPermission(); },[]);

  const curFolder = folders.find(f=>f.id===selectedFolder);

  const saveTask=(form)=>{ if(editingTask){ setTasks(p=>p.map(t=>t.id===editingTask.id?{...t,...form}:t)); addToast("Task updated!","success"); } else { setTasks(p=>[...p,{...form,id:genId(),completed:false,cancelled:false,completedAt:null,createdAt:new Date().toISOString()}]); addToast("Task created!","success"); } setShowTaskModal(false); setEditingTask(null); setNewTaskDefaults({}); };
  const completeTask=(id)=>{ setTasks(p=>p.map(t=>t.id===id?{...t,completed:true,completedAt:new Date().toISOString()}:t)); addToast("Task completed!","success"); };
  const cancelTask  =(id)=>{ setTasks(p=>p.map(t=>t.id===id?{...t,cancelled:true}:t)); addToast("Task cancelled.","info"); };
  const deleteTask  =(id)=>setTasks(p=>p.filter(t=>t.id!==id));
  const openEdit    =(task)=>{ setEditingTask(task); setShowTaskModal(true); };

  const changeStatus=(taskId,ns)=>{ setTasks(p=>p.map(t=>{ if(t.id!==taskId||t.kanbanStatus===ns) return t; const col=KANBAN_COLS.find(c=>c.key===ns); addToast(`Moved to "${col?.label}"`,"success"); if(ns==="done") return {...t,kanbanStatus:ns,completed:true,completedAt:new Date().toISOString()}; return {...t,kanbanStatus:ns}; })); };
  const changePriority=(taskId,np)=>{ setTasks(p=>p.map(t=>{ if(t.id!==taskId||t.priority===np) return t; addToast(`Moved to "${PRIORITY_CONFIG[np].desc}"`,"success"); return {...t,priority:np}; })); };

  const openNewTask=(defaults={})=>{ setEditingTask(null); setNewTaskDefaults(defaults); setShowTaskModal(true); };
  const saveFolder=(data)=>{ setFolders(p=>[...p,{id:`f_${Date.now()}`,...data}]); addToast(`"${data.name}" created!`,"success"); setShowFolderModal(false); };
  const pendingCount=(fid)=>tasks.filter(t=>!t.completed&&!t.cancelled&&(fid==="all"||t.folderId===fid)).length;

  const boardTasks = tasks.filter(t=>{
    if(activeTab==="history"&&!t.completed&&!t.cancelled) return false;
    if(activeTab==="board"&&(t.completed||t.cancelled)) return false;
    if(selectedFolder!=="home"&&selectedFolder!=="all"&&t.folderId!==selectedFolder) return false;
    if(search&&!t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderMain=()=>{
    if(selectedFolder==="home") return <HomePage tasks={tasks} folders={folders} onNavigate={(fid)=>{ setSelectedFolder(fid); setActiveTab("board"); }} onNewTask={openNewTask} />;
    if(activeTab==="history") return <ListView tasks={boardTasks} folders={folders} onComplete={completeTask} onCancel={cancelTask} onEdit={openEdit} onDelete={deleteTask} />;
    if(!curFolder) return <ListView tasks={boardTasks} folders={folders} onComplete={completeTask} onCancel={cancelTask} onEdit={openEdit} onDelete={deleteTask} />;
    if(curFolder.boardType==="kanban") return <KanbanBoard tasks={boardTasks} folders={folders} folderId={selectedFolder} onComplete={completeTask} onCancel={cancelTask} onEdit={openEdit} onDelete={deleteTask} onStatusChange={changeStatus} onNewTask={(ck)=>openNewTask({folderId:selectedFolder,kanbanStatus:ck})} />;
    if(curFolder.boardType==="matrix") return <MatrixBoard tasks={boardTasks} folders={folders} folderId={selectedFolder} onComplete={completeTask} onCancel={cancelTask} onEdit={openEdit} onDelete={deleteTask} onPriorityChange={changePriority} onNewTask={(qk)=>openNewTask({folderId:selectedFolder,priority:qk})} />;
    return <ListView tasks={boardTasks} folders={folders} onComplete={completeTask} onCancel={cancelTask} onEdit={openEdit} onDelete={deleteTask} />;
  };

  const boardLabel = curFolder?.boardType==="kanban"?"⚙️ Kanban":curFolder?.boardType==="matrix"?"⊞ Matrix":null;
  const isHome = selectedFolder==="home";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0b0e1a;}
        ::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
        @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input[type='date']::-webkit-calendar-picker-indicator,input[type='time']::-webkit-calendar-picker-indicator{filter:invert(0.5);}
        select option{background:#1a1d2e;color:#e2e8f0;}
        .folder-btn:hover{background:rgba(255,255,255,0.06)!important;}
        .folder-card:hover{border-color:rgba(255,255,255,0.12)!important;background:rgba(255,255,255,0.04)!important;}
      `}</style>

      <div style={{ display:"flex", height:"100vh", background:"#0b0e1a", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0", overflow:"hidden" }}>

        <div style={{ width:250, background:"rgba(255,255,255,0.02)", borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", padding:"24px 0", flexShrink:0 }}>
          <div style={{ padding:"0 20px 22px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✦</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:"#f1f5f9" }}>TaskFlow</div>
                <div style={{ fontSize:11, color:"#475569" }}>Stay organized</div>
              </div>
            </div>
          </div>

          <div style={{ padding:"14px 12px", flex:1, overflowY:"auto" }}>
            <div style={{ fontSize:11, color:"#475569", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0 8px", marginBottom:6 }}>Overview</div>
            <button className="folder-btn" onClick={()=>setSelectedFolder("home")} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 12px", borderRadius:10, border:"none", background:isHome?"rgba(245,158,11,0.12)":"transparent", color:isHome?"#f59e0b":"#94a3b8", cursor:"pointer", textAlign:"left", fontSize:14, transition:"all 0.15s" }}>
              <span style={{ fontSize:16 }}>🏠</span>
              <span style={{ flex:1 }}>Home</span>
            </button>

            <div style={{ fontSize:11, color:"#475569", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 8px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>Folders</span>
              <button onClick={()=>setShowFolderModal(true)} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"#94a3b8", width:22, height:22, borderRadius:6, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>

            {folders.map(folder=>(
              <button key={folder.id} className="folder-btn" onClick={()=>{ setSelectedFolder(folder.id); setActiveTab("board"); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:10, border:"none", background:selectedFolder===folder.id?`${folder.color}18`:"transparent", color:selectedFolder===folder.id?folder.color:"#94a3b8", cursor:"pointer", textAlign:"left", fontSize:13, transition:"all 0.15s" }}>
                <span style={{ fontSize:15, flexShrink:0 }}>{folder.icon}</span>
                <span style={{ flex:1 }}>{folder.name}</span>
                <span style={{ fontSize:9, padding:"2px 5px", borderRadius:4, background:`${folder.color}18`, color:folder.color, fontWeight:600, letterSpacing:"0.04em", flexShrink:0 }}>{folder.boardType==="kanban"?"KB":"MX"}</span>
                {pendingCount(folder.id)>0&&<span style={{ background:`${folder.color}25`, color:folder.color, fontSize:11, fontWeight:600, padding:"1px 6px", borderRadius:10, flexShrink:0 }}>{pendingCount(folder.id)}</span>}
              </button>
            ))}
          </div>

          <div style={{ padding:"14px 12px 0", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                {[{label:"Active",count:tasks.filter(t=>!t.completed&&!t.cancelled).length,color:"#3b82f6"},
                  {label:"Done",  count:tasks.filter(t=>t.completed).length, color:"#10b981"},
                  {label:"Cancel",count:tasks.filter(t=>t.cancelled).length, color:"#6b7280"}].map(s=>(
                  <div key={s.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:700, color:s.color, fontFamily:"'Playfair Display',serif" }}>{s.count}</div>
                    <div style={{ fontSize:10, color:"#475569" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {!isHome && (
            <>
              <div style={{ padding:"18px 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", flexShrink:0 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {curFolder&&<span style={{ fontSize:22 }}>{curFolder.icon}</span>}
                    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#f1f5f9", fontWeight:700 }}>{curFolder?.name||"Tasks"}</h1>
                    {boardLabel&&<span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:curFolder?.boardType==="kanban"?"rgba(59,130,246,0.15)":"rgba(245,158,11,0.12)", color:curFolder?.boardType==="kanban"?"#60a5fa":"#fbbf24", fontWeight:600, letterSpacing:"0.04em" }}>{boardLabel}</span>}
                  </div>
                  <p style={{ fontSize:12, color:"#475569", marginTop:2 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#475569", fontSize:13 }}>🔍</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...inputStyle,paddingLeft:34,width:170}} />
                  </div>
                  <button onClick={()=>openNewTask(curFolder?{folderId:selectedFolder}:{})} style={{ padding:"9px 18px", background:"linear-gradient(135deg,#f59e0b,#ef4444)", border:"none", borderRadius:12, color:"#fff", fontWeight:600, cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>+ New Task</button>
                </div>
              </div>
              <div style={{ display:"flex", padding:"0 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
                {[["board",curFolder?.boardType==="kanban"?"⚙️ Board":"⊞ Board"],["history","📋 History"]].map(([k,lbl])=>(
                  <button key={k} onClick={()=>setActiveTab(k)} style={{ padding:"12px 18px", border:"none", background:"none", color:activeTab===k?"#f59e0b":"#64748b", cursor:"pointer", fontSize:13, fontWeight:500, borderBottom:`2px solid ${activeTab===k?"#f59e0b":"transparent"}`, fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                    {lbl}
                    {k==="history"&&tasks.filter(t=>t.completed||t.cancelled).length>0&&<span style={{ marginLeft:7, background:"rgba(255,255,255,0.07)", color:"#64748b", fontSize:10, padding:"1px 6px", borderRadius:10 }}>{tasks.filter(t=>t.completed||t.cancelled).length}</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ flex:1, overflowY:curFolder?.boardType==="kanban"&&activeTab==="board"?"hidden":"auto", overflowX:"hidden", padding:isHome?"0":"24px 28px", animation:"fadeIn 0.25s ease" }}>
            {renderMain()}
          </div>
        </div>
      </div>

      {showFolderModal&&<NewFolderModal onSave={saveFolder} onClose={()=>setShowFolderModal(false)} />}
      {showTaskModal&&<TaskModal task={editingTask} folders={folders} defaultFolderId={newTaskDefaults.folderId||selectedFolder} onSave={form=>saveTask({...form,...(!editingTask?newTaskDefaults:{})})} onClose={()=>{ setShowTaskModal(false); setEditingTask(null); setNewTaskDefaults({}); }} />}
      {toasts.map(t=><Toast key={t.id} message={t.message} type={t.type} onClose={()=>setToasts(p=>p.filter(x=>x.id!==t.id))} />)}
    </>
  );
}
