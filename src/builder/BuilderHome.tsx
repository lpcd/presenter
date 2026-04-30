import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, ArrowLeft, FileText, Sparkles } from "lucide-react";
import { loadDrafts, createDraft } from "./builderStorage";
import { seedDemoData } from "./seedDrafts";
import { DraftCard } from "./components/DraftCard";
import { DeleteModal } from "./components/DeleteModal";
import { ThemeToggle } from "../components/ThemeToggle";

const BuilderHome = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState(() => loadDrafts());
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);

  // Sort by most recently updated — memoized to avoid sort on every render
  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [drafts],
  );

  const handleNewDraft = () => {
    const draft = createDraft();
    navigate(`/builder/${draft.id}`);
  };

  const handleSeedDemos = () => {
    if (drafts.length > 0) {
      setShowSeedConfirm(true);
    } else {
      seedDemoData();
      setDrafts(loadDrafts());
    }
  };

  const confirmSeedDemos = () => {
    seedDemoData();
    setDrafts(loadDrafts());
    setShowSeedConfirm(false);
  };

  // Refresh from storage (e.g. after returning from detail page)
  const refresh = () => setDrafts(loadDrafts());

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-page via-surface to-brand-page p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="bg-surface border border-border-subtle rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-text">
                Mes ébauches
              </h1>
              <p className="text-brand-muted text-sm sm:text-base mt-1">
                Gérez vos formations en cours de rédaction.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface-muted text-brand-text hover:bg-surface-strong transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Accueil
              </Link>
              <ThemeToggle />
              {drafts.length > 0 && (
                <button
                  onClick={handleSeedDemos}
                  title="Ajouter des ébauches de démonstration"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface-muted text-brand-text hover:bg-surface-strong transition-colors text-sm"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">Exemples</span>
                </button>
              )}
              <button
                onClick={handleNewDraft}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Nouvelle ébauche
              </button>
            </div>
          </div>
        </header>

        {/* Draft list */}
        {drafts.length === 0 ? (
          <div
            className="bg-surface border border-border-subtle border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4"
            onFocus={refresh}
          >
            <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center">
              <FileText size={28} className="text-brand-subtle" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-brand-text">
                Aucune ébauche
              </h2>
              <p className="text-brand-muted text-sm mt-1">
                Créez votre première formation en cliquant sur "Nouvelle
                ébauche".
              </p>
            </div>
            <button
              onClick={handleNewDraft}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Nouvelle ébauche
            </button>
            <button
              onClick={handleSeedDemos}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface-muted text-brand-text hover:bg-surface-strong transition-colors text-sm font-medium"
            >
              <Sparkles size={16} />
              Charger les exemples
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {sortedDrafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} onDuplicated={refresh} />
            ))}

            {/* Add new card */}
            <button
              onClick={handleNewDraft}
              className="flex flex-col items-center justify-center gap-3 bg-surface border border-border-subtle border-dashed rounded-2xl p-8 hover:border-primary/40 hover:bg-surface-muted transition-all duration-200 text-brand-muted hover:text-primary"
            >
              <Plus size={24} />
              <span className="text-sm font-medium">Nouvelle ébauche</span>
            </button>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={showSeedConfirm}
        title="Charger les exemples ?"
        description={`Vous avez déjà ${drafts.length} ébauche${drafts.length > 1 ? "s" : ""}. Les exemples seront ajoutés à côté de vos ébauches existantes (aucune suppression).`}
        confirmLabel="Ajouter les exemples"
        onConfirm={confirmSeedDemos}
        onCancel={() => setShowSeedConfirm(false)}
      />
    </div>
  );
};

export default BuilderHome;
