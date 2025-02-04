import React, { useState, useEffect } from "react";
import { Terminal, Settings, Menu, X, User, FileText } from "lucide-react";
import TerminalComponent from "./applications/terminal";
import SettingsComponent from "./applications/settings";
import AboutComponent from "./applications/about";
import NotesComponent from "./applications/notes";

// Types
type AppWindow = {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
};

// Clock component
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return <span className="text-sm">{formatTime(time)}</span>;
};

const AppContent = () => {
  const [activeWindows, setActiveWindows] = useState<AppWindow[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const apps = [
    {
      id: "terminal",
      icon: <Terminal className="h-12 w-12" />,
      title: "Terminal",
      content: <TerminalComponent />,
    },
    {
      id: "settings",
      icon: <Settings className="h-12 w-12" />,
      title: "System Settings",
      content: <SettingsComponent />,
    },
    {
      id: "about",
      icon: <User className="h-12 w-12" />,
      title: "About",
      content: <AboutComponent />,
    },
    {
      id: "notes",
      icon: <FileText className="h-12 w-12" />,
      title: "Notes",
      content: <NotesComponent />,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Windows") {
        setIsStartMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openWindow = (app: {
    id: string;
    title: string;
    content: React.ReactNode;
  }) => {
    if (!activeWindows.find((w) => w.id === app.id)) {
      setActiveWindows((prev) => [
        ...prev,
        {
          ...app,
          isOpen: true,
          isMinimized: false,
        },
      ]);
    } else {
      setActiveWindows((prev) =>
        prev.map((w) => (w.id === app.id ? { ...w, isMinimized: false } : w))
      );
    }
    setIsStartMenuOpen(false);
  };

  const minimizeWindow = (id: string) => {
    setActiveWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const closeWindow = (id: string) => {
    setActiveWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const wrapAppContent = (app: AppWindow) => {
    return React.cloneElement(app.content as React.ReactElement, {
      onClose: (id: string) => closeWindow(id),
      onMinimize: (id: string) => minimizeWindow(id),
      isMinimized: app.isMinimized,
    });
  };

  return (
    <div className="min-h-screen bg-[#001535] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2F2F2F] p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className="flex items-center space-x-2 hover:bg-[#404040] px-2 py-1 rounded"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm hidden md:block">Menu</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Guest</span>
          <Clock />
        </div>
      </div>

      {/* Start Menu */}
      {isStartMenuOpen && (
        <div className="fixed left-0 top-12 w-full md:w-96 bg-[#2F2F2F] shadow-xl z-50 rounded-br-lg">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Applications</h2>
            <div className="grid grid-cols-1 gap-2">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openWindow(app)}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-[#404040] rounded text-left"
                >
                  {app.icon}
                  <span>{app.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#353535] z-50 p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="grid grid-cols-3 gap-4 mt-12">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  openWindow(app);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center space-y-2"
              >
                {app.icon}
                <span className="text-xs">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="h-[calc(100vh-80px)] p-4 relative">
        {activeWindows.map((window) => (
          <React.Fragment key={window.id}>
            {wrapAppContent(window)}
          </React.Fragment>
        ))}
      </div>

      {/* Combined Dock & Task Bar */}
      <div className="bg-[#2F2F2F]/90 backdrop-blur fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full">
        <div className="flex space-x-4">
          {apps.map((app) => {
            const isRunning = activeWindows.some((w) => w.id === app.id);
            const isMinimized = activeWindows.find(
              (w) => w.id === app.id
            )?.isMinimized;

            return (
              <button
                key={app.id}
                onClick={() => {
                  if (isRunning) {
                    // If app is running, toggle minimize state
                    setActiveWindows((prev) =>
                      prev.map((w) =>
                        w.id === app.id
                          ? { ...w, isMinimized: !w.isMinimized }
                          : w
                      )
                    );
                  } else {
                    // If app is not running, open it
                    openWindow(app);
                  }
                }}
                className="relative hover:scale-110 transition-transform"
                aria-label={`${isRunning ? "Show" : "Open"} ${app.title}`}
              >
                {React.cloneElement(app.icon as React.ReactElement, {
                  className: "h-10 w-10",
                })}
                {/* Running Indicator */}
                {isRunning && (
                  <div
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 w-6 rounded-full transition-colors ${
                      isMinimized ? "bg-gray-500" : "bg-blue-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const App = () => <AppContent />;

export default App;
