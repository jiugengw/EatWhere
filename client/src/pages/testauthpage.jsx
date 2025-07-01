import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../shared/hooks/useAxiosPrivate";

const UserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const [userData, setUserData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/users/me");
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setErr("Could not fetch user data.");
      }
    };

    getUser();
  }, [axiosPrivate]);

  return (
    <section>
      <h1>User Profile</h1>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.data.User.username}</p>
          <p><strong>Email:</strong> {userData.data.User.email}</p>
          <p>Obtained from: http://localhost:8080/api/users/me</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
};

export default UserProfile;
