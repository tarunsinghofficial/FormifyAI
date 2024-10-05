"use client";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import {
  BarChart,
  DollarSign,
  Library,
  LucideHouse,
  MessageSquare,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from "lucide-react";
import CreateForm from "./CreateForm";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const currPath = usePathname();
  const { open, toggleSidebar } = useSidebar();

  const menuList = [
    { name: "Dashboard", icon: LucideHouse, link: "/dashboard" },
    { name: "My Forms", icon: Library, link: "/dashboard/myforms" },
    { name: "Responses", icon: MessageSquare, link: "/dashboard/form-responses" },
    { name: "Analytics", icon: BarChart, link: "/dashboard/analytics" },
    { name: "Premium", icon: DollarSign, link: "/dashboard/subscription" },
  ];

  return (
    <div className={`h-full shadow-xl ${open ? 'w-64' : 'w-20'} transition-width duration-300 bg-white dark:bg-[#1C1C1C] border-r-[1px] dark:border-[#2B2D33]`}>
      <div className="flex flex-col justify-between h-full p-4">
        <div>
        <button
            onClick={toggleSidebar}
            className="flex items-center justify-center mb-4"
          >
            {open ? (
              <IconChevronLeft className="w-6 h-6 dark:text-[#585858]" />
            ) : (
              <IconChevronRight className="w-6 h-6 dark:text-[#585858]" />
            )}
          </button>
          <ul className="space-y-4">
            {menuList.map((menu, index) => (
              <li
                key={index}
                className={`hover:cursor-pointer px-2 py-4 text-dark-blue dark:text-[#585858] font-semibold hover:bg-primary-blue dark:hover:text-primary-blue hover:text-primary-blue hover:bg-opacity-10 hover:rounded-lg 
                  ${
                    currPath === menu.link
                      ? "bg-primary-blue text-primary-blue dark:text-primary-blue bg-opacity-10 rounded-lg"
                      : ""
                  }`}
              >
                <a href={menu.link} className="flex items-center">
                  <menu.icon className="w-6 h-6 mr-2" />
                  {open && menu.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* apply the conditional rendeing here also for hiding the text when toggled and only show icon */}
        <div className="mb-14">
          <CreateForm />
        </div>
      </div>
    </div>
  );
};

export default SideNav;