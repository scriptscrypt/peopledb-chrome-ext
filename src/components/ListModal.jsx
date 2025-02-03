import React, { useState } from 'react';
import { Modal, Button, Checkbox } from "@nextui-org/react";

// Mock data for lists
const MOCK_LISTS = [
  { id: 1, name: "Sales Leads", count: 24 },
  { id: 2, name: "Tech Founders", count: 15 },
  { id: 3, name: "Potential Clients", count: 32 }
];

export const ListModal = ({ isOpen, onClose, selectedContacts, onAddToList }) => {
  const [selectedLists, setSelectedLists] = useState([]);

  const handleListSelection = (listId, checked) => {
    setSelectedLists(prev => {
      if (checked) {
        return [...prev, listId];
      } else {
        return prev.filter(id => id !== listId);
      }
    });
  };

  const handleAddToLists = () => {
    if (selectedLists.length === 0) return;
    onAddToList(selectedLists);
    setSelectedLists([]); // Reset selections
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
    >
      <Modal.Header>
        <h3 className="text-lg font-semibold">Add to List</h3>
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Selected contacts: {selectedContacts.length}
          </p>
          
          <div className="space-y-3">
            {MOCK_LISTS.map(list => (
              <div key={list.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Checkbox
                    key={list.id}
                    isSelected={selectedLists.includes(list.id)}
                    onValueChange={(checked) => handleListSelection(list.id, checked)}
                  />
                  <span className="text-sm">{list.name}</span>
                </div>
                <span className="text-xs text-gray-500">{list.count} contacts</span>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button color="danger" variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onPress={handleAddToLists}
          isDisabled={selectedLists.length === 0}
        >
          Add to Lists
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 