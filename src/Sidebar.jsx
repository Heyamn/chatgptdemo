import { useState } from "react";
import { FiMenu, FiPlusSquare } from "react-icons/fi";

const Sidebar = ({ onNewChat }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "New Chat", icon: <FiPlusSquare /> }
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-xl font-bold transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          ChatGPT UI
        </h1>
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu size={20} />
        </button>
      </div>
      <div className="flex-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer transition-all"
          >
          <button className="flex gap-3" onClick={onNewChat}>
            <span className="text-lg mt-0.5">{item.icon}</span>
            <span
              className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
            >
              {item.name}
            </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
