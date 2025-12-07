import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface SlideCounterProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange?: (slide: number) => void;
  onEditingChange?: (isEditing: boolean) => void;
  isControlsLocked?: boolean;
  onToggleControlsLock?: () => void;
}

export const SlideCounter = ({
  currentSlide,
  totalSlides,
  onSlideChange,
  onEditingChange,
  isControlsLocked = false,
  onToggleControlsLock,
}: SlideCounterProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSlideNumberClick = () => {
    if (onSlideChange) {
      setInputValue(String(currentSlide + 1));
      setIsEditing(true);
      onEditingChange?.(true);
      if (!isControlsLocked && onToggleControlsLock) {
        onToggleControlsLock();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const slideNumber = parseInt(inputValue);
      if (slideNumber >= 1 && slideNumber <= totalSlides && onSlideChange) {
        onSlideChange(slideNumber - 1);
      }
      setIsEditing(false);
      onEditingChange?.(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      onEditingChange?.(false);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    onEditingChange?.(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-30"
    >
      <div
        className="text-white text-lg font-medium px-6 py-3 bg-black/50 backdrop-blur-sm rounded-full whitespace-nowrap cursor-pointer hover:bg-black/70 transition-colors inline-flex items-center shadow-xl border border-white/20"
        onClick={handleSlideNumberClick}
        title="Cliquez pour aller à une slide spécifique"
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="w-12 bg-white text-primary text-center rounded px-1 outline-none"
            placeholder={String(currentSlide + 1)}
            style={{ minWidth: "3rem", width: "3rem" }}
          />
        ) : (
          <span
            style={{
              minWidth: "1.5rem",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            {currentSlide + 1}
          </span>
        )}{" "}
        / {totalSlides}
      </div>
    </motion.div>
  );
};
