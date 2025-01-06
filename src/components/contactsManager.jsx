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
  Filter,
  List,
  Settings,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

// Theme configuration
const themes = {
  light: {
    background: "bg-white",
    text: "text-gray-900",
    secondaryText: "text-gray-600",
    border: "border-gray-200",
    card: "bg-white",
    hover: "hover:bg-gray-50",
    input: "bg-white",
    pill: "bg-gray-100",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    secondaryText: "text-gray-400",
    border: "border-gray-700",
    card: "bg-gray-800",
    hover: "hover:bg-gray-800",
    input: "bg-gray-800",
    pill: "bg-gray-700",
  },
};

const ExtensionPopup = () => {
  const [activeTab, setActiveTab] = useState("prospect");
  const [showEmail, setShowEmail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchTab theme={theme} />;
      case "activity":
        return <ActivityTab theme={theme} />;
      case "more":
        return <MoreTab theme={theme} />;
      default:
        return (
          <ProspectTab
            showEmail={showEmail}
            setShowEmail={setShowEmail}
            theme={theme}
          />
        );
    }
  };

  return (
    <div
      className={`w-96 min-h-[600px] flex flex-col ${theme.background} ${theme.text}`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center p-4 border-b ${theme.border}`}
      >
        <h1 className="text-xl font-semibold">People DB</h1>
        <div className="flex items-center gap-3">
          <span className="text-blue-500">Free credits</span>
          <Switch
            size="sm"
            color="secondary"
            startContent={<Sun className="w-3 h-3" />}
            endContent={<Moon className="w-3 h-3" />}
            isSelected={isDarkMode}
            onValueChange={setIsDarkMode}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-auto`}>{renderContent()}</div>

      {/* Bottom Navigation */}
      <div
        className={`border-t ${theme.border} grid grid-cols-4 p-2 ${theme.background}`}
      >
        <NavButton
          icon={<User className="w-5 h-5" />}
          label="Prospect"
          isActive={activeTab === "prospect"}
          onClick={() => setActiveTab("prospect")}
          theme={theme}
        />
        <NavButton
          icon={<Search className="w-5 h-5" />}
          label="Search"
          isActive={activeTab === "search"}
          onClick={() => setActiveTab("search")}
          theme={theme}
        />
        <NavButton
          icon={<Clock className="w-5 h-5" />}
          label="Activity"
          isActive={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
          theme={theme}
        />
        <NavButton
          icon={<MoreHorizontal className="w-5 h-5" />}
          label="More"
          isActive={activeTab === "more"}
          onClick={() => setActiveTab("more")}
          theme={theme}
        />
      </div>
    </div>
  );
};

