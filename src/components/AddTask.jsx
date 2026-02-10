// Import necessary React library
import React from "react";
// Import the Plus icon from the lucide-react library
import { Plus } from "lucide-react";

// Define the AddTask component that accepts onAddTask, inputValue, and setInputValue as props
export default function AddTask({ onAddTask, inputValue, setInputValue }) {
  // Return the JSX structure for the component
  return (
    // React Fragment to group children without adding extra nodes to the DOM
    <>
      {/* Container div with gradient background, rounded corners, padding, margin, and shadow */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-8 mb-8 shadow-lg">
        {/* Heading for the add task section with white text and bold font */}
        <h2 className="text-2xl font-bold text-white mb-6">Add new task.</h2>
        {/* Flex container to align input and button, responsive (column on mobile, row on small screens) */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Input field for typing the new task */}
          <input
            // Specify input type as text
            type="text"
            // Aria label for accessibility
            aria-label="New task"
            // Placeholder text to guide the user
            placeholder="What do you need to do today?"
            // Bind the input value to the inputValue state
            value={inputValue}
            // Update the inputValue state whenever the user types
            onChange={(e) => setInputValue(e.target.value)}
            // Trigger the onAddTask function when the "Enter" key is pressed
            onKeyDown={(e) => e.key === "Enter" && onAddTask()}
            // Styling for the input: flexible width, padding, rounded corners, text size, and focus states
            className="flex-1 px-6 py-4 rounded-2xl text-lg bg-amber-50 focus:outline-none focus:ring-4 focus:ring-orange-300"
          />
          {/* Button to submit the new task */}
          <button
            // Aria label for accessibility
            aria-label="Add task"
            // Trigger the onAddTask function when clicked
            onClick={onAddTask}
            // Styling for the button: white background, orange text, padding, rounded corners, hover effect, flex layout
            className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-md"
          >
            {/* Plus icon from lucide-react with specific size */}
            <Plus size={20}>Add</Plus>
          </button>
        </div>
      </div>
    </>
  );
}
