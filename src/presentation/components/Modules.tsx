import { motion } from "framer-motion";
import { InlineMarkdown } from "../subpages/presentationMode/components/InlineMarkdown";

interface ModuleItem {
  id: number;
  title: string;
  description: string;
  link?: string;
  duration?: string;
  topics?: string[];
  moduleText?: string;
  optional?: boolean;
}

interface ModulesProps {
  modules?: ModuleItem[];
}

const defaultModules: ModuleItem[] = [];

const Modules = ({ modules = defaultModules }: ModulesProps) => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 bg-brand-page min-h-screen flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12 text-brand-text text-center"
      >
        Modules
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full">
        {modules.map((module, index) => {
          const Wrapper = module.link ? motion.a : motion.div;
          const wrapperProps = module.link ? { href: module.link } : {};

          return (
            <Wrapper
              key={module.id}
              {...wrapperProps}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-surface rounded-2xl p-6 sm:p-8 shadow-md border-t-4 focus-within:ring-4 focus-within:ring-primary/20 ${
                module.optional ? "border-border opacity-75" : "border-primary"
              } ${
                module.link
                  ? "cursor-pointer hover:shadow-xl transition-shadow"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: index * 0.05 + 0.1 }}
                  className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br text-white text-xl sm:text-2xl font-bold rounded-xl ${
                    module.optional
                      ? "from-surface-strong to-border"
                      : "from-primary to-primary-dark"
                  }`}
                >
                  {module.moduleText ? <>{module.moduleText}</> : module.id}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-xl sm:text-2xl font-semibold mb-1 line-clamp-2 ${
                      module.optional ? "text-brand-muted" : "text-brand-text"
                    }`}
                  >
                    <InlineMarkdown content={module.title} />
                  </h3>
                  {module.optional && (
                    <p className="text-xs sm:text-sm italic text-brand-subtle">
                      Facultatif
                    </p>
                  )}
                </div>
                {module.duration &&
                  module.duration !== "0" &&
                  module.duration !== "0min" && (
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        module.optional ? "text-brand-subtle" : "text-primary"
                      }`}
                    >
                      ⏱️ {module.duration}
                    </p>
                  )}
              </div>
              <div
                className={`text-sm sm:text-base leading-relaxed mb-3 ${
                  module.optional ? "text-brand-subtle" : "text-brand-muted"
                }`}
              >
                <InlineMarkdown content={module.description} />
              </div>
              {module.topics && module.topics.length > 0 && (
                <ul className="text-xs sm:text-sm text-brand-subtle list-disc list-inside space-y-1">
                  {module.topics.length > 5 ? (
                    <>
                      {module.topics.slice(0, 4).map((topic, idx) => (
                        <li key={idx}>
                          <InlineMarkdown content={topic} />
                        </li>
                      ))}
                      <li className="text-brand-subtle">...</li>
                      <li key={module.topics.length - 1}>
                        <InlineMarkdown
                          content={module.topics[module.topics.length - 1]}
                        />
                      </li>
                    </>
                  ) : (
                    module.topics.map((topic, idx) => (
                      <li key={idx}>
                        <InlineMarkdown content={topic} />
                      </li>
                    ))
                  )}
                </ul>
              )}
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
};

export default Modules;
