function Navbar(){
  return(
 <nav className="flex items-center justify-between bg-gray-700 p-4 text-white">
  <h1 className="text-2xl font-bold">My Website</h1>
  <div className="flex gap-6">
    <a href="#" className="hover:text-blue-400">Home</a>
    <a href="#" className="hover:text-blue-400">About Us</a>
    <a href="#" className="hover:text-blue-400">Contact</a>
  </div>
 </nav>
  );
}
export default Navbar;