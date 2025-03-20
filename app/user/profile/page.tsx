"use client";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { format } from "date-fns";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface User {
  id: number;
  credential_id: string;
  f_name: string;
  l_name: string;
  phone_number: string;
  email: string;
  tier_rank: number;
  address: string;
}

export default function Profile() {
  const [userID, setUserID] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = format(new Date(), "EEE, dd MMMM yyyy");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || null);
      if (user.id) fetchUser(user.id);
    }
  }, []);


  const fetchUser = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/users/${id}`);
      const data = await response.json();
      setUser(data);
      setEditableUser(data); // Set editable user data
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const togglePasswordVisibility = (type: string) => {
    if (type === "old") {
      setShowOldPassword(!showOldPassword);
    } else if (type === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (type === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableUser) return;
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const validateInput = () => {
    if (!editableUser) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบอีเมล
    const phoneRegex = /^[0-9]{10}$/; // ตรวจสอบเบอร์โทร (10 ตัวเลข)

    if (
      !editableUser.f_name.trim() ||
      !editableUser.l_name.trim() ||
      !editableUser.email.trim() ||
      !editableUser.phone_number.trim() ||
      !editableUser.address.trim()
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    if (!emailRegex.test(editableUser.email)) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง");
      return false;
    }

    if (!phoneRegex.test(editableUser.phone_number)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (10 ตัวเลข)");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!editableUser) return;

    if (!validateInput()) {
      return;
    }
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );

    if (!isConfirmed) {
      // If the user cancels, exit early
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/users/${editableUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            f_name: editableUser.f_name,
            l_name: editableUser.l_name,
            phone_number: editableUser.phone_number,
            email: editableUser.email,
            address: editableUser.address,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      console.log(user?.email, oldPassword, newPassword)
      if (response.ok) {
        alert("Password changed successfully!");
        setIsChangePasswordOpen(false); // Close the modal after successful change
        setConfirmPassword("");
        setOldPassword("")
        setNewPassword("")
      } else {
        const data = await response.json();
        alert(data.error || "Error changing password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="flex flex-col mx-5 sm:mx-10 md:mx-20 my-10 border bg-white shadow-lg rounded-lg max-w-full overflow-hidden">
        <div className="p-5 space-y-3 bg-neutral-300">
          <p className="text-2xl">
            <b>Welcome, {user?.f_name}</b>
          </p>
          <p className="opacity-50">{formattedDate}</p>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <FaUserCircle size={72} />
              <div className="flex flex-col space-y-1 items-start">
                <p>
                  {user?.f_name} {user?.l_name}
                </p>
                <p className="opacity-70 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="h-fit w-fit px-4 py-2 mt-2 sm:mt-0 rounded-lg bg-black text-white"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row py-5 space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex flex-col w-full space-y-2">
                <label>Firstname</label>
                <input
                  type="text"
                  name="f_name"
                  value={isEditing ? editableUser?.f_name : user?.f_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col w-full space-y-2">
                <label>Lastname</label>
                <input
                  type="text"
                  name="l_name"
                  value={isEditing ? editableUser?.l_name : user?.l_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  value={
                    isEditing ? editableUser?.phone_number : user?.phone_number
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>User Tier</label>
                <input
                  type="text"
                  name="tier_rank"
                  value={user?.tier_rank}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex flex-col space-y-2">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={isEditing ? editableUser?.email : user?.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Address</label>
                <textarea
                  name="address"
                  value={isEditing ? editableUser?.address : user?.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="px-1 py-2 bg-neutral-200 rounded-md w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row py-5 justify-between">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-200 text-red-600 hover:bg-red-600 hover:text-white  rounded-lg"
            >
              Logout
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-black text-white border border-black rounded-lg hover:bg-white hover:text-black"
            >
              Change Password
            </button>
          </div>

          {isChangePasswordOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-96 p-6">
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label>Old Password</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="px-4 py-2 bg-neutral-200 rounded-md w-full"
                      />
                      <span
                        onClick={() => togglePasswordVisibility("old")}
                        className="absolute right-2 top-2 cursor-pointer"
                      >
                        {showOldPassword ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label>New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-4 py-2 bg-neutral-200 rounded-md w-full"
                      />
                      <span
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-2 top-2 cursor-pointer"
                      >
                        {showNewPassword ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label>Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="px-4 py-2 bg-neutral-200 rounded-md w-full"
                      />
                      <span
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-2 top-2 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4 justify-end mt-4">
                    <button
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePasswordSubmit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
