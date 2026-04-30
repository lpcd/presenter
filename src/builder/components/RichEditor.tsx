/**
 * RichEditor — éditeur WYSIWYG Markdown via Milkdown Crepe.
 *
 * Fonctionnement :
 * - Milkdown Crepe gère nativement le Markdown (source de vérité = string .md).
 * - `onChange` est appelé à chaque modification via le listener `markdownUpdated`.
 * - `syncFromMarkdown` (handle exposé au parent) remplace le contenu via
 *   `editor.action(replaceAll(md))` — undo/redo natif ProseMirror inclus.
 */
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe } from "@milkdown/crepe";
import { replaceAll } from "@milkdown/kit/utils";

// Styles fonctionnels Crepe (toolbar, prosemirror, blocs, etc.)
import "@milkdown/crepe/theme/common/style.css";
// Variables de couleur du thème "classic" (overridées ci-dessous pour le dark mode)
import "@milkdown/crepe/theme/classic.css";

// ── Public handle exposed to parent ──────────────────────────────────────────
export interface RichEditorHandle {
  /** Force-update the editor when markdown changes externally */
  syncFromMarkdown: (md: string) => void;
  /** Kept for API compat with previous contenteditable implementation */
  getElement: () => HTMLDivElement | null;
}

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  height: string;
}

// ── Inner component (must be inside MilkdownProvider) ────────────────────────
const RichEditorInner = forwardRef<RichEditorHandle, RichEditorProps>(
  ({ value, onChange, height }, ref) => {
    const crepeRef = useRef<Crepe | null>(null);
    const onChangeRef = useRef(onChange);
    // When true, the next markdownUpdated event is ignored (external sync)
    const suppressNextRef = useRef(false);

    // Keep callback ref fresh without rebuilding the editor
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const { loading } = useEditor(
      useCallback(
        (root) => {
          const crepe = new Crepe({
            root,
            defaultValue: value,
          });

          crepe.on((api) => {
            api.markdownUpdated((_ctx, markdown) => {
              if (suppressNextRef.current) {
                suppressNextRef.current = false;
                return;
              }
              onChangeRef.current(markdown);
            });
          });

          crepeRef.current = crepe;
          return crepe;
        },
        // Editor created once — initial value from `value` at mount.
        // Subsequent external changes go through syncFromMarkdown.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
      ),
    );

    // ── Expose handle ───────────────────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        syncFromMarkdown: (md: string) => {
          const crepe = crepeRef.current;
          if (!crepe || loading) return;
          suppressNextRef.current = true;
          crepe.editor.action(replaceAll(md));
        },
        getElement: () => null,
      }),
      [loading],
    );

    return (
      // Outer: fixed height, overflow visible so floating-ui toolbars/tooltips
      // (position:absolute relative to .milkdown) are never clipped.
      // Scroll is handled by .ProseMirror itself via CSS.
      <div
        className="rich-editor-container w-full"
        style={{ height, minHeight: height, "--editor-height": height } as React.CSSProperties}
      >
        <div className="rich-editor-milkdown-root relative w-full h-full">
          <Milkdown />
        </div>
      </div>
    );
  },
);

RichEditorInner.displayName = "RichEditorInner";

// ── Public wrapper (provides the Milkdown context) ────────────────────────────
export const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(
  (props, ref) => (
    <MilkdownProvider>
      <RichEditorInner {...props} ref={ref} />
    </MilkdownProvider>
  ),
);

RichEditor.displayName = "RichEditor";
