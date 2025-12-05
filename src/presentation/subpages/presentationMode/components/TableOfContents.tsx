import { motion, AnimatePresence } from "framer-motion";

interface TableOfContentsProps {
  show: boolean;
  onClose: () => void;
  sections: Array<{
    heading: string;
    content: string;
    level: number;
  }>;
  currentSlide: number;
  onGoToSlide: (index: number) => void;
}

export const TableOfContents = ({
  show,
  onClose,
  sections,
  currentSlide,
  onGoToSlide,
}: TableOfContentsProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed left-20 top-0 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 z-50 max-w-md w-96 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Plan</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  onGoToSlide(index + 1);
                  onClose();
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentSlide === index + 1
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div
                  className={`${
                    section.level === 2
                      ? "font-semibold"
                      : section.level === 3
                      ? "ml-2"
                      : "ml-4 text-sm"
                  }`}
                >
                  {section.heading}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
