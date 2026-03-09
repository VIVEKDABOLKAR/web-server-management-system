import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      icon: "✓",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      icon: "✕",
    },
  };

  const { bg, icon } = styles[type] || styles.success;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div
        className={`${bg} text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px] backdrop-blur-sm`}
      >
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
          {icon}
        </div>
        <div className="flex-1 font-medium">{message}</div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold transition-all"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
