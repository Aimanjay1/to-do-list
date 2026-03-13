import { PRIORITY_CONFIG, DEFAULT_FOLDERS } from "../constants";

const genHistory = () => {
  const tasks = [];
  const patterns = [0,1,2,1,3,2,4,2,1,3,5,3,2,4,3,2,1,3,4,2,3,5,2,4,3,1,2,4,3,2];
  const folders = ["work","study","personal"];
  let id = 1000;
  patterns.forEach((count, dayOffset) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - dayOffset));
    const dateStr = d.toISOString().split("T")[0];
    for(let i=0;i<count;i++){
      const fid = folders[Math.floor(Math.random()*3)];
      tasks.push({ id:`h${id++}`, title:`Completed task`, description:"", folderId:fid, priority:"low", kanbanStatus:"done", dueDate:dateStr, dueTime:"", isScheduled:false, repeatType:null, reminderBefore:0, completed:true, cancelled:false, completedAt:new Date(d.getTime()+i*3600000).toISOString(), createdAt:new Date(d.getTime()-86400000).toISOString() });
    }
  });
  return tasks;
};

export const HISTORY_TASKS = genHistory();

export const SAMPLE_TASKS = [
  { id:"1", title:"Set up CI/CD pipeline",    description:"Configure GitHub Actions",      folderId:"work",     priority:"urgent-important", kanbanStatus:"in-progress", dueDate:new Date(Date.now()+86400000).toISOString().split("T")[0],   dueTime:"09:00", isScheduled:false, repeatType:null,      reminderBefore:60, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"2", title:"Write unit tests",          description:"Cover auth module",             folderId:"work",     priority:"important",        kanbanStatus:"backlog",     dueDate:new Date(Date.now()+172800000).toISOString().split("T")[0],  dueTime:"",      isScheduled:false, repeatType:null,      reminderBefore:0,  completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"3", title:"Design system PR review",   description:"Approve component library PR",  folderId:"work",     priority:"urgent",           kanbanStatus:"review",      dueDate:new Date().toISOString().split("T")[0],                       dueTime:"15:00", isScheduled:false, repeatType:null,      reminderBefore:30, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"4", title:"Deploy v2.1 to staging",    description:"Smoke test before prod push",   folderId:"work",     priority:"urgent-important", kanbanStatus:"backlog",     dueDate:new Date(Date.now()+259200000).toISOString().split("T")[0],  dueTime:"",      isScheduled:false, repeatType:null,      reminderBefore:0,  completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"5", title:"Read design patterns book", description:"Chapter 5: Observer Pattern",   folderId:"study",    priority:"important",        kanbanStatus:"backlog",     dueDate:new Date(Date.now()+604800000).toISOString().split("T")[0],  dueTime:"20:00", isScheduled:true,  repeatType:"weekly",  repeatDay:"monday", reminderBefore:30, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"6", title:"Morning run",               description:"5km steady pace",               folderId:"personal", priority:"important",        kanbanStatus:"backlog",     dueDate:new Date().toISOString().split("T")[0],                       dueTime:"06:30", isScheduled:true,  repeatType:"daily",   reminderBefore:10, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"7", title:"Monthly budget review",     description:"Track spending vs goals",       folderId:"personal", priority:"urgent-important", kanbanStatus:"backlog",     dueDate:new Date(Date.now()+432000000).toISOString().split("T")[0],  dueTime:"",      isScheduled:true,  repeatType:"monthly", repeatDate:1,       reminderBefore:60, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"8", title:"Weekly team sync",          description:"Friday standup + planning",     folderId:"work",     priority:"urgent",           kanbanStatus:"backlog",     dueDate:new Date(Date.now()+86400000).toISOString().split("T")[0],   dueTime:"10:00", isScheduled:true,  repeatType:"weekly",  repeatDay:"friday", reminderBefore:15, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"9", title:"Flashcard review",          description:"Anki deck — 30 min",           folderId:"study",    priority:"urgent-important", kanbanStatus:"backlog",     dueDate:new Date().toISOString().split("T")[0],                       dueTime:"21:00", isScheduled:true,  repeatType:"daily",   reminderBefore:15, completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  { id:"10",title:"Plan team outing",          description:"Book venue for next month",     folderId:"personal", priority:"low",              kanbanStatus:"backlog",     dueDate:new Date(Date.now()+2592000000).toISOString().split("T")[0], dueTime:"",      isScheduled:false, repeatType:null,      reminderBefore:0,  completed:false, cancelled:false, completedAt:null, createdAt:new Date().toISOString() },
  ...HISTORY_TASKS,
];

export const genId = () => {
  let taskIdCounter = 2000;
  return () => `t${++taskIdCounter}`;
};
