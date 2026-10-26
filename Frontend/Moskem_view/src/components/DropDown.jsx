import { TagIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({
  title = "Tipo Producto",
  options = [],
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Todos");
  const dropdownRef = useRef(null);

  const allOptions = ["Todos", ...options];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div
      className="relative inline-block text-left min-w-[220px]"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#004B57] hover:bg-[#00363E] text-[#B2B2B2] font-semibold h-14 w-full px-4 rounded-xl flex items-center justify-between transition-all active:scale-95 gap-2"
        aria-expanded={isOpen}
      >
        <span className="text-white text-sm">
          <span className="text-gray-300 font-normal">{title}: </span>
          <span className="font-semibold">{selectedOption}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-gray-300 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-100 ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {allOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left"
              >
                <div
                  className={`font-semibold w-full px-4 rounded-xl flex items-center justify-start py-2 gap-2 transition-all active:scale-95 ${
                    selectedOption === option
                      ? "bg-[#004B57] text-white"
                      : "text-[#B2B2B2] hover:bg-[#004B57]/10 hover:text-[#004B57]"
                  }`}
                >
                  <TagIcon className="size-5 shrink-0" />
                  <span className="text-md">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}