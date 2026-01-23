// Define the Footer component
function Footer() {
  // Return the JSX structure for the footer
  return (
    // Footer container with top margin and centered text
    <footer className="mt-8 text-center">
      {/* Copyright text with current year */}
      <p className="p-6">&copy; {new Date().getFullYear()} To-do List</p>
      {/* Pro tip section with lighter text color and small font size */}
      <p className="text-gray-600 text-sm">
        {/* Pro tip content with an emoji and bold label */}
        💡 <span className="font-semibold">Pro tip:</span> Press Enter to
        quickly add tasks
      </p>
    </footer>
  );
}
// Export the Footer component for use in other parts of the app
export default Footer;
