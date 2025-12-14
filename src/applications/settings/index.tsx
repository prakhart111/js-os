import React, { useState, useEffect } from "react";
import { withWindow } from "../../system/windowManager";
import { Monitor, Cpu, Globe, Wifi, Battery, HardDrive, Info } from "lucide-react";

interface SystemInfo {
  browser: string;
  os: string;
  platform: string;
  cores: number;
  memory: string;
  language: string;
  screenResolution: string;
  connection: string;
}

const SettingsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    browser: "Loading...",
    os: "Loading...",
    platform: "Loading...",
    cores: 0,
    memory: "Loading...",
    language: "Loading...",
    screenResolution: "Loading...",
    connection: "Loading...",
  });

  useEffect(() => {
    // Mock data for better visual representation in portfolio
    setSystemInfo({
      browser: "Chrome 120.0",
      os: "macOS Sonoma",
      platform: "MacIntel",
      cores: navigator.hardwareConcurrency || 8,
      memory: "16GB Unified Memory",
      language: "en-US",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      connection: "5G / WiFi 6",
    });
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: <Info size={18} /> },
    { id: "display", label: "Displays", icon: <Monitor size={18} /> },
    { id: "network", label: "Network", icon: <Wifi size={18} /> },
    { id: "storage", label: "Storage", icon: <HardDrive size={18} /> },
  ];

  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100/50 dark:bg-[#282828] border-r border-gray-200 dark:border-white/10 pt-4 px-2">
        <div className="mb-4 px-2 flex items-center space-x-2">
           <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
           </div>
           <div>
             <div className="text-sm font-bold">Guest User</div>
             <div className="text-xs text-gray-500">Apple ID</div>
           </div>
        </div>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{tabs.find(t => t.id === activeTab)?.label}</h2>
        
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#2C2C2C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-white/5 flex items-center space-x-4">
               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">🍎</div>
               <div>
                 <h3 className="font-bold text-lg">macOS Sonoma</h3>
                 <p className="text-sm text-gray-500">Version 14.2.1</p>
               </div>
            </div>

            <div className="bg-white dark:bg-[#2C2C2C] rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-white/5">
              <SettingRow label="Processor" value="Apple M2 Pro" />
              <SettingRow label="Memory" value={systemInfo.memory} />
              <SettingRow label="Startup Disk" value="Macintosh HD" />
              <SettingRow label="Serial Number" value="C02XG..." last />
            </div>
          </div>
        )}

        {activeTab === "display" && (
           <div className="bg-white dark:bg-[#2C2C2C] rounded-lg p-8 shadow-sm border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center space-y-4">
              <Monitor size={64} className="text-blue-500" />
              <div className="text-center">
                <h3 className="font-bold">Built-in Retina Display</h3>
                <p className="text-gray-500">{systemInfo.screenResolution}</p>
              </div>
           </div>
        )}

        {activeTab === "network" && (
           <div className="bg-white dark:bg-[#2C2C2C] rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-white/5">
              <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><Wifi size={16}/></div>
                  <div>
                    <div className="font-medium">Wi-Fi</div>
                    <div className="text-xs text-green-500">Connected</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded text-sm">Details...</div>
              </div>
              <SettingRow label="IP Address" value="192.168.1.14" last />
           </div>
        )}
        
        {activeTab === "storage" && (
           <div className="bg-white dark:bg-[#2C2C2C] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                 <HardDrive size={32} className="text-gray-400" />
                 <div>
                   <div className="font-bold">Macintosh HD</div>
                   <div className="text-sm text-gray-500">499 GB available of 1 TB</div>
                 </div>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-black rounded-full overflow-hidden flex">
                 <div className="w-[20%] bg-red-500 h-full"></div>
                 <div className="w-[15%] bg-yellow-500 h-full"></div>
                 <div className="w-[10%] bg-green-500 h-full"></div>
                 <div className="w-[5%] bg-blue-500 h-full"></div>
              </div>
              <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> Apps</span>
                <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div> Photos</span>
                <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Documents</span>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const SettingRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={`flex justify-between p-3 ${!last ? "border-b border-gray-100 dark:border-white/5" : ""}`}>
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const WrappedSettings = withWindow(SettingsComponent, {
  id: "settings",
  title: "System Settings",
  defaultPosition: { x: 150, y: 150 },
  defaultSize: { width: 700, height: 500 },
  minSize: { width: 500, height: 400 },
});

export default WrappedSettings;
