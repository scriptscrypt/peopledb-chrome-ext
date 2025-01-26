import React, { useState } from 'react';
import { Checkbox, Button } from "@nextui-org/react";
import { Mail } from "lucide-react";

const ProspectTab = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [bulkView, setBulkView] = useState(false);
  
  const prospects = [
    {
      id: 1,
      name: "Kushal K V",
      company: "Nitte Meenakshi Institute",
      selected: false
    },
    {
      id: 2,
      name: "Kushal N H",
      company: "Nitte Meenakshi Institute",
      selected: false
    },
    {
      id: 3,
      name: "Kushal Vijay",
      company: "Microsoft",
      selected: false
    },
    {
      id: 4,
      name: "Kushal Poudel",
      company: "K&A Engineering Consulting, P.C.",
      selected: false,
      changed: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Bulk View Header */}
      {bulkView && (
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Bulk view</h1>
          <Button color="primary">Show details</Button>
        </div>
      )}

      {/* Selection Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-900">
          <Checkbox 
            isSelected={selectedContacts.length === prospects.length}
            onValueChange={(checked) => {
              if (checked) {
                setSelectedContacts(prospects.map(p => p.id));
              } else {
                setSelectedContacts([]);
              }
            }}
          />
          <span>{selectedContacts.length} selected</span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="bordered"
            className="text-gray-900 border-gray-200"
            startContent={<Mail className="w-4 h-4" />}
            onClick={() => setBulkView(!bulkView)}
          >
            {bulkView ? "Hide details" : "Show details"}
          </Button>
        </div>
      </div>

      {/* Prospects List */}
      <div className="flex-1 overflow-auto">
        {prospects.map((prospect) => (
          <div
            key={prospect.id}
            className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white"
          >
            <Checkbox
              isSelected={selectedContacts.includes(prospect.id)}
              onValueChange={(checked) => {
                if (checked) {
                  setSelectedContacts([...selectedContacts, prospect.id]);
                } else {
                  setSelectedContacts(selectedContacts.filter(id => id !== prospect.id));
                }
              }}
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{prospect.name}</h3>
              <p className="text-sm text-gray-600">{prospect.company}</p>
              {prospect.changed && (
                <div className="mt-1">
                  <span className="text-orange-500 text-xs">Changed jobs</span>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="bordered"
              className="text-gray-900 border-gray-200"
            >
              Edit and save
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProspectTab; 