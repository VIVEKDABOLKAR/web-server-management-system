import Signup from "../auth/signUp/Signup";

export const AdminAddUser = () => {
    return    <Signup
      title="Add User"
      subtitle=""
      showLoginLink={false}
      buttonText="Create User"
    />;
}