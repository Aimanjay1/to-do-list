// Import Card component
import Card from "./Card";

// Panel component definition
function Panel() {
  // Return the JSX structure for the panel
  return (
    // Main container with flex column layout, specific width, and padding
    <div className="flex flex-col w-1/6 p-4">
      {/* Upper section container with vertical gap and margin */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Row for Panel title and placeholders (A, B, C) */}
        <div className="flex justify-between">
          <h2>Panel</h2>
          <p>A</p>
          <p>B</p>
          <p>C</p>
        </div>
        {/* Row for Items Count and placeholders (D, E, F) */}
        <div className="flex justify-between">
          <h2>Items Count</h2>
          <p>D</p>
          <p>E</p>
          <p>F</p>
        </div>
      </div>
      {/* Separator container with bottom margin */}
      <div className="mb-4">
        {/* Horizontal rule line */}
        <hr />
      </div>
      {/* Render the Card component inside the panel */}
      <Card />
    </div>
  );
}
// Export the Panel component
export default Panel;
