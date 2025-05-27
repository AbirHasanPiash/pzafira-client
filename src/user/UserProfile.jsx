import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthProvider";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profile_picture: null,
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((res) => {
        setUser(res.data);
        setFormData({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone || "",
          profile_picture: null,
        });
      })
      .catch(() => toast.error("Failed to load user profile"));
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("phone", formData.phone);
    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      const res = await api.patch("/auth/profile/", data);
      setUser(res.data);
      console.log(res.data);
      setIsUpdateOpen(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Profile update failed.");
    }
  };

  const confirmDeleteAccount = () => setIsDeleteConfirmOpen(true);

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/profile/");
      toast.success("Account deleted.");
      logout();
      navigate("/");
    } catch {
      toast.error("Account deletion failed.");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  if (!user)
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-6 sm:p-10">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
        <div className="relative group">
          <img
            src={
              user.profile_picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.first_name + " " + user.last_name
              )}`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          {user.phone && <p className="text-gray-500">📞 {user.phone}</p>}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Dialog
        open={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">
              Update Profile
            </Dialog.Title>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="First Name"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-100 border rounded px-3 py-2 cursor-not-allowed"
              />
              <input
                type="file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile_picture: e.target.files[0],
                  })
                }
                className="w-full"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Settings Modal */}
      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              Settings
            </Dialog.Title>
            <button
              onClick={handleChangePassword}
              className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50"
            >
              Change Password
            </button>
            <button
              onClick={confirmDeleteAccount}
              className="w-full text-left px-4 py-2 border border-red-400 text-red-600 rounded hover:bg-red-50"
            >
              Delete Account
            </button>
            <div className="text-center pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="mt-8">
        <Link
          to="/manage-addresses"
          className="mt-4 md:mt-0 bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Manage Addresses
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
