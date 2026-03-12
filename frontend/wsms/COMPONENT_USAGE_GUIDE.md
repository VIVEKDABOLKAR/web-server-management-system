# Component Usage Guide

## Overview
This guide explains how to use the new generic and page-specific components created for the dashboard.

---

## 1. AddButton Component
**Location:** `src/components/AddButton.jsx`

A reusable, customizable button component for adding items across the application.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Add" | Button text/label |
| `onClick` | function | required | Click handler callback |
| `variant` | string | "primary" | Style variant: 'primary', 'secondary', 'outline' |
| `size` | string | "md" | Button size: 'sm', 'md', 'lg' |
| `icon` | ReactNode | null | Optional icon element |
| `disabled` | boolean | false | Disable button state |
| `className` | string | "" | Additional custom Tailwind classes |

### Examples

#### Basic Usage (Server Table)
```jsx
import AddButton from "../components/AddButton";

<AddButton 
  title="+ Add Server"
  onClick={() => navigate("/add-server")}
/>
```

#### With Icon
```jsx
<AddButton 
  title="Add Server"
  onClick={handleAdd}
  icon="🖥️"
  size="lg"
/>
```

#### Different Variants
```jsx
// Primary (default)
<AddButton title="Add" onClick={handleAdd} />

// Secondary
<AddButton 
  title="Cancel"
  variant="secondary"
  onClick={handleCancel}
/>

// Outline
<AddButton 
  title="Export"
  variant="outline"
  onClick={handleExport}
/>
```

#### Different Sizes
```jsx
<AddButton title="Small" size="sm" onClick={handleAdd} />
<AddButton title="Medium" size="md" onClick={handleAdd} />
<AddButton title="Large" size="lg" onClick={handleAdd} />
```

---

## 2. Sidebar Component
**Location:** `src/components/Sidebar.jsx`

A modern, responsive sidebar for dashboard navigation with collapsible submenus.

### Features
- 📱 Responsive design (mobile overlay, desktop sidebar)
- 🎨 Dark mode support
- 🔗 Active route highlighting
- 📂 Collapsible menu items with submenus
- 🔔 Badge support for notifications

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | true | Control sidebar visibility on mobile |
| `onClose` | function | null | Callback to close sidebar on mobile |

### Menu Structure
The sidebar includes pre-configured menu items (each can optionally carry an icon):
- **Dashboard** - Main dashboard view
- **Servers** - Server management (with submenus)
- **Monitoring** - Performance monitoring with alert badge
- **Security** - Security settings and blocked IPs
- **Settings** - User settings and preferences

The implementation now uses a separate `SidebarIcons.jsx` helper to provide modern SVG icons; you can swap any icon or remove it by editing `menuItems`.

The component also automatically expands the parent menu when the current route matches a submenu item (e.g. navigating to `/add-server` opens the "Servers" submenu).

### Customization
Edit the `menuItems` array in `Sidebar.jsx` to modify navigation:

```jsx
const menuItems = [
  {
    id: "custom",
    label: "Custom Item",
    path: "/custom",
    icon: "🎯",
    badge: "2", // Optional badge
    submenu: [ // Optional submenu
      { label: "Sub Item 1", path: "/custom/1" },
      { label: "Sub Item 2", path: "/custom/2" }
    ]
  }
]
```

---

## 3. DashboardLayout Component
**Location:** `src/components/dashboard/DashboardLayout.jsx`

A page-specific wrapper component that combines Sidebar with dashboard content.

### Usage
```jsx
import DashboardLayout from "../components/dashboard/DashboardLayout";
import YourContent from "./YourContent";

function YourDashboardPage() {
  return (
    <DashboardLayout pageTitle="Page Title">
      <YourContent />
    </DashboardLayout>
  );
}
```

### Features
- ✅ Responsive layout (sidebar + content)
- ✅ Mobile hamburger menu
- ✅ Smooth transitions
- ✅ Flexible content area

---

## Component Organization

```
src/components/
├── AddButton.jsx (✨ Generic - reusable)
├── Sidebar.jsx (✨ Generic - dashboard navigation)
├── ServerTable.jsx (existing)
├── Navbar.jsx (existing)
├── dashboard/ (📁 Page-specific components)
│   ├── DashboardLayout.jsx (layout wrapper)
│   └── AddButtonExamples.jsx (examples & reference)
└── ... (other components)
```

---

## Integration Examples

### In ServerTable Component
```jsx
import AddButton from "../AddButton";

const ServerTable = ({ onAdd, ...props }) => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h2>Server Inventory</h2>
        <AddButton 
          title="+ Add Server"
          onClick={onAdd}
          icon="🖥️"
        />
      </div>
      {/* table content */}
    </div>
  );
};
```

### In Dashboard Page
```jsx
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ServerTable from "../components/ServerTable";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <DashboardLayout>
      <Navbar />
      {/* Other dashboard content */}
      <ServerTable {...props} />
    </DashboardLayout>
  );
}
```

---

## Styling & Themes

All components support:
- ✅ Light and Dark modes (using Tailwind dark: classes)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Customizable via Tailwind classes
- ✅ Focus states and accessibility

### Customizing Colors
Edit the color values in the component files:
- Primary: `sky-600` → change to `blue-600`, `indigo-600`, etc.
- Background: `slate-*` → change to `gray-*`, `zinc-*`, etc.

---

## Best Practices

1. **AddButton Usage**
   - Use descriptive titles
   - Always provide an onClick handler
   - Use appropriate variant for context
   - Add icons for better UX

2. **Sidebar Usage**
   - Keep menu items concise
   - Use logical grouping with submenus
   - Use badges for notifications/counts
   - Test on mobile devices

3. **DashboardLayout Usage**
   - Wrap entire dashboard pages
   - Place Navbar inside the layout
   - Keep main content flexible

---

## Troubleshooting

### Sidebar not closing on mobile
- Check `onClose` callback is connected
- Verify Links have proper `to` attributes

### AddButton styling issues
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with other components
- Verify dark mode is enabled in tailwind.config.js

### Active route highlighting not working
- Verify routes match the paths in Sidebar menuItems
- Check `useLocation()` dependency
- Ensure React Router is properly set up

---

## Future Enhancements

- Add search functionality to Sidebar
- Add user avatar display
- Add collapsible stats panel
- Add keyboard shortcuts
- Add animation preferences
- Add sidebar width customization

