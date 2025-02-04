import React, { useState, useRef, useEffect } from "react";
import { Minus, Maximize2, X } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export interface WindowProps {
  title: string;
  defaultPosition?: Position;
  defaultSize?: Size;
  minSize?: Size;
  onClose?: () => void;
  isActive?: boolean;
  zIndex?: number;
  id: string; // Add unique identifier for each window
  onMinimize?: (id: string) => void; // Add minimize handler
}

export const withWindow = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  windowProps: Omit<WindowProps, "onClose" | "onMinimize">
) => {
  return function WindowComponent(
    props: P & {
      onClose?: (id: string) => void;
      onMinimize?: (id: string) => void;
      isMinimized?: boolean;
    }
  ) {
    const [position, setPosition] = useState<Position>(
      windowProps.defaultPosition || { x: 100, y: 100 }
    );
    const [size, setSize] = useState<Size>(
      windowProps.defaultSize || { width: 600, height: 400 }
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const titleBarRef = useRef<HTMLDivElement>(null);
    const previousSize = useRef<Size>(size);
    const previousPosition = useRef<Position>(position);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (
        e.target === titleBarRef.current ||
        titleBarRef.current?.contains(e.target as Node)
      ) {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      setDragOffset({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Prevent dragging outside viewport
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.min(Math.max(0, newX), maxX),
          y: Math.min(Math.max(0, newY), maxY),
        });
      } else if (isResizing && !isMaximized) {
        const minWidth = windowProps.minSize?.width || 200;
        const minHeight = windowProps.minSize?.height || 200;

        const newWidth = Math.max(
          size.width + (e.clientX - dragOffset.x),
          minWidth
        );
        const newHeight = Math.max(
          size.height + (e.clientY - dragOffset.y),
          minHeight
        );

        setSize({ width: newWidth, height: newHeight });
        setDragOffset({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleMaximize = () => {
      if (!isMaximized) {
        previousSize.current = size;
        previousPosition.current = position;
        setSize({ width: window.innerWidth, height: window.innerHeight });
        setPosition({ x: 0, y: 0 });
        setIsMaximized(true);
      } else {
        setSize(previousSize.current);
        setPosition(previousPosition.current);
        setIsMaximized(false);
      }
    };

    const handleClose = () => {
      if (props.onClose) {
        props.onClose(windowProps.id);
      }
    };

    const handleMinimize = () => {
      if (props.onMinimize) {
        props.onMinimize(windowProps.id);
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, isResizing, dragOffset]);

    // Don't render if minimized
    if (props.isMinimized) {
      return null;
    }

    return (
      <div
        ref={windowRef}
        className={`fixed bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
          isMaximized ? "rounded-none" : ""
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          zIndex: windowProps.zIndex || 1,
        }}
      >
        {/* Window Title Bar */}
        <div
          ref={titleBarRef}
          className="h-8 bg-gray-700 flex items-center justify-between px-2 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <span className="text-white font-semibold">{windowProps.title}</span>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              onClick={handleMinimize}
            >
              <Minus size={16} />
            </button>
            <button
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              onClick={handleMaximize}
            >
              <Maximize2 size={16} />
            </button>
            <button
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              onClick={handleClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="h-[calc(100%-2rem)] overflow-auto">
          <WrappedComponent {...props} />
        </div>

        {/* Resize Handle */}
        {!isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          />
        )}
      </div>
    );
  };
};
