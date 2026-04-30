const STORAGE_KEY = "presenter_drafts";

export interface DraftModule {
  index: number;
  filename: string;
  markdown: string;
  updatedAt: string;
}

export interface DraftMetadata {
  displayName: string;
  description: string;
  type: string;
  level: string;
  estimatedDuration: string;
  tags: string[];
}

export interface Draft {
  id: string;
  createdAt: string;
  updatedAt: string;
  metadata: DraftMetadata;
  modules: DraftModule[];
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export const sanitizeId = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "") || "nouvelle_presentation";

const generateUniqueId = (name: string, existingIds: string[]): string => {
  const base = sanitizeId(name);
  if (!existingIds.includes(base)) return base;
  let counter = 2;
  while (existingIds.includes(`${base}_${counter}`)) counter++;
  return `${base}_${counter}`;
};

const moduleFilename = (index: number): string => {
  const padded = String(index).padStart(2, "0");
  return `${padded}_Module.md`;
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function loadDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Draft[];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: Draft[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// ─── CRUD drafts ─────────────────────────────────────────────────────────────

export function createDraft(name: string = "Nouvelle présentation"): Draft {
  const drafts = loadDrafts();
  const existingIds = drafts.map((d) => d.id);
  const id = generateUniqueId(name, existingIds);
  const now = new Date().toISOString();

  const draft: Draft = {
    id,
    createdAt: now,
    updatedAt: now,
    metadata: {
      displayName: name,
      description: "",
      type: "Formation",
      level: "Débutant",
      estimatedDuration: "1h",
      tags: [],
    },
    modules: [],
  };

  saveDrafts([...drafts, draft]);
  return draft;
}

export function getDraft(id: string): Draft | null {
  return loadDrafts().find((d) => d.id === id) ?? null;
}

export function updateDraftMetadata(
  id: string,
  metadata: Partial<DraftMetadata>,
): Draft | null {
  const drafts = loadDrafts();
  const index = drafts.findIndex((d) => d.id === id);
  if (index === -1) return null;

  drafts[index] = {
    ...drafts[index],
    metadata: { ...drafts[index].metadata, ...metadata },
    updatedAt: new Date().toISOString(),
  };

  saveDrafts(drafts);
  return drafts[index];
}

export function deleteDraft(id: string): void {
  saveDrafts(loadDrafts().filter((d) => d.id !== id));
}

export function duplicateDraft(id: string): Draft | null {
  const drafts = loadDrafts();
  const original = drafts.find((d) => d.id === id);
  if (!original) return null;

  const now = new Date();
  const dateLabel = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const nowIso = now.toISOString();

  const existingIds = drafts.map((d) => d.id);
  const newId = generateUniqueId(`${original.id}_copie`, existingIds);

  const copy: Draft = {
    ...original,
    id: newId,
    createdAt: nowIso,
    updatedAt: nowIso,
    metadata: {
      ...original.metadata,
      displayName: `${original.metadata.displayName} — Copie du ${dateLabel}`,
    },
    modules: original.modules.map((m) => ({ ...m, updatedAt: nowIso })),
  };

  saveDrafts([...drafts, copy]);
  return copy;
}

// ─── CRUD modules ─────────────────────────────────────────────────────────────

export function addModule(draftId: string): DraftModule | null {
  const drafts = loadDrafts();
  const draftIndex = drafts.findIndex((d) => d.id === draftId);
  if (draftIndex === -1) return null;

  const draft = drafts[draftIndex];
  const nextIndex =
    draft.modules.length > 0
      ? Math.max(...draft.modules.map((m) => m.index)) + 1
      : 1;

  const now = new Date().toISOString();
  const newModule: DraftModule = {
    index: nextIndex,
    filename: moduleFilename(nextIndex),
    markdown: `# Titre du module\n\nAjoutez votre contenu ici...\n\n## Section 1\n\n- Point 1\n- Point 2\n`,
    updatedAt: now,
  };

  draft.modules.push(newModule);
  draft.updatedAt = now;
  saveDrafts(drafts);
  return newModule;
}

export function updateModule(
  draftId: string,
  moduleIndex: number,
  markdown: string,
): DraftModule | null {
  const drafts = loadDrafts();
  const draftIdx = drafts.findIndex((d) => d.id === draftId);
  if (draftIdx === -1) return null;

  const moduleIdx = drafts[draftIdx].modules.findIndex(
    (m) => m.index === moduleIndex,
  );
  if (moduleIdx === -1) return null;

  const now = new Date().toISOString();
  drafts[draftIdx].modules[moduleIdx] = {
    ...drafts[draftIdx].modules[moduleIdx],
    markdown,
    updatedAt: now,
  };
  drafts[draftIdx].updatedAt = now;

  saveDrafts(drafts);
  return drafts[draftIdx].modules[moduleIdx];
}

export function deleteModule(draftId: string, moduleIndex: number): void {
  const drafts = loadDrafts();
  const draftIdx = drafts.findIndex((d) => d.id === draftId);
  if (draftIdx === -1) return;

  drafts[draftIdx].modules = drafts[draftIdx].modules.filter(
    (m) => m.index !== moduleIndex,
  );
  drafts[draftIdx].updatedAt = new Date().toISOString();
  saveDrafts(drafts);
}

export function reorderModules(draftId: string, orderedIndices: number[]): Draft | null {
  const drafts = loadDrafts();
  const draftIdx = drafts.findIndex((d) => d.id === draftId);
  if (draftIdx === -1) return null;

  const draft = drafts[draftIdx];
  const moduleMap = new Map(draft.modules.map((m) => [m.index, m]));

  // Rebuild with new sequential indices preserving content
  const reordered = orderedIndices.map((oldIdx, position) => {
    const mod = moduleMap.get(oldIdx);
    if (!mod) return null;
    const newIndex = position + 1;
    return {
      ...mod,
      index: newIndex,
      filename: `${String(newIndex).padStart(2, "0")}_Module.md`,
    };
  }).filter(Boolean) as typeof draft.modules;

  draft.modules = reordered;
  draft.updatedAt = new Date().toISOString();
  saveDrafts(drafts);
  return draft;
}

// ─── ZIP export ───────────────────────────────────────────────────────────────

export function buildZipData(draft: Draft): {
  metadataJson: string;
  planMarkdown: string;
  modules: Array<{ filename: string; content: string }>;
} {
  const metadata = {
    displayName: draft.metadata.displayName,
    description: draft.metadata.description,
    type: draft.metadata.type,
    tags: draft.metadata.tags,
    prerequisites: [],
    estimatedDuration: draft.metadata.estimatedDuration,
    level: draft.metadata.level,
  };

  const planMarkdown = `# Plan\n${draft.metadata.description}\n\nmodule: _\ndurée: 10min\n`;

  const sortedModules = [...draft.modules].sort((a, b) => a.index - b.index);

  const modules = sortedModules.map((m) => ({
    filename: m.filename,
    content: m.markdown,
  }));

  return {
    metadataJson: JSON.stringify(metadata, null, 2),
    planMarkdown,
    modules,
  };
}
