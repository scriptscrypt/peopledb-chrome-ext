import React, { useState, useEffect } from 'react';
import { Checkbox, Button } from "@nextui-org/react";
import { Mail } from "lucide-react";

const ProspectTab = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [bulkView, setBulkView] = useState(false);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[ProspectTab] Component mounted');
    
    const requestProspects = async () => {
      try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true,
          url: ["*://*.linkedin.com/*"]  // Only match LinkedIn URLs
        });

        console.log('[ProspectTab] Current tab:', tab);

        if (!tab) {
          throw new Error('Please navigate to LinkedIn to use this feature');
        }

        // Send message to content script
        console.log('[ProspectTab] Sending message to content script');
        chrome.tabs.sendMessage(
          tab.id, 
          { type: 'GET_PROSPECTS' }, 
          (response) => {
            console.log('[ProspectTab] Response received:', response);
            
            if (chrome.runtime.lastError) {
              console.error('[ProspectTab] Runtime error:', chrome.runtime.lastError);
              setError('Failed to connect to LinkedIn page. Please refresh the page.');
              setLoading(false);
              return;
            }

            if (response && response.success) {
              setProspects(response.prospects || []);
              setLoading(false);
            } else {
              setError('No data received from LinkedIn');
              setLoading(false);
            }
          }
        );

      } catch (err) {
        console.error('[ProspectTab] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    requestProspects();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <p className="text-red-500 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading prospects...</p>
        <p className="text-sm text-gray-400 text-center mt-2">
          Make sure you're on a LinkedIn search results page
        </p>
      </div>
    );
  }

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
            className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50"
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
            <img 
              src={prospect.profileImg} 
              alt={prospect.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{prospect.name}</h3>
              <p className="text-sm text-gray-600">{prospect.title}</p>
              {bulkView && (
                <>
                  <p className="text-sm text-gray-500">{prospect.location}</p>
                  <p className="text-sm text-gray-500">{prospect.connectionDegree}</p>
                  <p className="text-sm text-gray-500">{prospect.mutualConnections}</p>
                </>
              )}
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
              onClick={() => window.open(prospect.profileUrl, '_blank')}
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProspectTab; 