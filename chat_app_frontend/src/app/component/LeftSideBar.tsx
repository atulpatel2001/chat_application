"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, ChevronDown, ChevronUp, Home, Settings, MessageSquare, Users } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <Home size={20} />,
    subItems: [
      { name: "Overview", href: "/dashboard/overview" },
      { name: "Analytics", href: "/dashboard/analytics" },
      { name: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    title: "Contact",
    icon: <MessageSquare size={20} />,
    subItems: [
      { name: "Contacts", href: "/chat/contacts/conatct_list" },
      { name: "Add", href: "/chat/contacts/add_contact" },
      { name: "Drafts", href: "/contact/drafts" },
    ],
  },
  {
    title: "Messages",
    icon: <MessageSquare size={20} />,
    subItems: [
      { name: "Chat", href: "/chat/contacts/chat" },
      { name: "Group Chat", href: "/chat/contacts/group" },
      { name: "Drafts", href: "/messages/drafts" },
    ],
  },
  {
    title: "Users",
    icon: <Users size={20} />,
    subItems: [
      { name: "All Users", href: "/users/all" },
      { name: "Roles", href: "/users/roles" },
      { name: "Permissions", href: "/users/permissions" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    href: "/settings",
    subItems: [
      { name: "Profile", href: "/chat/user/profile" },
      { name: "Account", href: "/settings/account" },
      { name: "Security", href: "/settings/security" },
    ],
  },
];

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "16rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-gray-900 text-white p-4 flex flex-col fixed"
      >
        {/* Sidebar Toggle Button */}
        <button onClick={toggleSidebar} className="p-2 bg-gray-800 rounded-md mb-4">
          <Menu size={24} />
        </button>

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map(({ title, icon, href, subItems }) => (
            <li key={title}>
              {/* <Link  className="block"> */}
                <button
                  onClick={() => toggleMenu(title)}
                  className="flex items-center w-full p-2 hover:bg-gray-800 rounded-md"
                >
                  {icon}
                  {isOpen && <span className="ml-3 flex-1">{title}</span>}
                  {isOpen && (
                    expandedMenus[title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              {/* </Link> */}

              {/* Submenu */}
              {expandedMenus[title] && isOpen && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="ml-6 mt-2 space-y-1"
                >
                  {subItems.map(({ name, href }) => (
                    <li key={name}>
                      <Link href={href} className="block">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md w-full text-left">
                          {name}
                        </button>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default LeftSidebar;
