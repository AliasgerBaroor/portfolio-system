import { Bold, Code, Italic, List, ListOrdered, Quote, Redo2, Strikethrough, UnderlineIcon, Undo2, Link } from "lucide-react";
import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const activeEditor = editor;

  const buttonClass = (active: boolean) =>
    [
      "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
      active
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted",
    ].join(" ");

  function setLink() {
    const previousUrl = activeEditor.getAttributes("link").href as
      | string
      | undefined;

    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      activeEditor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();
      return;
    }

    activeEditor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-background p-2">
      <button
        type="button"
        title="Bold"
        aria-label="Bold"
        className={buttonClass(activeEditor.isActive("bold"))}
        onClick={() => activeEditor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        title="Italic"
        aria-label="Italic"
        className={buttonClass(activeEditor.isActive("italic"))}
        onClick={() => activeEditor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </button>

      <button
        type="button"
        title="Underline"
        aria-label="Underline"
        className={buttonClass(activeEditor.isActive("underline"))}
        onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </button>

      <button
        type="button"
        title="Strikethrough"
        aria-label="Strikethrough"
        className={buttonClass(activeEditor.isActive("strike"))}
        onClick={() => activeEditor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </button>

      <span className="mx-1 h-5 border-l border-border" />

      <select
        aria-label="Text style"
        className="h-8 rounded-md border border-border bg-background px-2 text-sm"
        value={
          activeEditor.isActive("heading", { level: 1 }) ? "h1" :
            activeEditor.isActive("heading", { level: 2 }) ? "h2" :
              activeEditor.isActive("heading", { level: 3 }) ? "h3" : "paragraph"
        }
        onChange={(event) => {
          const value = event.target.value;
          if (value === "paragraph") {
            activeEditor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({
                level: Number(value.slice(1)) as 1 | 2 | 3,
              })
              .run();
          }
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <button
        type="button"
        title="Bullet list"
        aria-label="Bullet list"
        className={buttonClass(activeEditor.isActive("bulletList"))}
        onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </button>

      <button
        type="button"
        title="Numbered list"
        aria-label="Numbered list"
        className={buttonClass(activeEditor.isActive("orderedList"))}
        onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </button>

      <button
        type="button"
        title="Blockquote"
        aria-label="Blockquote"
        className={buttonClass(activeEditor.isActive("blockquote"))}
        onClick={() => activeEditor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </button>

      <button
        type="button"
        title="Inline code"
        aria-label="Inline code"
        className={buttonClass(activeEditor.isActive("code"))}
        onClick={() => activeEditor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </button>

      <button
        type="button"
        title="Link"
        aria-label="Link"
        className={buttonClass(activeEditor.isActive("link"))}
        onClick={setLink}
      >
        <Link size={16} />
      </button>

      <span className="mx-1 h-5 border-l border-border" />

      <button
        type="button"
        title="Undo"
        aria-label="Undo"
        disabled={!activeEditor.can().undo()}
        className={buttonClass(false)}
        onClick={() => activeEditor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </button>

      <button
        type="button"
        title="Redo"
        aria-label="Redo"
        disabled={!activeEditor.can().redo()}
        className={buttonClass(false)}
        onClick={() => activeEditor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
}