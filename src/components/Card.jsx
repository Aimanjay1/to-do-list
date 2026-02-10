// Import useState hook from React (though unused in this component, it's imported)
import { useState } from "react";

// Card component receiving 'text' prop to display content
function Card({ text, datetime }) {
  // Render the card structure
  return (
    // Container div with styling: amber background, padding, full width, rounded corners, shadow
    <div className="bg-amber-300 p-6 w-full rounded-lg shadow-md">
      {/* Display the text prop as a heading */}
      <h2>{text}</h2>
      {/* Display the current date */}
      <p className="font-bold">Date: {datetime}</p>
      {/* Display the current time */}
      <p className="font-bold">Time: {datetime}</p>
    </div>
  );
}
// Export the Card component for use in other parts of the app
export default Card;
