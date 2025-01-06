// cta.js
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Motion, spring } from "react-motion";

const LinkedInCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0 });
  const [profileData, setProfileData] = useState(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Listen for profile data
    document.addEventListener("PROFILE_DATA_READY", (e) => {
      setProfileData(e.detail);
    });

    return () => {
      document.removeEventListener("PROFILE_DATA_READY", null);
    };
  }, []);

  // Drag handlers (same as before)
  const handleMouseDown = (e) => {
    if (isOpen) return;
    setIsDragging(true);
    setDragStart({
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newY = e.clientY - dragStart.y;
    const maxY = window.innerHeight - (ctaRef.current?.offsetHeight || 0);
    const boundedY = Math.max(0, Math.min(newY, maxY));
    setPosition({ y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Motion
      style={{
        width: spring(isOpen ? 384 : 48),
        height: spring(isOpen ? window.innerHeight : 48),
        y: spring(isOpen ? 0 : position.y),
      }}
    >
      {({ width, height, y }) => (
        <div
          ref={ctaRef}
          className="fixed right-0 bg-blue-600 text-white shadow-lg z-[9999]"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${y}px`,
            borderRadius: isOpen ? "0" : "8px 0 0 8px",
            cursor: isOpen ? "default" : "move",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative w-full h-full">
            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-4 top-4 p-2 hover:bg-blue-700 rounded-full"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    1
                  </div>
                </>
              )}
            </button>

            {/* Content */}
            {isOpen && profileData && (
              <div className="p-6 mt-16">
                <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm opacity-70">Name</label>
                    <p>{profileData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Title</label>
                    <p>{profileData.title}</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Company</label>
                    <p>{profileData.company}</p>
                  </div>
                  <div>
                    <label className="text-sm opacity-70">Location</label>
                    <p>{profileData.location}</p>
                  </div>
                  <button
                    className="w-full bg-white text-blue-600 py-2 rounded-lg mt-4 hover:bg-blue-50"
                    onClick={() => {
                      // Send save request to extension
                      chrome.runtime.sendMessage({
                        type: "SAVE_CONTACT",
                        data: profileData,
                      });
                    }}
                  >
                    Save Contact
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Motion>
  );
};

// Create root and render
const container = document.getElementById("contact-saver-cta");
const root = createRoot(container);
root.render(<LinkedInCTA />);
