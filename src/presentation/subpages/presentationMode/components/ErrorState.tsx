import { ChevronLeft, FileText } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
        <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
        >
          <ChevronLeft size={20} />
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};
