import { useEffect, useState } from "react";

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState([]); // Change initial state to `null`

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_USERS_API}/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);

        setProfileData(jsonData.user || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfileData();
  }, []);
  const [formData, setFormData] = useState({
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: profileData.email,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_USERS_API}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        console.error("Update failed:", responseData);
        alert(responseData.message || "Update failed");
      }
    } catch (err) {
      console.error("Error during profile update:", err);
      alert("An error occurred, please try again later.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-10 mx-auto my-20 bg-amber-100 shadow-lg rounded-2xl max-w-lg w-full relative">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Profile</h1>

      {profileData ? (
        <div className="w-full flex flex-col items-start gap-3">
          <p className="text-lg font-semibold text-gray-800">
            First Name:{" "}
            <span className="text-amber-600 font-medium">
              {profileData.first_name || "N/A"}
            </span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Last Name:{" "}
            <span className="text-amber-600 font-medium">
              {profileData.last_name || "N/A"}
            </span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Role:{" "}
            <span className="text-amber-600 font-medium">
              {profileData.role || "N/A"}
            </span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Email:{" "}
            <span className="text-amber-600 font-medium">
              {profileData.email || "N/A"}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer absolute bottom-5 right-5 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="white"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              Edit Profile
            </h2>
            <input
              type="text"
              placeholder={`First-Name : ${profileData?.first_name || ""}`}
              defaultValue={profileData?.first_name}
              onChange={handleChange}
              id="first_name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder={`Last-Name : ${profileData?.last_name || ""}`}
              defaultValue={profileData?.last_name}
              onChange={handleChange}
              id="last_name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="email"
              placeholder={`Email : ${profileData?.email || ""}`}
              defaultValue={profileData?.email}
              onChange={handleChange}
              id="email"
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
