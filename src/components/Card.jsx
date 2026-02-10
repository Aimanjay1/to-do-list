// Import useState hook from React (though unused in this component, it's imported)
import { useState } from "react";

// Card component receiving 'text' prop to display content
function Card({ text, date, time }) {
  // Render the card structure
  return (
    <div className="bg-amber-300 p-6 w-full rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{text}</h2>
      {/* Display the divided date and time */}
      <div className="text-sm">
        <p><span className="font-bold">Date:</span> {date}</p>
        <p><span className="font-bold">Time:</span> {time}</p>
      </div>
    </div>
  );
}
// Export the Card component for use in other parts of the app
export default Card;
