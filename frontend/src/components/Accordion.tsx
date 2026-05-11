import React, { useRef } from 'react';
import { Icons } from './Icons';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, isCollapsed, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 text-left"
        aria-expanded={!isCollapsed}
      >
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : '-rotate-180'}`}>
          <Icons.ChevronDown />
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isCollapsed ? '0px' : `${contentRef.current?.scrollHeight}px` }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        {children}
      </div>
    </>
  );
};
