import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  strokeWidth: "2",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const Icons = {
  Play: () => <svg {...iconProps}><path d="M5 3l14 9-14 9V3z"></path></svg>,
  Trash: () => <svg {...iconProps}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>,
  Scan: () => <svg {...iconProps}><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10"></path></svg>,
  Slideshow: () => <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>,
  Search: () => <svg {...iconProps} className="w-5 h-5 text-white/50"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  // FIX: Corrected a typo from `icon_props` to `iconProps`.
  Close: ({ className = 'w-6 h-6' }: { className?: string }) => <svg {...iconProps} className={className}><path d="M6 18L18 6M6 6l12 12"></path></svg>,
  Pause: () => <svg {...iconProps} className="w-8 h-8"><path d="M10 9v6m4-6v6"></path></svg>,
  ChevronLeft: () => <svg {...iconProps} className="w-6 h-6 text-white/80"><path d="M15 19l-7-7 7-7"></path></svg>,
  ChevronRight: () => <svg {...iconProps} className="w-6 h-6 text-white/80"><path d="M9 5l7 7-7 7"></path></svg>,
  ChevronDown: () => <svg {...iconProps} className="w-6 h-6 text-white/80"><path d="M19 9l-7 7-7 7"></path></svg>,
  CheckCircle: () => <svg {...iconProps}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  ExclamationCircle: () => <svg {...iconProps}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  InfoCircle: () => <svg {...iconProps}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
};