// Reusable Navigation Button Component
const NavButton = ({ icon, label, isActive, onClick, theme }) => (
  <Button
    variant="light"
    className={`flex flex-col items-center ${
      isActive ? "text-blue-500" : theme.secondaryText
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

// Tab Components with theme support
const ProspectTab = ({ showEmail, setShowEmail, theme }) => (
  <div className="p-4">
    {/* Profile Header */}
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="w-12 h-12" fallback={<User className="w-6 h-6" />} />
      <div>
        <h2 className={`text-lg font-semibold ${theme.text}`}>Nishant Kumar</h2>
        <div className="flex items-center text-orange-400 text-sm">
          <Building2 className="w-4 h-4 mr-1" />
          <span>Changed jobs</span>
        </div>
      </div>
    </div>

    {/* Email Button */}
    <Button
      className="w-full bg-blue-600 text-white mb-4"
      onClick={() => setShowEmail(!showEmail)}
    >
      <Mail className="w-5 h-5 mr-2" />
      {showEmail ? "Hide email" : "Show email"}
    </Button>

    {/* Email Display */}
    <div className="flex items-center gap-2 mb-6">
      <Mail className={`w-5 h-5 ${theme.secondaryText}`} />
      <span className={theme.secondaryText}>
        {showEmail ? "nishant@dezerv.in" : "•••••••@dezerv.in"}
      </span>
      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-sm">
        A+
      </span>
    </div>

    {/* Company Card */}
    <div className={`border rounded-lg p-4 ${theme.card} ${theme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8" />
          <span className="font-semibold">Dezerv</span>
        </div>
        <Button isIconOnly variant="light">
          <MoreHorizontal className={`w-5 h-5 ${theme.secondaryText}`} />
        </Button>
      </div>

      {/* Company Info */}
      <div className={`space-y-4 ${theme.secondaryText}`}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>View all employees</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span>dezerv.in</span>
        </div>
      </div>
    </div>

    {/* Additional Info */}
    <div className="mt-6 space-y-6">
      <InfoSection
        title="About"
        content="Dezerv is a wealth management company that combines the expertise of seasoned investment professionals with advanced technology..."
        theme={theme}
      />
      <InfoSection
        title="Number of employees"
        content="201 - 500"
        theme={theme}
      />
      <InfoSection title="Industry" content="Finance" theme={theme} />
      <InfoSection
        title="Specialties"
        content={
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full ${theme.pill} text-sm`}>
              Startup Investment
            </span>
            <span className={`px-3 py-1 rounded-full ${theme.pill} text-sm`}>
              Wealth Management
            </span>
          </div>
        }
        theme={theme}
      />
    </div>
  </div>
);

const InfoSection = ({ title, content, theme }) => (
  <div className="space-y-2">
    <h3 className={`font-semibold ${theme.text}`}>{title}</h3>
    <div className={theme.secondaryText}>
      {typeof content === "string" ? <p>{content}</p> : content}
    </div>
  </div>
);
const SearchTab = ({ theme }) => {
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    location: "",
    hasEmail: false,
    hasPhone: false,
    recentlyUpdated: false,
  });

  return (
    <div className={`p-4 ${theme.background}`}>
      <Input
        placeholder="Search contacts..."
        startContent={<Search className={`w-4 h-4 ${theme.secondaryText}`} />}
        classNames={{
          base: "max-w-full",
          mainWrapper: "h-full",
          input: `${theme.text}`,
          inputWrapper: `${theme.card} border-1 ${theme.border} hover:border-blue-500`,
        }}
      />

      <div className="space-y-4 mt-4">
        <h3 className={`font-semibold flex items-center gap-2 ${theme.text}`}>
          <Filter className="w-4 h-4" />
          Filters
        </h3>

        <Select
          label="Industry"
          placeholder="Select industry"
          className="max-w-full"
          classNames={{
            label: theme.text,
            value: theme.text,
            trigger: `${theme.card} border-1 ${theme.border} hover:border-blue-500`,
            listbox: `${theme.card} ${theme.border}`,
          }}
        >
          {["Finance", "Technology", "Healthcare"].map((option) => (
            <SelectItem key={option} value={option} className={theme.text}>
              {option}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Company Size"
          placeholder="Select size"
          className="max-w-full"
          classNames={{
            label: theme.text,
            value: theme.text,
            trigger: `${theme.card} border-1 ${theme.border} hover:border-blue-500`,
            listbox: `${theme.card} ${theme.border}`,
          }}
        >
          {["1-50", "51-200", "201-500", "501+"].map((option) => (
            <SelectItem key={option} value={option} className={theme.text}>
              {option}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Location"
          placeholder="Select location"
          className="max-w-full"
          classNames={{
            label: theme.text,
            value: theme.text,
            trigger: `${theme.card} border-1 ${theme.border} hover:border-blue-500`,
            listbox: `${theme.card} ${theme.border}`,
          }}
        >
          {["United States", "United Kingdom", "India"].map((option) => (
            <SelectItem key={option} value={option} className={theme.text}>
              {option}
            </SelectItem>
          ))}
        </Select>

        <div
          className={`space-y-2 ${theme.card} p-4 rounded-lg border ${theme.border}`}
        >
          <span className={`text-sm font-medium ${theme.text}`}>
            Additional Filters
          </span>
          <div className="space-y-2">
            <Checkbox
              classNames={{
                label: theme.text,
                wrapper: "border-gray-400",
              }}
              value="hasEmail"
              isSelected={filters.hasEmail}
              onValueChange={(checked) =>
                setFilters({ ...filters, hasEmail: checked })
              }
            >
              Has email
            </Checkbox>
            <Checkbox
              classNames={{
                label: theme.text,
                wrapper: "border-gray-400",
              }}
              value="hasPhone"
              isSelected={filters.hasPhone}
              onValueChange={(checked) =>
                setFilters({ ...filters, hasPhone: checked })
              }
            >
              Has phone
            </Checkbox>
            <Checkbox
              classNames={{
                label: theme.text,
                wrapper: "border-gray-400",
              }}
              value="recentlyUpdated"
              isSelected={filters.recentlyUpdated}
              onValueChange={(checked) =>
                setFilters({ ...filters, recentlyUpdated: checked })
              }
            >
              Recently updated
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, placeholder, options, theme }) => (
  <Select label={label} placeholder={placeholder} className={theme.input}>
    {options.map((option) => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    ))}
  </Select>
);

const FilterCheckbox = ({ label, theme }) => (
  <Checkbox className={theme.text}>{label}</Checkbox>
);

const ActivityTab = ({ theme }) => {
  const lists = [
    { id: 1, name: "Prospects", count: 24 },
    { id: 2, name: "Leads", count: 15 },
    { id: 3, name: "To Contact", count: 8 },
  ];

  return (
    <div className={`p-4 ${theme.background}`}>
      <div className="mb-6">
        <h3
          className={`font-semibold flex items-center gap-2 mb-3 ${theme.text}`}
        >
          <List className="w-4 h-4" />
          Your Lists
        </h3>
        <div className="space-y-2">
          {lists.map((list) => (
            <div
              key={list.id}
              className={`p-3 border rounded-lg ${theme.card} ${theme.border}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={`font-medium ${theme.text}`}>{list.name}</h4>
                  <p className={theme.secondaryText}>{list.count} contacts</p>
                </div>
                <ChevronRight className={`w-5 h-5 ${theme.secondaryText}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3
          className={`font-semibold flex items-center gap-2 mb-3 ${theme.text}`}
        >
          <Clock className="w-4 h-4" />
          Recent Activity
        </h3>
        <div className={`p-4 ${theme.card} rounded-lg ${theme.border}`}>
          <p className={theme.secondaryText}>No recent activity</p>
        </div>
      </div>
    </div>
  );
};

const MoreTab = ({ theme }) => {
  const menuItems = [
    { icon: <Settings className="w-4 h-4" />, label: "Settings" },
    { icon: <Users className="w-4 h-4" />, label: "Team Members" },
    { icon: <Globe className="w-4 h-4" />, label: "API Access" },
  ];

  return (
    <div className={`p-4 ${theme.background}`}>
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16" />
        <div>
          <h2 className={`text-xl font-semibold ${theme.text}`}>John Doe</h2>
          <p className={theme.secondaryText}>john@example.com</p>
        </div>
      </div>

      <div
        className={`p-4 border rounded-lg ${theme.card} ${theme.border} mb-6`}
      >
        <h3 className={`font-medium mb-2 ${theme.text}`}>Credits</h3>
        <div className="space-y-2">
          <div
            className={`flex justify-between text-sm ${theme.secondaryText}`}
          >
            <span>Email Credits</span>
            <span>100</span>
          </div>
          <div
            className={`flex justify-between text-sm ${theme.secondaryText}`}
          >
            <span>Mobile Credits</span>
            <span>50</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="light"
            className={`w-full justify-between ${theme.hover} ${theme.text}`}
            endContent={
              <ChevronRight className={`w-4 h-4 ${theme.secondaryText}`} />
            }
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Help & Support Section */}
      <div className={`space-y-2 mb-6`}>
        <h3 className={`font-medium mb-2 ${theme.text}`}>Help & Support</h3>
        <Button
          variant="light"
          className={`w-full justify-between ${theme.hover}`}
          endContent={
            <ChevronRight className={`w-4 h-4 ${theme.secondaryText}`} />
          }
        >
          <span className={theme.text}>Help Center</span>
        </Button>
        <Button
          variant="light"
          className={`w-full justify-between ${theme.hover}`}
          endContent={
            <ChevronRight className={`w-4 h-4 ${theme.secondaryText}`} />
          }
        >
          <span className={theme.text}>Contact Support</span>
        </Button>
      </div>

      {/* Legal Section */}
      <div className={`space-y-2 mb-6 ${theme.secondaryText}`}>
        <Button variant="light" className={`w-full justify-start text-sm`}>
          Terms of Service
        </Button>
        <Button variant="light" className={`w-full justify-start text-sm`}>
          Privacy Policy
        </Button>
      </div>

      {/* Sign Out Button */}
      <div className={`border-t ${theme.border} pt-4 mt-4`}>
        <Button
          color="danger"
          variant="flat"
          className="w-full"
          startContent={<LogOut className="w-4 h-4" />}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ExtensionPopup;
