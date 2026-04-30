import { ChevronLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
      <div className="max-w-md w-full bg-surface rounded-2xl p-8 shadow-lg text-center border border-border-subtle">
        <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-brand-text mb-4">Erreur</h1>
        <p className="text-brand-muted mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
        >
          <ChevronLeft size={20} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};
