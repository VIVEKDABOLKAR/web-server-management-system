import SidebarMenuItem from "./SidebarMenuItem";

/** Sidebar navigation */
const SidebarMenu = ({
  menuItems,
  expandedMenu,
  toggleSubmenu,
  isActive,
  handleLinkClick,
}) => {
  return (
    <nav className="flex-1 px-4 py-6 space-y-2 ">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          expandedMenu={expandedMenu}
          toggleSubmenu={toggleSubmenu}
          isActive={isActive}
          handleLinkClick={handleLinkClick}
        />
      ))}
    </nav>
  );
};

export default SidebarMenu;