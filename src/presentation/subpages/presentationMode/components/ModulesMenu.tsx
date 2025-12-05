import { motion, AnimatePresence } from "framer-motion";

interface ModulesMenuProps {
  show: boolean;
  onClose: () => void;
  allModules: Array<{
    id: number;
    title: string;
    description: string;
    filename: string;
    duration: string;
    topics: string[];
  }>;
  currentModuleIndex: number;
  onNavigateToModule: (filename: string) => void;
}

export const ModulesMenu = ({
  show,
  onClose,
  allModules,
  currentModuleIndex,
  onNavigateToModule,
}: ModulesMenuProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed left-20 top-0 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 z-50 max-w-md w-64 max-h-[60vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Modules</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {allModules.map((module, index) => (
              <button
                key={module.id}
                onClick={() => onNavigateToModule(module.filename)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  index === currentModuleIndex
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="font-medium">{module.title}</div>
                <div className="text-xs opacity-75">{module.duration}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
