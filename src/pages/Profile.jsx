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

  if (loading) return <p className="text-center text-gray-700 text-xl mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h2>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Card */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-5 h-5 text-gray-500 mr-2" />
              <label className="text-gray-700 font-medium">Name</label>
            </div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleUpdateName}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
            >
              Update Name
            </button>
          </div>

          {/* Email Card */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              <UserCircle2 className="w-5 h-5 text-gray-500 mr-2" />
              <label className="text-gray-700 font-medium">Email</label>
            </div>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>
        </div>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-500" /> Change Password
          </h3>
          <div className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-md transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
