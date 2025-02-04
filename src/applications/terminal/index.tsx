import React, { useState, useRef, useEffect } from "react";
import { withWindow } from "../../system/windowManager";

interface CommandOutput {
  command: string;
  output: string;
}

const TerminalComponent: React.FC = () => {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: { [key: string]: (args: string[]) => string } = {
    help: () => "Available commands: help, clear, echo, ls, pwd, whoami",
    clear: () => {
      setCommandHistory([]);
      return "";
    },
    echo: (args) => args.join(" "),
    ls: () => "Documents  Downloads  Pictures  Music  Videos",
    pwd: () => "/home/user",
    whoami: () => "user",
  };

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    const [cmd, ...args] = trimmedCommand.split(" ");
    const output = commands[cmd]
      ? commands[cmd](args)
      : `Command not found: ${cmd}. Type 'help' for available commands.`;

    setCommandHistory([...commandHistory, { command: trimmedCommand, output }]);
    setCurrentCommand("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(
          commandHistory[commandHistory.length - 1 - newIndex].command
        );
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(
          commandHistory[commandHistory.length - 1 - newIndex].command
        );
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      className="bg-[#2b2b2b] text-[#f0f0f0] p-5 font-mono h-[400px] overflow-y-auto rounded"
    >
      {commandHistory.map((entry, index) => (
        <div key={index}>
          <div className="flex items-start my-1">
            <span className="text-[#98c379] mr-2">user@localhost:~$</span>
            {entry.command}
          </div>
          {entry.output && (
            <div className="my-1 whitespace-pre-wrap">{entry.output}</div>
          )}
        </div>
      ))}
      <div className="flex items-start my-1">
        <span className="text-[#98c379] mr-2">user@localhost:~$</span>
        <input
          ref={inputRef}
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-[#f0f0f0] font-mono text-base flex-1 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
};

const WrappedTerminal = withWindow(TerminalComponent, {
  id: "terminal",
  title: "Terminal",
  defaultPosition: { x: 100, y: 100 },
  defaultSize: { width: 600, height: 400 },
  minSize: { width: 300, height: 200 },
});

export default WrappedTerminal;
