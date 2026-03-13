import { MiniTaskCard } from "../cards/MiniTaskCard";

export function ListView({ tasks, folders, onComplete, onCancel, onEdit, onDelete }) {
  if(!tasks.length) return <div style={{ textAlign:"center", padding:"60px 20px" }}><div style={{ fontSize:48, marginBottom:16 }}>📋</div><div style={{ fontSize:15, fontWeight:500, color:"#475569", marginBottom:6 }}>Nothing here yet</div><div style={{ fontSize:13, color:"#334155" }}>Select a folder or create a task to get started</div></div>;
  return <div style={{ display:"flex", flexDirection:"column", gap:9 }}>{tasks.map(task=><MiniTaskCard key={task.id} task={task} folders={folders} onComplete={onComplete} onCancel={onCancel} onEdit={onEdit} onDelete={onDelete} />)}</div>;
}
