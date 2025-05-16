const Navbar = () => {
    return (
          <nav className="flex items-center">
                {/* Example Nav Links */}
                { <a href="/about" className="ml-6 text-gray-700 dark:text-gray-300 hover:text-blue-600">About</a> }
                { <a href="/contact" className="ml-6 text-gray-700 dark:text-gray-300 hover:text-blue-600">Contact</a> }
            </nav>      
            
          );
}
 
export default Navbar;
