import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ text, to, onClick, isDarkMode, className, title }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      title={title}
      className={`rounded transition shadow
      ${
        isDarkMode
          ? "bg-[rgb(80,82,88)] text-white hover:bg-[rgb(70,72,78)]"
          : "bg-[rgb(173,203,251)] text-black hover:bg-[rgb(150,185,245)]"
      }
      ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;