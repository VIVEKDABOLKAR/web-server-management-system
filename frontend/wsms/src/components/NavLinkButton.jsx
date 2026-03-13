import React from "react";

const NavLinkButton = ({label,section,scrollToSection}) => {
        const handleClick = (e) => {
            e.preventDefault();
            scrollToSection(section);
        }

        return (
            <button
                onClick={handleClick}
                className="hover:text-blue-200 transition"
            >
                {label}
            </button>
        );
}

export default NavLinkButton;