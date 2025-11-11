"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote } from "lucide-react";

import { cn } from "@/lib/utils";

const MINIMAL_PARAGRAPH = "<p></p>";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

type ToolbarButtonConfig = {
  icon: typeof Bold;
  label: string;
  isActive: (editor: Editor) => boolean;
  command: (editor: Editor) => void;
};

const toolbarButtons: ToolbarButtonConfig[] = [
  {
    icon: Bold,
    label: "Bold",
    isActive: (editor) => editor.isActive("bold"),
    command: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    icon: Italic,
    label: "Italic ",
    isActive: (editor) => editor.isActive("italic"),
    command: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    icon: List,
    label: "Bullet slist",
    isActive: (editor) => editor.isActive("bulletList"),
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    icon: ListOrdered,
    label: "Ordered list",
    isActive: (editor) => editor.isActive("orderedList"),
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    icon: Quote,
    label: "Blockquote",
    isActive: (editor) => editor.isActive("blockquote"),
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
];

export function RichTextEditor({ value, onChange, disabled = false, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
    content: value || MINIMAL_PARAGRAPH,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value && value.trim().length > 0 ? value : MINIMAL_PARAGRAPH;

    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          const active = button.isActive(editor);

          return (
            <button
              key={button.label}
              type="button"
              onClick={() => button.command(editor)}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-transparent px-3 py-1.5 text-xs transition",
                active ? "border-blue-400/60 bg-blue-400/10 text-blue-200" : "text-zinc-300 hover:text-white",
                disabled && "cursor-not-allowed opacity-60",
              )}
              disabled={disabled}
              aria-label={button.label}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{button.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        {placeholder && !editor.getText().trim() ? (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-zinc-500">{placeholder}</span>
        ) : null}
        <EditorContent editor={editor} className={cn("rich-text-content", disabled && "opacity-60")}
        />
      </div>
    </div>
  );
}
