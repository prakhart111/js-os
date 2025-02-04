import React, { useState, useEffect } from "react";
import { withWindow } from "../../system/windowManager";

interface SystemInfo {
  browser: string;
  os: string;
  platform: string;
  cores: number;
  memory: string;
  language: string;
  userAgent: string;
  screenResolution: string;
  connection: string;
}

const SettingsComponent: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    browser: "Loading...",
    os: "Loading...",
    platform: "Loading...",
    cores: 0,
    memory: "Loading...",
    language: "Loading...",
    userAgent: "Loading...",
    screenResolution: "Loading...",
    connection: "Loading...",
  });

  useEffect(() => {
    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browserName = "Unknown";

      if (ua.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
      } else if (ua.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
      } else if (ua.indexOf("Safari") > -1) {
        browserName = "Safari";
      } else if (ua.indexOf("Edge") > -1) {
        browserName = "Microsoft Edge";
      } else if (ua.indexOf("Opera") > -1) {
        browserName = "Opera";
      }

      return browserName;
    };

    const getOSInfo = () => {
      const ua = navigator.userAgent;
      let os = "Unknown";

      if (ua.indexOf("Win") > -1) os = "Windows";
      else if (ua.indexOf("Mac") > -1) os = "MacOS";
      else if (ua.indexOf("Linux") > -1) os = "Linux";
      else if (ua.indexOf("Android") > -1) os = "Android";
      else if (ua.indexOf("iOS") > -1) os = "iOS";

      return os;
    };

    const getConnectionInfo = () => {
      if ("connection" in navigator) {
        const conn = (
          navigator as unknown as {
            connection: { effectiveType: string; downlink: number };
          }
        ).connection;
        return `${conn.effectiveType || "Unknown"} (${conn.downlink}Mbps)`;
      }
      return "Not available";
    };

    const getMemoryInfo = () => {
      if ("deviceMemory" in navigator) {
        return `${
          (navigator as unknown as { deviceMemory: number }).deviceMemory
        }GB RAM`;
      }
      return "Not available";
    };

    setSystemInfo({
      browser: getBrowserInfo(),
      os: getOSInfo(),
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 0,
      memory: getMemoryInfo(),
      language: navigator.language,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      connection: getConnectionInfo(),
    });
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">System Information</h2>
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-2">Hardware</h3>
          <div className="space-y-2">
            <InfoRow label="CPU Cores" value={`${systemInfo.cores} cores`} />
            <InfoRow label="Memory" value={systemInfo.memory} />
            <InfoRow
              label="Screen Resolution"
              value={systemInfo.screenResolution}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-2">Software</h3>
          <div className="space-y-2">
            <InfoRow label="Operating System" value={systemInfo.os} />
            <InfoRow label="Browser" value={systemInfo.browser} />
            <InfoRow label="Platform" value={systemInfo.platform} />
            <InfoRow label="Language" value={systemInfo.language} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="text-lg font-semibold mb-2">Network</h3>
          <div className="space-y-2">
            <InfoRow label="Connection" value={systemInfo.connection} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-1 border-b border-gray-700">
    <span className="text-gray-400">{label}:</span>
    <span>{value}</span>
  </div>
);

const WrappedSettings = withWindow(SettingsComponent, {
  id: "settings",
  title: "System Settings",
  defaultPosition: { x: 150, y: 150 },
  defaultSize: { width: 500, height: 600 },
  minSize: { width: 300, height: 200 },
});

export default WrappedSettings;
