// Import Trash2 icon from lucide-react library
import { Trash2 } from "lucide-react";
// Import Card component
import Card from "./Card";

// TasksList component definition matching prop types
export default function TasksList({ tasks, deleteTask, updateTaskStatus }) {
  // Filter tasks into three categories: 'todo', 'doing', and 'done'
  const todos = tasks.filter((t) => t.status === "todo");
  const doing = tasks.filter((t) => t.status === "doing");
  const done = tasks.filter((t) => t.status === "done");

  // 1. Triggered when you start dragging a card
  const handleDragStart = (e, id) => {
    // Set the task ID in the drag data
    e.dataTransfer.setData("taskId", id);
  };

  // 2. Triggered when you drag OVER a column (required to allow dropping)
  const handleDragOver = (e) => {
    // Prevent default behavior to allow drop
    e.preventDefault();
  };

  // 3. Triggered when you drop a card into a column
  const handleDrop = (e, status) => {
    // Get the task ID from the drag data
    const id = e.dataTransfer.getData("taskId");
    // Update the status of the dragged task
    updateTaskStatus(Number(id), status);
  };

  // Helper component to render a single column of tasks
  const TaskColumn = ({ title, list, status, bgClass, headerColor }) => (
    // Column container with flex property, styling, and drop event handlers
    <div
      className={`flex-1 rounded-3xl p-6 shadow-lg min-h-[400px] ${bgClass}`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      {/* Column title with dynamic color */}
      <h2 className={`text-xl font-bold mb-6 ${headerColor}`}>{title}</h2>
      {/* Container for the list of tasks */}
      <div className="flex flex-col gap-4">
        {/* Map through the list of tasks and render each one */}
        {list.map((task) => (
          // Task item container with drag events and styling
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="relative group cursor-move hover:scale-[1.02] transition-transform"
          >
            {/* Render the Card component with task text */}
            <Card text={task.text} />

            {/* Delete Button (visible on hover) */}
            <button
              onClick={() => deleteTask(task.id)}
              className="absolute top-2 right-2 bg-red-100 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {/* Trash icon for delete action */}
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {/* Display message if the list is empty */}
        {list.length === 0 && (
          <div className="text-gray-400 text-center mt-10 text-sm border-2 border-dashed border-gray-200 rounded-xl p-4">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );

  // Return the main TasksList structure
  return (
    // Container for columns with responsive flex layout
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* 1. MY TASKS COLUMN */}
      <TaskColumn
        title="My Tasks"
        list={todos}
        status="todo"
        bgClass="bg-white"
        headerColor="text-gray-800"
      />

      {/* 2. ON GOING COLUMN */}
      <TaskColumn
        title="On Going"
        list={doing}
        status="doing"
        bgClass="bg-blue-50"
        headerColor="text-blue-800"
      />

      {/* 3. COMPLETED COLUMN */}
      <TaskColumn
        title="Completed"
        list={done}
        status="done"
        bgClass="bg-green-50"
        headerColor="text-green-800"
      />
    </div>
  );
}