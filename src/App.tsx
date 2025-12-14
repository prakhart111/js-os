import React, { useState, useEffect } from "react";
import { Terminal, Settings, User, FileText, Wifi, Battery, Command, Search } from "lucide-react";
import { motion } from "framer-motion";
import TerminalComponent from "./applications/terminal";
import SettingsComponent from "./applications/settings";
import AboutComponent from "./applications/about";
import NotesComponent from "./applications/notes";

// --- Types ---
type AppWindow = {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
};

// --- Components ---

const MenuBar = ({ activeApp }: { activeApp: string }) => {
  const [time, setTime] = useState(new Date());
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setAppleMenuOpen(false);
    if (appleMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [appleMenuOpen]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[30px] bg-black/20 backdrop-blur-xl text-white flex items-center justify-between px-4 z-[9999] text-xs font-medium select-none shadow-sm border-b border-white/5">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span 
            className={`text-lg hover:text-gray-300 cursor-default px-2 py-0.5 rounded ${appleMenuOpen ? "bg-white/20" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setAppleMenuOpen(!appleMenuOpen);
            }}
          >
            
          </span>
          {appleMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-[#2b2b2b]/95 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/10 py-1.5 text-[13px] text-white z-[10000]">
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">About This Mac</div>
              <div className="h-[1px] bg-white/10 my-1.5 mx-3"></div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">System Settings...</div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">App Store...</div>
              <div className="h-[1px] bg-white/10 my-1.5 mx-3"></div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">Sleep</div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">Restart...</div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">Shut Down...</div>
              <div className="h-[1px] bg-white/10 my-1.5 mx-3"></div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">Lock Screen</div>
              <div className="px-3 py-1 hover:bg-blue-600 rounded mx-1 cursor-default">Log Out User...</div>
            </div>
          )}
        </div>
        
        <span className="font-bold">{activeApp || "Finder"}</span>
        
        <div className="hidden md:flex space-x-4 font-normal">
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">File</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">Edit</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">View</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">Go</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">Window</span>
          <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">Help</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-3 mr-2">
          <Battery size={16} className="text-gray-200" />
          <Wifi size={16} className="text-gray-200" />
          <Search size={14} className="text-gray-200" />
          <Command size={14} className="text-gray-200" />
        </div>
        <span className="hover:bg-white/10 px-2 py-0.5 rounded cursor-default">
          {formatDate(time)} &nbsp; {formatTime(time)}
        </span>
      </div>
    </div>
  );
};

const AppIcon = ({ 
  icon, 
  title, 
  color, 
  onClick, 
  isOpen, 
  isMinimized 
}: { 
  icon: React.ReactNode, 
  title: string, 
  color: string, 
  onClick: () => void, 
  isOpen: boolean,
  isMinimized?: boolean
}) => {
  console.log(isMinimized);
  return (
    <div className="group flex flex-col items-center gap-1 relative">
      <motion.button
        whileHover={{ scale: 1.2, y: -10 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg relative transition-all duration-200 ${color}`}
      >
        <div className="text-white drop-shadow-md">
          {icon}
        </div>
      </motion.button>
      {isOpen && (
        <div className="w-1 h-1 bg-white/80 rounded-full absolute -bottom-2" />
      )}
      <div className="absolute -top-10 bg-gray-800/80 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        {title}
      </div>
    </div>
  );
};

// --- Main Application ---

