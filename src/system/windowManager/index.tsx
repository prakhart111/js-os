import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";

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
  id: string;
  onMinimize?: (id: string) => void;
  onFocus?: (id: string) => void;
}

export const withWindow = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  windowProps: Omit<WindowProps, "onClose" | "onMinimize" | "onFocus">
) => {
  return function WindowComponent(
    props: P & {
      onClose?: (id: string) => void;
      onMinimize?: (id: string) => void;
      onFocus?: (id: string) => void;
      isMinimized?: boolean;
      isActive?: boolean;
      zIndex?: number;
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
    const [isHoveringControls, setIsHoveringControls] = useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const titleBarRef = useRef<HTMLDivElement>(null);
    const previousSize = useRef<Size>(size);
    const previousPosition = useRef<Position>(position);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (props.onFocus) props.onFocus(windowProps.id);
      
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

        // Prevent dragging header completely off screen
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;

        setPosition({
          x: Math.min(Math.max(-size.width + 50, newX), maxX),
          y: Math.min(Math.max(0, newY), maxY),
        });
      } else if (isResizing && !isMaximized) {
        const minWidth = windowProps.minSize?.width || 300;
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
        setSize({ width: window.innerWidth, height: window.innerHeight - 30 }); // Account for menu bar
        setPosition({ x: 0, y: 30 });
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
      if (isDragging || isResizing) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, isResizing, dragOffset]);

    return (
      <AnimatePresence>
        {!props.isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            ref={windowRef}
            onMouseDown={() => props.onFocus && props.onFocus(windowProps.id)}
            className={`fixed rounded-xl overflow-hidden flex flex-col glass-dark window-shadow ring-1 ring-white/10 ${
              isMaximized ? "rounded-none" : ""
            }`}
            style={{
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              zIndex: props.zIndex || 1,
            }}
          >
            {/* macOS Title Bar */}
            <div
              ref={titleBarRef}
              className="h-10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-between px-4 cursor-default select-none border-b border-white/5"
              onMouseDown={handleMouseDown}
              onDoubleClick={handleMaximize}
              onMouseEnter={() => setIsHoveringControls(true)}
              onMouseLeave={() => setIsHoveringControls(false)}
            >
              <div className="flex items-center space-x-2 w-20">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group focus:outline-none"
                >
                  <X size={8} className={`text-black/50 opacity-0 ${isHoveringControls ? "group-hover:opacity-100" : ""}`} />
                </button>
                
                {/* Minimize Button */}
                <button
                  onClick={handleMinimize}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center group focus:outline-none"
                >
                  <Minus size={8} className={`text-black/50 opacity-0 ${isHoveringControls ? "group-hover:opacity-100" : ""}`} />
                </button>
                
                {/* Maximize Button */}
                <button
                  onClick={handleMaximize}
                  className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center group focus:outline-none"
                >
                  <Maximize2 size={8} className={`text-black/50 opacity-0 ${isHoveringControls ? "group-hover:opacity-100" : ""}`} />
                </button>
              </div>
              
              <div className="flex-1 text-center">
                <span className="text-white/90 font-medium text-sm drop-shadow-md">{windowProps.title}</span>
              </div>
              
              <div className="w-20"></div> {/* Spacer for symmetry */}
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]/80 backdrop-blur-md">
              <WrappedComponent {...props} />
            </div>

            {/* Resize Handle */}
            {!isMaximized && (
              <div
                className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-50 hover:bg-white/5 rounded-tl"
                onMouseDown={handleResizeMouseDown}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
};
