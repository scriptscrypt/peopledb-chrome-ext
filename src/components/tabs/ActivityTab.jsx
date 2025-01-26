import React from 'react';
import { Tabs, Tab, Card } from "@nextui-org/react";
import { Building2 } from "lucide-react";

const ActivityTab = () => {
  const savedContacts = [
    {
      name: "Cole Ha",
      title: "Chief AI Officer, Tech for Social Impact International",
      company: "Microsoft"
    },
    {
      name: "Rui Costa",
      title: "Vice President of Sales",
      company: "Salesforce"
    },
    {
      name: "David Martinez",
      title: "Senior Director of Growth",
      company: "Gopuff"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 pb-0">
        <Tabs 
          aria-label="Activity Options" 
          color="primary" 
          variant="underlined"
          classNames={{
            tabList: "gap-6",
            cursor: "w-full",
            tab: "text-gray-600",
            tabContent: "group-data-[selected=true]:text-blue-500"
          }}
        >
          <Tab key="details" title="Details found" />
          <Tab key="saved" title="Saved" />
        </Tabs>
      </div>

      <div className="p-4 space-y-4 overflow-auto">
        {savedContacts.map((contact, index) => (
          <Card key={index} className="p-4 bg-white border border-gray-200">
            <h3 className="font-medium text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.title}</p>
            <p className="text-sm text-blue-500 mt-1">{contact.company}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityTab; 