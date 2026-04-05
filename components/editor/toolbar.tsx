'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Type,
  LineChart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ToolbarProps {
  editor: Editor | null
}

const textColors = [
  { name: 'Default', value: '' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
]

const highlightColors = [
  { name: 'None', value: '' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Pink', value: '#fbcfe8' },
]

const lineHeights = [
  { name: 'Compact', value: '1.2' },
  { name: 'Normal', value: '1.5' },
  { name: 'Relaxed', value: '1.75' },
  { name: 'Loose', value: '2' },
]

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-2">
      {/* Text Structure */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'bg-secondary' : ''}
          title="Paragraph"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-secondary' : ''}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-secondary' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-secondary' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-secondary' : ''}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Color & Highlight */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Text Color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-1">
              {textColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    color.value
                      ? editor.chain().focus().setColor(color.value).run()
                      : editor.chain().focus().unsetColor().run()
                  }
                  className="h-6 w-6 rounded border border-border"
                  style={{ backgroundColor: color.value || 'var(--foreground)' }}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" title="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-3 gap-1">
              {highlightColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    color.value
                      ? editor.chain().focus().toggleHighlight({ color: color.value }).run()
                      : editor.chain().focus().unsetHighlight().run()
                  }
                  className="h-6 w-6 rounded border border-border"
                  style={{ backgroundColor: color.value || 'transparent' }}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-secondary' : ''}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-secondary' : ''}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-secondary' : ''}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'bg-secondary' : ''}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      {/* Line Height */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <Select
          onValueChange={(value) => editor.chain().focus().setLineHeight(value).run()}
          defaultValue="1.5"
        >
          <SelectTrigger className="h-8 w-24">
            <LineChart className="mr-1 h-3 w-3" />
            <SelectValue placeholder="Line Height" />
          </SelectTrigger>
          <SelectContent>
            {lineHeights.map((lh) => (
              <SelectItem key={lh.value} value={lh.value}>
                {lh.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blocks */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-secondary' : ''}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-secondary' : ''}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
