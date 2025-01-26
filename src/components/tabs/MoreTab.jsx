import React from 'react';
import { Card, Switch } from "@nextui-org/react";
import { Rocket, Search, Send, List, Plug2, HelpCircle, FileText, Shield } from "lucide-react";

const MoreTab = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Account Info */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
          <span className="text-lg text-gray-900">S</span>
        </div>
        <div>
          <h2 className="font-medium text-gray-900">Srinivasa Rao</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Free plan.</span>
            <span className="text-sm text-blue-500 cursor-pointer">Upgrade</span>
          </div>
        </div>
      </div>

      {/* Account Credits */}
      <Card className="mx-4 p-4 bg-white border border-gray-200">
        <h3 className="font-medium mb-4 text-gray-900">Account credits</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Account Email</span>
              <span>2 used of 50</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full w-[4%] bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Account Phone</span>
              <span>2 used of 5</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full w-[40%] bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Last calculated: Jan 20, 2025, 01:53 AM
          <span className="text-blue-500 ml-2">Update</span>
        </p>
      </Card>

      {/* Platform Features */}
      <Card className="mx-4 mt-4 p-4 bg-white border border-gray-200">
        <h3 className="font-medium mb-4 text-gray-900">Lusha platform</h3>
        <div className="space-y-4">
          <MenuItem icon={<Rocket />} text="Onboarding" />
          <MenuItem icon={<Search />} text="Prospecting platform" />
          <MenuItem icon={<Send />} text="Sequences" />
          <MenuItem icon={<List />} text="Lists" />
          <MenuItem icon={<Plug2 />} text="Integrations" />
        </div>
      </Card>

      {/* Extension Preferences */}
      <Card className="mx-4 mt-4 p-4 bg-white border border-gray-200">
        <h3 className="font-medium mb-4 text-gray-900">Extension preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Plugin position</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border">L</button>
              <button className="px-3 py-1 rounded border bg-blue-500 text-white">R</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Auto open</span>
            <Switch defaultSelected />
          </div>
          <div className="flex items-center justify-between">
            <span>Enable Lusha Everywhere</span>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Help Links */}
      <div className="p-4 space-y-4 text-gray-600">
        <MenuItem icon={<HelpCircle className="text-gray-600" />} text="Help center" />
        <MenuItem icon={<FileText className="text-gray-600" />} text="Terms of service" />
        <MenuItem icon={<Shield className="text-gray-600" />} text="Privacy policy" />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 cursor-pointer">
    {icon}
    <span>{text}</span>
  </div>
);

export default MoreTab; 