const AppContent = () => {
  const [activeWindows, setActiveWindows] = useState<AppWindow[]>([]);
  const [topZIndex, setTopZIndex] = useState(10);
  const [activeAppTitle, setActiveAppTitle] = useState("Finder");

  const apps = [
    {
      id: "terminal",
      icon: <Terminal size={28} />,
      title: "Terminal",
      color: "bg-gray-800 border border-gray-600",
      content: <TerminalComponent />,
    },
    {
      id: "notes",
      icon: <FileText size={28} />,
      title: "Notes",
      color: "bg-yellow-500 border border-yellow-400",
      content: <NotesComponent />,
    },
    {
      id: "settings",
      icon: <Settings size={28} />,
      title: "Settings",
      color: "bg-gray-500 border border-gray-400",
      content: <SettingsComponent />,
    },
    {
      id: "about",
      icon: <User size={28} />,
      title: "About",
      color: "bg-blue-500 border border-blue-400",
      content: <AboutComponent />,
    },
  ];

  const focusWindow = (id: string) => {
    setTopZIndex((prev) => prev + 1);
    setActiveWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: topZIndex + 1 } : w))
    );
    const app = apps.find(a => a.id === id);
    if (app) setActiveAppTitle(app.title);
  };

  const openWindow = (app: typeof apps[0]) => {
    const existingWindow = activeWindows.find((w) => w.id === app.id);
    
    if (!existingWindow) {
      const newZIndex = topZIndex + 1;
      setTopZIndex(newZIndex);
      setActiveWindows((prev) => [
        ...prev,
        {
          ...app,
          isOpen: true,
          isMinimized: false,
          zIndex: newZIndex,
        },
      ]);
      setActiveAppTitle(app.title);
    } else {
      if (existingWindow.isMinimized) {
        setActiveWindows((prev) =>
          prev.map((w) => (w.id === app.id ? { ...w, isMinimized: false } : w))
        );
      }
      focusWindow(app.id);
    }
  };

  const minimizeWindow = (id: string) => {
    const updatedWindows = activeWindows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindows(updatedWindows);
    
    // Find the next highest window that is NOT minimized and NOT the one we just minimized
    const visibleWindows = updatedWindows.filter(w => !w.isMinimized && w.id !== id);
    
    if (visibleWindows.length > 0) {
      const topWindow = visibleWindows.reduce((prev, current) => 
        (prev.zIndex > current.zIndex) ? prev : current
      );
      setActiveAppTitle(topWindow.title);
    } else {
      setActiveAppTitle("Finder");
    }
  };

  const closeWindow = (id: string) => {
    const remainingWindows = activeWindows.filter((w) => w.id !== id);
    setActiveWindows(remainingWindows);
    
    // Find the next highest window that is NOT minimized
    const visibleWindows = remainingWindows.filter(w => !w.isMinimized);
    
    if (visibleWindows.length > 0) {
      const topWindow = visibleWindows.reduce((prev, current) => 
        (prev.zIndex > current.zIndex) ? prev : current
      );
      setActiveAppTitle(topWindow.title);
    } else {
      setActiveAppTitle("Finder");
    }
  };

  const wrapAppContent = (app: AppWindow) => {
    return React.cloneElement(app.content as React.ReactElement, {
      onClose: (id: string) => closeWindow(id),
      onMinimize: (id: string) => minimizeWindow(id),
      onFocus: (id: string) => focusWindow(id),
      isMinimized: app.isMinimized,
      zIndex: app.zIndex,
      isActive: app.zIndex === topZIndex,
    });
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center relative selection:bg-blue-500/30"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2070&auto=format&fit=crop')",
      }}
      onClick={() => {
         // Only set to Finder if we are clicking directly on the desktop (not on a window)
         // This is a simplification; in a real DOM event bubbling scenario, we'd check targets more carefully.
         // For now, since windows stop propagation on click (usually), this works for the background.
         // However, we need to ensure we don't override if a window is active.
         // Actually, if we click background, we DO want to focus Finder.
         // But we need to ensure windows stop propagation.
         // The WindowManager component handles mousedown, but let's be safe.
      }}
      onMouseDown={(e) => {
        if(e.target === e.currentTarget) {
          setActiveAppTitle("Finder");
        }
      }}
    >
      {/* Menu Bar */}
      <MenuBar activeApp={activeAppTitle} />

      {/* Desktop Area */}
      <div className="relative w-full h-full pt-[30px] pb-[80px]">
        {activeWindows.map((window) => (
          <React.Fragment key={window.id}>
            {wrapAppContent(window)}
          </React.Fragment>
        ))}
      </div>

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="glass-dark px-4 py-3 rounded-2xl flex items-end space-x-3 md:space-x-4 border border-white/10">
          {apps.map((app) => (
            <AppIcon
              key={app.id}
              icon={app.icon}
              title={app.title}
              color={app.color}
              isOpen={activeWindows.some((w) => w.id === app.id)}
              isMinimized={activeWindows.find((w) => w.id === app.id)?.isMinimized}
              onClick={() => openWindow(app)}
            />
          ))}
          
          {/* Divider */}
          <div className="w-[1px] h-10 bg-white/20 mx-2" />
          
          {/* Static Trash Icon (Just for show) */}
          <AppIcon
            icon={<div className="text-xs font-bold">BIN</div>}
            title="Trash"
            color="bg-gradient-to-br from-gray-300 to-gray-400 border border-gray-300"
            onClick={() => alert("Trash is empty!")}
            isOpen={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AppContent;
