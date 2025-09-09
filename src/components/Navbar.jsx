import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  User,
  Droplets,
  LayoutDashboard,
  Salad,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar state
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: <User className="w-5 h-5 text-yellow-400" /> },
    { name: "Plans", path: "/plans", icon: <LayoutDashboard className="w-5 h-5 text-green-400" /> },
    { name: "Workouts", path: "/workouts", icon: <Dumbbell className="w-5 h-5 text-blue-400" /> },
    { name: "About", path: "/about", icon: <Droplets className="w-5 h-5 text-blue-300" /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false); // Close sidebar on logout
  };

  const handleLinkClick = () => setIsOpen(false); // Close sidebar on any link click

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-900/90 border-b shadow-sm backdrop-blur-md"
          : "bg-transparent border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between px-4 transition-all duration-300 ${
          scrolled ? "max-w-6xl h-14" : "max-w-7xl h-20"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_35px_rgba(16,185,129,1)]"
        >
          <img src={logo} alt="Health Planner Logo" className="h-28 w-auto md:h-32 lg:h-36" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative text-white font-medium group"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {user ? (
            <div className="relative group">
              <Button variant="ghost" className="flex items-center gap-2 text-white cursor-pointer">
                <User className="w-5 h-5 text-green-400" /> {`Welcome, ${user.name}`}
              </Button>
              <div className="absolute right-0 mt-2 w-60 bg-neutral-900 text-white rounded-xl shadow-lg opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50">
                <div className="flex flex-col gap-2 p-4">
                  <p className="flex items-center gap-2 text-lg font-medium border-b border-neutral-800 pb-2">
                    <User className="w-5 h-5 text-green-400" /> {user.name}
                  </p>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <LayoutDashboard className="w-4 h-4 text-green-400" /> Dashboard
                  </Link>
                  <Link to="/diet" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <Salad className="w-4 h-4 text-green-400" /> Diet Plans
                  </Link>
                  <Link to="/workout" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <Dumbbell className="w-4 h-4 text-blue-400" /> Workouts
                  </Link>
                  <Link to="/water" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <Droplets className="w-4 h-4 text-blue-400" /> Water Intake
                  </Link>
                  <Button onClick={handleLogout} className="mt-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-200">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="p-6 bg-neutral-900 dark:bg-neutral-950 rounded-l-3xl shadow-2xl overflow-y-auto"
            >
              <nav className="flex flex-col gap-6 mt-4">
                {/* Close Icon */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-200 hover:text-green-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <Menu className="h-6 w-6 rotate-45" />
                  </Button>
                </div>

                {/* Nav Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-800 hover:bg-green-700 text-white font-medium transition-all"
                    onClick={handleLinkClick}
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}

                {/* Authenticated User */}
                {user && (
                  <div className="mt-4 border-t border-neutral-700 pt-4 space-y-3">
                    <p className="flex items-center gap-2 text-lg font-semibold text-white">
                      <User className="w-5 h-5 text-green-400" /> {user.name}
                    </p>
                    <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition">
                      <LayoutDashboard className="w-5 h-5 text-white" /> Dashboard
                    </Link>
                    <Link to="/diet" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition">
                      <Salad className="w-5 h-5 text-white" /> Diet Plans
                    </Link>
                    <Link to="/workout" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition">
                      <Dumbbell className="w-5 h-5 text-white" /> Workouts
                    </Link>
                    <Link to="/water" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition">
                      <Droplets className="w-5 h-5 text-white" /> Water Intake
                    </Link>
                    <Button onClick={handleLogout} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition font-semibold">
                      <LogOut className="w-5 h-5" /> Logout
                    </Button>
                  </div>
                )}

                {!user && (
                  <Button asChild className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition font-semibold">
                    <Link to="/login" onClick={handleLinkClick}>
                      Login
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

