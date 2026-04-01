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
			<div className="min-h-screen bg-linear-to-br from-red-100 via-orange-50 to-yellow-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center px-4">
				<div className="text-center">
					<div className="flex w-20 h-20 rounded-full bg-linear-to-br from-red-200 to-orange-200 dark:from-red-900/30 dark:to-orange-900/30 items-center justify-center mb-6 animate-pulse">
						<p className="text-4xl">👋</p>
					</div>
					<h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
						See you soon!
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
						Logging you out securely...
					</p>
					<div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
						<div className="h-full bg-linear-to-r from-red-500 to-orange-500 rounded-full animate-pulse" style={{
							width: "100%"
						}}></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Logout;
