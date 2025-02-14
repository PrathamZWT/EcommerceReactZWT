import React, { useEffect, useState } from "react";

export default function Users() {
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_USERS_API}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);

        setProfileData(jsonData.users);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfileData();
  }, []);
  console.log(profileData);

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="font-semibold text-gray-700">User Accounts</h2>
          <span className="text-xs text-gray-500">
            View accounts of registered users
          </span>
        </div>
      </div>
      <div className="overflow-y-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-amber-500 text-left text-xs font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">First Name</th>
                <th className="px-5 py-3">Last Name </th>
                <th className="px-5 py-3">User Role</th>
                <th className="px-5 py-3">Created at</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {profileData.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">{user.id}</p>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="whitespace-no-wrap">{user.first_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="whitespace-no-wrap">{user.last_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">{user.role}</p>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">{user.createdAt}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
