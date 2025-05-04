import React from "react";
import { useNavigate } from "react-router-dom";

const AuthSelector = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Select User Type</h2>
      <button onClick={() => navigate("/register/teacher")}>Teacher</button>
      <button onClick={() => navigate("/register/student")}>Student</button>
    </div>
  );
};

export default AuthSelector;
