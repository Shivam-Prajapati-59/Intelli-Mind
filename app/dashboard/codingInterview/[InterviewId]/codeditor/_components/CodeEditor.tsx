"use client";

import { useEffect, useRef, useMemo } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { foldGutter } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { defaultKeymap } from "@codemirror/commands";
import { useTheme } from "next-themes";

const languageExtensions = {
  java: java(),
  cpp: cpp(),
};

interface CodeEditorProps {
  language: "java" | "cpp";
  code: string;
  onChange: (code: string) => void;
  editorViewRef?: React.MutableRefObject<EditorView | null>;
  settings?: {
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
  };
}

const defaultSettings = {
  fontSize: 14,
  fontFamily: "monospace",
  lineHeight: 1.5,
};

export default function CodeEditor({
  language,
  code,
  onChange,
  editorViewRef: externalEditorViewRef,
  settings: userSettings,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const internalEditorViewRef = useRef<EditorView | null>(null);
  const editorViewRef = externalEditorViewRef || internalEditorViewRef;
  const { theme } = useTheme();
  const previousCodeRef = useRef(code);

  // Memoize the settings so that the object reference doesn't change on every render.
  const settings = useMemo(
    () => ({
      ...defaultSettings,
      ...userSettings,
    }),
    [userSettings]
  );

  // Handle external code updates (if the parent updates the `code` prop)
  useEffect(() => {
    if (editorViewRef.current && code !== previousCodeRef.current) {
      const currentCursor = editorViewRef.current.state.selection.main;
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: code,
        },
        selection: { anchor: Math.min(currentCursor.anchor, code.length) },
      });
      previousCodeRef.current = code;
    }
  }, [code, editorViewRef]);

  // Create and configure the editor instance.
  useEffect(() => {
    if (!editorRef.current) return;

    // If an editor already exists, destroy it.
    if (editorViewRef.current) {
      editorViewRef.current.destroy();
      editorViewRef.current = null;
    }

    try {
      const state = EditorState.create({
        doc: code,
        extensions: [
          basicSetup,
          languageExtensions[language],
          foldGutter(),
          EditorView.lineWrapping,
          history(),
          bracketMatching(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorState.allowMultipleSelections.of(true),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newCode = update.state.doc.toString();
              previousCodeRef.current = newCode;
              onChange(newCode);
            }
          }),
          EditorView.theme({
            "&": {
              height: "400px",
              fontSize: `${settings.fontSize}px`,
              fontFamily: settings.fontFamily,
              lineHeight: settings.lineHeight,
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              color: theme === "dark" ? "#d4d4d4" : "#000000",
            },
            ".cm-scroller": {
              overflow: "auto",
              maxHeight: "400px",
            },
            ".cm-gutters": {
              backgroundColor: theme === "dark" ? "#2e2e2e" : "#f5f5f5",
              borderRight: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
            },
            ".cm-activeLineGutter": {
              backgroundColor: theme === "dark" ? "#3e3e3e" : "#e5e5e5",
            },
            ".cm-matchingBracket": {
              backgroundColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
              outline: "1px solid #999",
            },
            ".cm-line": {
              padding: "0 4px",
            },
            ".cm-cursor": {
              borderLeft: `2px solid ${theme === "dark" ? "#fff" : "#000"}`,
            },
            ".cm-activeLine": {
              backgroundColor: theme === "dark" ? "#262626" : "#f8f8f8",
            },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      editorViewRef.current = view;
      previousCodeRef.current = code;
    } catch (error) {
      console.error("Error initializing CodeMirror:", error);
    }

    // Cleanup the editor on component unmount.
    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [language, theme, onChange, settings, editorViewRef]);

  return (
    <div className="w-full">
      <div ref={editorRef} className="border rounded-lg overflow-hidden" />
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>Tip: Use Ctrl+Q to fold/unfold code blocks</p>
        <p>Tip: Use Ctrl+Z for undo and Ctrl+Y for redo</p>
      </div>
    </div>
  );
}
