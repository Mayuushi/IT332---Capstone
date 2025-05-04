import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h2>Welcome {currentUser?.name}</h2>
      {currentUser?.isTeacher ? (
        <div>
          <p>This is the teacher's dashboard</p>
          {/* Teacher-specific UI */}
        </div>
      ) : (
        <div>
          <p>This is the student's dashboard</p>
          {/* Student-specific UI */}
        </div>
      )}
    </div>
  );
};
