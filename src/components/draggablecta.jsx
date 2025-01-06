import React, { useState, useRef, useEffect } from "react";
import { Motion, spring } from "react-motion";
import ExtensionPopup from "./contactsManager";

const DraggableCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ y: 200 }); // Initial Y position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0 });
  const ctaRef = useRef(null);

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
    // Constrain to window bounds
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
          className={`fixed right-0 bg-blue-600 text-white flex items-center justify-center
            ${isOpen ? "cursor-default" : "cursor-move"} shadow-lg z-50`}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            top: `${y}px`,
            borderRadius: isOpen ? "0" : "8px 0 0 8px",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative w-full h-full">
            {/* CTA Icon/Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`absolute ${isOpen ? "right-4 top-4" : "inset-0"} 
                flex items-center justify-center transition-opacity`}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
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
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {/* Notification Badge */}
                  <div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                    rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    1
                  </div>
                </>
              )}
            </button>

            {/* Content when opened */}
            <div
              className={`w-full h-full p-4 ${
                isOpen ? "opacity-100" : "opacity-0"
              } 
              transition-opacity duration-300`}
            >
              {isOpen && (
                <div className="mt-12">
                  {" "}
                  {/* Space for close button */}
                  <ExtensionPopup />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Motion>
  );
};

export default DraggableCTA;
