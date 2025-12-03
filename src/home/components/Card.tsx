import { motion } from "framer-motion";
import { BookOpen, Clock, Award } from "lucide-react";
import { InlineMarkdown } from "../../presentation/subpages/presentationMode/components/InlineMarkdown";

interface CardProps {
  id: string;
  name: string;
  description: string;
  duration: string;
  level: string;
  type: string;
  tags: string[];
  link: string;
  colorGradient?: {
    from: string;
    via: string;
    to: string;
  };
}

const Card = ({
  name,
  description,
  duration,
  level,
  type,
  tags,
  link,
  colorGradient = {
    from: "from-primary",
    via: "via-primary-dark",
    to: "to-secondary",
  },
}: CardProps) => {
  return (
    <motion.a
      href={link}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden group"
    >
      <div
        className={`h-32 bg-gradient-to-br ${colorGradient.from} ${colorGradient.via} ${colorGradient.to} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        <div className="absolute bottom-4 left-6 right-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            <InlineMarkdown content={name} />
          </h3>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <p className="text-gray-600 mb-4 line-clamp-2">
          <InlineMarkdown content={description} />
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-primary" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Award size={16} className="text-primary" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen size={16} className="text-primary" />
            <span>{type}</span>
          </div>
        </div>

        <div className="flex-1 mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                <InlineMarkdown content={tag} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default Card;
