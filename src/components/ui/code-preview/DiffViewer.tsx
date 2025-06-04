'use client';

import React from 'react';
import { DiffEditor, Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface DiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  language: string;
}

export function DiffViewer({ originalCode, modifiedCode, language }: DiffViewerProps) {
  const editorOptions: monaco.editor.IDiffEditorConstructionOptions = {
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: 'JetBrains Mono, monospace',
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none',
    padding: { top: 20, bottom: 20 },
    lineNumbers: 'on' as const,
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
    },
    renderSideBySide: false,
    readOnly: true,
  };

  const customTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '4caf50', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569cd6' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'class', foreground: '4ec9b0' },
      { token: 'function', foreground: 'dcdcaa' },
      { token: 'variable', foreground: '9cdcfe' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#6e7681',
      'editor.selectionBackground': '#264f78',
      'editor.lineHighlightBackground': '#1c2028',
      'editorCursor.foreground': '#569cd6',
      'editor.inactiveSelectionBackground': '#3a3d41',
      'diffEditor.insertedTextBackground': '#23863633',
      'diffEditor.removedTextBackground': '#da363333',
    },
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('custom-dark', customTheme);
    monaco.editor.setTheme('custom-dark');
  };

  return (
    <div className="w-full h-[600px] relative rounded-lg overflow-hidden bg-[#0d1117]">
      <DiffEditor
        height="100%"
        original={originalCode}
        modified={modifiedCode}
        language={language}
        theme="vs-dark"
        options={editorOptions}
        beforeMount={handleEditorWillMount}
        className="rounded-lg"
      />
    </div>
  );
} 