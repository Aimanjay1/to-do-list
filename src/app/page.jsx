"use client"; // Required for useState and localStorage

// Import necessary hooks and components from React
import React, { useState, useEffect } from "react";
// Import AddTask component
import AddTask from "@/components/AddTask";
// Import Header component
import Header from "@/components/Header";
// Import TasksList component
import TasksList from "@/components/TasksList";
// Import Footer component
import Footer from "@/components/Footer";

// Main App component
export default function App() {
  // State for the input value of the new task
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  // State for the list of tasks, initialized from localStorage
  const [tasks, setTasks] = useState([]);

  // Effect to save tasks to localStorage whenever the 'tasks' state changes
  // Load from local storage ONCE when component mounts
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(
        parsed.map((t) => ({
          ...t,
          status: t.status || (t.completed ? "done" : "todo"),
        })),
      );
    }
  }, []);

  // Save to local storage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      // Optional: prevent overwriting with empty array on initial load if you prefer
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Function to add a new task
  function addTask() {
    // Trim whitespace from the input value
    const text = inputValue.trim();
    // If input is empty, do nothing
    if (!text || !dueDate) return;
    // Create specific new task object
    const [datePart, timePart] = dueDate.split("T");
    const newTask = {
      id: Date.now(), // Generate unique ID based on timestamp
      text: text, // Task description
      date: datePart,
      time: timePart, 
      status: "todo", // Default status is 'todo'
    };
    // Update tasks state by appending the new task to the previous list
    setTasks((prev) => [...prev, newTask]);
    // Clear the input field
    setInputValue("");
    setDueDate("");
  }

  // Function to delete a task by ID
  function deleteTask(id) {
    // Update tasks state by filtering out the task with the given ID
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  // Function to update the status of a task (e.g., drag and drop)
  function updateTaskStatus(id, newStatus) {
    // Update tasks state by mapping over the list
    setTasks((prev) =>
      prev.map((task) =>
        // If task ID matches, update its status; otherwise, keep it as is
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }

  // Return the JSX structure for the App component
  return (
    <>
      {/* Main container with full height, gradient background, and padding */}
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 p-8">
        {/* Centered container with max width */}
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* Widened container for 3 columns */}
          {/* Render Header component */}
          <Header />
          {/* Render AddTask component with necessary props */}
          <AddTask
            onAddTask={addTask}
            inputValue={inputValue}
            setInputValue={setInputValue}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />
          {/* Render TasksList component with tasks and handler functions */}
          <TasksList
            tasks={tasks}
            deleteTask={deleteTask}
            updateTaskStatus={updateTaskStatus} // Pass the new function
          />
          {/* Render Footer component */}
          <Footer />
        </div>
      </div>
    </>
  );
}
