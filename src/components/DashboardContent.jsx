import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User, Utensils, Flame,  Download, ChevronDown, ChevronUp } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import { exportDietPDF } from "../utils/exportDiet";
import StatsCard from "./StatsCard";
import DietCard from "./DietCard";

export default function Dashboard() {
  const [diets, setDiets] = useState([]);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [dietSectionOpen, setDietSectionOpen] = useState(true);
  const [userSectionOpen, setUserSectionOpen] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const sidebarRef = useRef(null);

  // Fetch diets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDiet(true);
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/diets", { headers: { Authorization: `Bearer ${token}` } });
        setDiets(res.data || []);
      } catch (err) {
        console.error(err);
      } finally{
        setLoadingDiet(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Generate new diet
  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    if (!age || !weight || !height || !activityLevel) return alert("Please fill all fields");
    setLoadingDiet(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      for (let d of diets) {
        await api.delete(`/diets/${d._id}`, { headers: { Authorization: `Bearer ${token}` } });
      }

      const res = await api.post("/diets/generate", { age: Number(age), weight: Number(weight), height: Number(height), gender, activityLevel }, { headers: { Authorization: `Bearer ${token}` } });

      setDiets([res.data]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error generating diet");
    } finally {
      setLoadingDiet(false);
    }
  };

  const handleDeleteDiet = async (id) => {
    if (!window.confirm("Delete this diet?")) return;
  
    try {
      // Optional: check if diet exists in frontend state
      const dietExists = diets.find((d) => d._id === id);
      if (!dietExists) {
        alert("Diet not found or already deleted.");
        return;
      }
  
      await api.delete(`/diets/${id}`);
      setDiets(diets.filter((d) => d._id !== id));
      alert("Diet deleted successfully.");
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Diet not found on server.");
        setDiets(diets.filter((d) => d._id !== id)); // remove from state anyway
      } else {
        console.error(err);
        alert(err.response?.data?.message || "Failed to delete diet.");
      }
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-20 relative">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div
  ref={sidebarRef}
  className={`fixed md:sticky top-0 left-0 h-screen w-64 
    bg-gray-900/70 backdrop-blur-xl border-r border-gray-700/60 
    shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 transition-transform duration-300 z-50 
    flex flex-col justify-between`}
>
  <div className="flex-1 flex flex-col px-6 py-6 space-y-6 overflow-y-auto">
    {/* Logo / Title */}
    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-4">
      Health Planner
    </h2>

    {/* Nav Section */}
    <div className="space-y-3">
      <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
        bg-gray-800/60 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-400/10 
        transition-all">
        <Utensils size={20} className="text-green-400" />
        <span>Generate Diet</span>
      </button>

      <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
        bg-gray-800/60 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-400/10 
        transition-all">
        <User size={20} className="text-blue-400" />
        <span>User Info</span>
      </button>
    </div>

    {/* Divider */}
    <div className="border-t border-gray-700/50 my-4" />

    {/* Logout */}
    <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
      bg-red-600/90 hover:bg-red-700 transition-all text-white shadow-lg">
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-4 p-2 bg-gray-800 rounded-lg shadow">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>

        <h1 className="text-3xl font-bold mb-8">👋 Hello, <span className="text-green-400">{user?.name || "User"}</span></h1>

        {/* Stats */}
        {loadingDiet ? (
  <div className="grid md:grid-cols-3 gap-6 mb-8">
    {Array(3).fill().map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : (
  diets.length > 0 && (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Calories"
        value={`${diets[0]?.totalCalories || 0} kcal`}
        icon={Flame}
        gradient="bg-gradient-to-r from-orange-500 to-yellow-400"
      />
      <StatsCard
        title="Download Report"
        icon={Download}
        gradient="bg-gradient-to-r from-gray-600 to-gray-800"
        className="text-white"
        onClick={() => exportDietPDF(diets[0],user)}  
      />
    </div>
  )
)}

        {/* Diet List */}
        <div className="grid md:grid-cols-2 gap-6">
  {loadingDiet ? (
    Array(2).fill().map((_, i) => <SkeletonCard key={i} />)
  ) : diets.length === 0 ? (
    <div className="col-span-full text-center text-gray-400">
      No diets yet. Use the form on the left to generate a diet!
    </div>
  ) : (
    diets.map((diet) => (
      <DietCard key={diet._id} diet={diet} handleDeleteDiet={handleDeleteDiet} />
    ))
  )}
</div>
      </div>
    </div>
  );
}







