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
      <div ref={sidebarRef} className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-800/80 backdrop-blur-md shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col justify-between`}>
        <div className="overflow-y-auto flex-1 flex flex-col justify-between">
          {/* Generate Diet Section */}
          <div className="px-6 mt-6">
            <button className="w-full flex justify-between items-center mb-2 text-green-400 font-semibold" onClick={() => setDietSectionOpen(!dietSectionOpen)}>
              Generate Daily Diet {dietSectionOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {dietSectionOpen && (
              <form onSubmit={handleGenerateDiet} className="space-y-3">
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
                <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
                <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly">Lightly Active</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very">Very Active</option>
                </select>
                <button type="submit" disabled={loadingDiet} className="bg-gradient-to-r from-green-400 to-green-600 w-full py-2 rounded-lg font-semibold shadow-lg hover:from-green-500 hover:to-green-700 transition flex justify-center items-center gap-2">
                  {loadingDiet ? "Generating..." : "Generate"}
                </button>
              </form>
            )}
          </div>

          {/* User Section */}
          <div className="px-6 mt-6 border-t border-gray-700 pt-4">
            <button className="w-full flex justify-between items-center mb-2 text-blue-400 font-semibold" onClick={() => setUserSectionOpen(!userSectionOpen)}>
              User Info {userSectionOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {userSectionOpen && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-gray-300" /> <span className="font-semibold">{user?.name || "User"}</span>
                </div>
                <Link to="/profile" className="flex items-center gap-2 mb-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg w-full justify-center transition">Edit Profile</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg w-full justify-center transition"><LogOut size={18} /> Logout</button>
              </div>
            )}
          </div>
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
      {/* <StatsCard
        title="Meals"
        value={diets[0]?.meals?.length || 0}
        icon={Utensils}
        gradient="bg-gradient-to-r from-green-400 to-green-600"
      /> */}
      <StatsCard
        title="Export Report"
        icon={Download}
        gradient="bg-gradient-to-r from-gray-600 to-gray-800"
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







