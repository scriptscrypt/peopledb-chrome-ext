import React, { useState, useEffect } from 'react';
import { Checkbox, Button } from "@nextui-org/react";
import { Mail } from "lucide-react";
import { ListModal } from "../ListModal";

const ProspectTab = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showListModal, setShowListModal] = useState(false);

  // Filter prospects when search query changes
  useEffect(() => {
    const filtered = prospects.filter(prospect => 
      prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProspects(filtered);
  }, [searchQuery, prospects]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const newSelected = filteredProspects.map(p => p.id);
      setSelectedContacts(newSelected);
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id, checked) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, id]);
    } else {
      setSelectedContacts(prev => prev.filter(contactId => contactId !== id));
    }
  };

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
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search prospects..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Selection Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-900">
          <Checkbox 
            isSelected={
              filteredProspects.length > 0 && 
              selectedContacts.length === filteredProspects.length
            }
            onValueChange={handleSelectAll}
          />
          <span>{selectedContacts.length} selected</span>
        </div>
        {selectedContacts.length > 0 && (
          <Button 
            size="sm"
            color="primary"
            onClick={() => setShowListModal(true)}
          >
            Add to List
          </Button>
        )}
      </div>

      {/* Prospects List */}
      <div className="flex-1 overflow-auto">
        {filteredProspects.map((prospect) => (
          <div
            key={prospect.id}
            className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <Checkbox
              isSelected={selectedContacts.includes(prospect.id)}
              onValueChange={(checked) => handleSelectContact(prospect.id, checked)}
            />
            <div className="flex items-center gap-3">
              <img 
                src={prospect.profileImg} 
                alt={prospect.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <a 
                  href={prospect.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-gray-900"
                >
                  {prospect.name}
                </a>
                <p className="text-sm text-gray-500">{prospect.title}</p>
                <p className="text-sm text-gray-500">{prospect.location}</p>
                <p className="text-xs text-gray-400">{prospect.connectionDegree}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Modal */}
      <ListModal 
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        selectedContacts={selectedContacts}
        onAddToList={(lists) => {
          console.log('Adding contacts to lists:', {
            contacts: selectedContacts,
            lists: lists
          });
          setShowListModal(false);
        }}
      />
    </div>
  );
};

const ProspectItem = ({ prospect, isSelected, onSelect }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
      <Checkbox
        isSelected={isSelected}
        onValueChange={(checked) => onSelect(prospect.id, checked)}
      />
      <div className="flex items-center gap-3">
        <img 
          src={prospect.imageUrl} 
          alt={prospect.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <a 
            href={prospect.profileUrl}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm font-medium text-gray-900"
          >
            {prospect.name}
          </a>
          <p className="text-sm text-gray-500">{prospect.title}</p>
          <p className="text-sm text-gray-500">{prospect.location}</p>
        </div>
      </div>
    </div>
  );
};
export default ProspectTab; 