import { AlertCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-page via-surface-strong to-brand-page px-4">
      <div className="max-w-md w-full bg-surface rounded-3xl p-8 sm:p-12 shadow-2xl text-center border border-border-subtle">
        <AlertCircle className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-brand-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-brand-muted mb-4">
          Page non trouvée
        </h2>
        <p className="text-brand-muted mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-primary/50"
        >
          <Home size={24} />
          <span>Retour à l'accueil</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
