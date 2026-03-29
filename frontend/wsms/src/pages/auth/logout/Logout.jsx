import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";

const Logout = () => {
	const navigate = useNavigate();
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		localStorage.removeItem("token");
		setShowToast(true);
		const timer = setTimeout(() => {
			navigate("/login");
		}, 1000);
		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<>
			{showToast && (
				<Toast
					message="You have been logged out successfully!"
					type="success"
					onClose={() => setShowToast(false)}
				/>
			)}
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
				<div className="text-lg text-gray-700 dark:text-gray-200 mt-8">Logging you out...</div>
			</div>
		</>
	);
};

export default Logout;
