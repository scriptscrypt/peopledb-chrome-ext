import React from 'react';
import { Input, Button, Tabs, Tab } from "@nextui-org/react";
import { Search, Building2, Users, Briefcase, MapPin, Building, Factory } from "lucide-react";

const SearchTab = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 pb-0">
        <Tabs 
          aria-label="Search Options" 
          color="primary" 
          variant="underlined"
          classNames={{
            tabList: "gap-6",
            cursor: "w-full",
            tab: "text-gray-600",
            tabContent: "group-data-[selected=true]:text-blue-500"
          }}
        >
          <Tab
            key="contacts"
            title={
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>Contacts</span>
              </div>
            }
          />
          <Tab
            key="companies"
            title={
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <span>Companies</span>
              </div>
            }
          />
        </Tabs>
      </div>

      {/* Search Fields */}
      <div className="p-4 space-y-4">
        <Input
          label="Job title"
          placeholder="Enter Job title"
          startContent={<Briefcase className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />
        
        <Input
          label="Contact location"
          placeholder="Enter Contact location"
          startContent={<MapPin className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />

        <Input
          label="Seniority"
          placeholder="Enter Seniority"
          startContent={<Users className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />

        <Input
          label="Department"
          placeholder="Enter Department"
          startContent={<Building className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />

        <Input
          label="Main industry"
          placeholder="Enter Main industry"
          startContent={<Factory className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />

        <Input
          label="Sub industry"
          placeholder="Enter Sub industry"
          startContent={<Factory className="w-4 h-4 text-gray-400" />}
          classNames={{
            label: "text-sm text-gray-600",
            input: "text-gray-900",
            inputWrapper: "bg-white border-1 border-gray-200"
          }}
        />
        
        <div className="flex justify-between pt-4">
          <Button
            variant="light"
            className="text-blue-500"
          >
            Advanced search
          </Button>
          <Button
            color="primary"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchTab; 