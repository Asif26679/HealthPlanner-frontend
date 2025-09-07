import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // axios instance with baseURL + token
import { UserCircle2, Lock } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me"); // ✅ fetch profile
        setProfile({ name: data.user.name, email: data.user.email });
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
    return <p className="text-center text-white text-xl mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="bg-gray-900 shadow-xl rounded-3xl w-full max-w-2xl p-8">
        <h2 className="text-3xl text-white font-bold mb-8 text-center">My Profile</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-6 h-6 text-indigo-400 mr-2" />
              <label className="text-gray-300 font-semibold">Name</label>
            </div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={handleUpdateName}
              className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Update Name
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-6 h-6 text-indigo-400 mr-2" />
              <label className="text-gray-300 font-semibold">Email</label>
            </div>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="mt-10 bg-gray-800 p-6 rounded-2xl shadow-inner hover:shadow-lg transition duration-300"
        >
          <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-indigo-400" /> Change Password
          </h3>
          <div className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
 
