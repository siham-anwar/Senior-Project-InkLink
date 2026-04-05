'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { LineHeight } from '@/lib/tiptap/line-height'
import { Toolbar } from './toolbar'

interface TiptapEditorProps {
  ydoc: Y.Doc
}

export function TiptapEditor({ ydoc }: TiptapEditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable history since we're using Yjs
        history: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LineHeight,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[400px] focus:outline-none p-4',
      },
    },
    immediatelyRender: false,
  })

  return (
    <div className="flex flex-col gap-4">
      <Toolbar editor={editor} />
      <div className="min-h-[400px] rounded-lg border border-border bg-input">
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.67em 0;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.83em 0;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: 600;
          margin: 1em 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--border);
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: var(--muted-foreground);
        }
        .ProseMirror pre {
          background: var(--secondary);
          border-radius: 0.5rem;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }
        .ProseMirror code {
          font-family: var(--font-mono);
          font-size: 0.9em;
        }
      `}</style>
    </div>
  )
}
