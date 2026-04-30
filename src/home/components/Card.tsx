import { motion } from "framer-motion";
import { BookOpen, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
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
  moduleText?: string;
  colorGradient?: {
    from: string;
    via: string;
    to: string;
  };
}

const MotionLink = motion(Link);

const Card = ({
  name,
  description,
  duration,
  level,
  type,
  tags,
  link,
  moduleText,
  colorGradient = {
    from: "from-brand-gradient-1-from",
    via: "via-brand-gradient-1-via",
    to: "to-brand-gradient-1-to",
  },
}: CardProps) => {
  return (
    <MotionLink
      to={link}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-surface rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden group border border-border-subtle"
    >
      <div
        className={`h-32 bg-gradient-to-br ${colorGradient.from} ${colorGradient.via} ${colorGradient.to} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        <div className="absolute bottom-4 left-6 right-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            <InlineMarkdown content={moduleText || name} />
          </h3>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <p className="text-brand-muted mb-4 line-clamp-2">
          <InlineMarkdown content={description} />
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-brand-subtle">
            <Clock size={16} className="text-primary" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-subtle">
            <Award size={16} className="text-primary" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-subtle">
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
    </MotionLink>
  );
};

export default Card;
