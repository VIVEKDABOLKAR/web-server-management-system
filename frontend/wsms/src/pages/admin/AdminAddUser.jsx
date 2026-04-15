import Signup from "../auth/signUp/Signup";

const AdminAddUser = () => {
  return (
    <Signup
      title="Add User"
      subtitle=""
      showLoginLink={false}
      buttonText="Create User"
    />
  );
};

export default AdminAddUser;
