import React, { useState } from "react";
import {
  Button,
  Avatar,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Switch,
} from "@nextui-org/react";
import {
  Mail,
  Users,
  Building2,
  Globe,
  Search,
  Clock,
  MoreHorizontal,
  User,
} from "lucide-react";
import ProspectTab from './tabs/ProspectTab';
import SearchTab from './tabs/SearchTab';
import ActivityTab from './tabs/ActivityTab';
import MoreTab from './tabs/MoreTab';

// Simplified theme configuration - light theme only
const theme = {
  background: "bg-white",
  text: "text-black",
  secondaryText: "text-gray-600",
  border: "border-gray-200",
  card: "bg-white",
  hover: "hover:bg-gray-50",
  input: "bg-white",
  pill: "bg-gray-100",
};

const ContactsManager = () => {
  const [activeTab, setActiveTab] = useState("prospect");

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchTab theme={theme} />;
      case "activity":
        return <ActivityTab theme={theme} />;
      case "more":
        return <MoreTab theme={theme} />;
      default:
        return <ProspectTab theme={theme} />;
    }
  };

  return (
    <div className="h-[600px] w-96 flex flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Lusha" className="w-6 h-6" />
          <span className="font-semibold">Lusha</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-500">Free credits</span>
          <button className="p-2">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-4 border-t">
        <NavButton
          icon={<User />}
          label="Prospect"
          isActive={activeTab === "prospect"}
          onClick={() => setActiveTab("prospect")}
        />
        <NavButton
          icon={<Search />}
          label="Search"
          isActive={activeTab === "search"}
          onClick={() => setActiveTab("search")}
        />
        <NavButton
          icon={<Clock />}
          label="Activity"
          isActive={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
        />
        <NavButton
          icon={<MoreHorizontal />}
          label="More"
          isActive={activeTab === "more"}
          onClick={() => setActiveTab("more")}
        />
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 ${
      isActive ? 'text-blue-500' : 'text-gray-500'
    }`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5" })}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default ContactsManager;
