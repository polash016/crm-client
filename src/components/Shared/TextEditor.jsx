"use client";

import { Suspense, useMemo } from "react";

import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const TextEditor = ({ content, setContent }) => {
  const config = useMemo(() => ({
    minHeight: 500,
    readonly: false,
    placeholder: "Start typing here...",
    autofocus: true,
    spellcheck: true,
    iframe: true,
    toolbarSticky: false,
    saveHeightInStorage: true,
    saveModeInStorage: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "eraser", // Basic formatting
      "ul",
      "ol",
      // "font",
      "fontsize",
      "paragraph", // List and font options
      "lineHeight",
      "superscript",
      "subscript", // Line height and text modifications
      "file",
      "image",
      "video",
      "spellcheck", // Media and spellcheck
      "speechRecognize",
      "cut",
      "copy",
      "paste",
      "selectall", // Clipboard actions
      "copyformat",
      "hr",
      "table",
      "link",
      "symbols", // Formatting tools
      "indent",
      "outdent", // AI commands and indentation
      "left",
      "brush",
      "undo",
      "redo",
      "find", // Alignment, undo/redo, and search
      "source",
      "fullsize",
      "preview",
    ],
  }));

  return (
    <Suspense fallback={<div>Editor loading...</div>}>
      <JoditEditor
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => setContent(newContent)}
      />
    </Suspense>
  );
};

export default TextEditor;
