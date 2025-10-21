import { useState, useContext } from "react";
import useSWR from "swr";
import api from "../api/axios";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthProvider";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  TrashIcon,
  LockClosedIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// ✅ SWR Fetcher function
const fetcher = (url) => api.get(url).then((res) => res.data);

const UserProfile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ SWR replaces useEffect-based fetching
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/auth/profile/", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profile_picture: null,
  });

  // When profile data loads, set form defaults
  if (user && !formData.first_name && !formData.last_name) {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
      profile_picture: null,
    });
  }

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load profile.
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-500 py-20">Loading profile...</div>
    );

  // ✅ Update Profile
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
      toast.info("Demo mode: This action is disabled.");
      return;
      // const res = await api.patch("/auth/profile/", data);
      // mutate(res.data, false); // Optimistic update
      // setIsUpdateOpen(false);
      // toast.success("Profile updated successfully!");
    } catch {
      toast.error("Profile update failed.");
    }
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    try {
      toast.info("Demo mode: This action is disabled.");
      return;
      // await api.delete("/auth/profile/");
      // toast.success("Account deleted.");
      // logout();
      // navigate("/");
    } catch {
      toast.error("Account deletion failed.");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  // ✅ Change Password
  const handleChangePassword = () => navigate("/change-password");

  return (
    <div className="pb-10">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 transition-all">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={
              user.profile_picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${user.first_name} ${user.last_name}`
              )}`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
            <UserIcon className="w-6 h-6 text-blue-600" />
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500 flex justify-center md:justify-start items-center gap-2 mt-1">
            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
            {user.email}
          </p>
          {user.phone && (
            <p className="text-gray-500 flex justify-center md:justify-start items-center gap-2 mt-1">
              <PhoneIcon className="w-4 h-4 text-gray-400" /> {user.phone}
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button
              onClick={() => setIsUpdateOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Update Profile
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>
        {/* Manage Addresses Button */}
      <div className="mt-8 flex justify-center md:justify-start">
        <Link
          to="/manage-addresses"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          <MapPinIcon className="w-5 h-5" />
          Manage Addresses
        </Link>
      </div>
      </div>


      {/* Update Modal */}
      <Dialog open={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
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
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-100 border rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              Settings
            </Dialog.Title>
            <button
              onClick={handleChangePassword}
              className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <LockClosedIcon className="w-5 h-5 text-gray-500" />
              Change Password
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="w-full text-left px-4 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
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

      {/* Delete Confirm Modal */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
              >
                <TrashIcon className="w-5 h-5" />
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
