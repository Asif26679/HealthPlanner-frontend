import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { UserCircle2, Lock } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        setProfile({ name: data.name, email: data.email });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdateName = async () => {
    try {
      await api.put("/users/profile", { name: profile.name });
      alert("Name updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update name");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    try {
      await api.put("/users/password", { currentPassword, newPassword });
      alert("Password updated successfully");
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading)
    return <p className="text-center text-white text-xl mt-20 animate-pulse">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="bg-gray-900 shadow-2xl rounded-3xl w-full max-w-3xl p-10 border border-gray-800">
        <h2 className="text-4xl text-white font-extrabold mb-10 text-center tracking-wide">
          My Profile
        </h2>

        {error && <p className="text-red-500 text-center mb-6 font-medium">{error}</p>}

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 border border-gray-700">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-6 h-6 text-indigo-400 mr-3" />
              <label className="text-gray-300 font-semibold">Name</label>
            </div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
            />
            <button
              onClick={handleUpdateName}
              className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-600/50"
            >
              Update Name
            </button>
          </div>

          {/* Email */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 border border-gray-700">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-6 h-6 text-indigo-400 mr-3" />
              <label className="text-gray-300 font-semibold">Email</label>
            </div>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-5 py-3 rounded-xl bg-gray-700 text-gray-300 cursor-not-allowed border border-gray-600"
            />
          </div>
        </div>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="mt-12 bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-red-500/50 transition-all border border-gray-700"
        >
          <h3 className="text-2xl text-white font-semibold mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-red-400" /> Change Password
          </h3>
          <div className="space-y-5">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-red-600/50"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

