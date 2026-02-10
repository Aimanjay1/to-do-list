// Define the Header component
function Header() {
  // Return the JSX structure for the header
  return (
    // Header container with flex layout, padding, background color, and margin
    <header className="flex items-center justify-start p-4 bg-yellow-500 text-white mb-8">
      {/* Main title of the application */}
      <h1 className="text-3xl font-bold">To-Do List</h1>
      {/* Navigation container with left margin */}
      {/* <nav className="flex ml-10"> */}
        {/* Unordered list for navigation links with spacing */}
        {/* <ul className="flex space-x-4"> */}
          {/* Navigation item: Home */}
          {/* <li>
            <a href="#">Home</a>
          </li> */}
          {/* Navigation item: My Tasks */}
          {/* <li>
            <a href="#">My Tasks</a>
          </li> */}
          {/* Navigation item: Settings */}
          {/* <li>
            <a href="#">Settings</a>
          </li> */}
          {/* Navigation item: Profile */}
          {/* <li>
            <a href="#">Profile</a>
          </li> */}
        {/* </ul>
      </nav> */}
    </header>
  );
}

// Export the Header component for use in other parts of the app
export default Header;
