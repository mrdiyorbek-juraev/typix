# @typix-editor/mention

A flexible, headless mention extension for Typix/Lexical editors. Add @mentions, #hashtags, or any custom trigger-based mentions to your editor with full control over the UI and behavior.

## Features

- 🎯 **Customizable triggers** - Use `@`, `#`, or any character(s) as mention triggers
- 🔍 **Flexible search** - Bring your own search function (sync or async)
- 🎨 **Headless UI** - Full control over menu and item rendering
- ⚡ **Debounced search** - Built-in debouncing to optimize API calls
- 📦 **Rich data support** - Attach any metadata to mentions
- ♿ **Accessible** - Keyboard navigation and ARIA attributes included
- 🔧 **Highly configurable** - Customize every aspect of the mention behavior

## Installation

```bash
# npm
npm install @typix-editor/mention

# pnpm
pnpm add @typix-editor/mention

# yarn
yarn add @typix-editor/mention
```

## Quick Start

### 1. Register the MentionNode

```tsx
import { MentionNode } from '@typix-editor/mention';

const editorConfig = {
  nodes: [MentionNode, /* other nodes */],
  // ... other config
};
```

### 2. Add the MentionExtension

```tsx
import { MentionExtension } from '@typix-editor/mention';

function MyEditor() {
  const searchUsers = async (query: string) => {
    const response = await fetch(`/api/users?q=${query}`);
    const users = await response.json();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      data: { avatar: user.avatar, email: user.email }
    }));
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin /* ... */ />
      <MentionExtension
        onSearch={searchUsers}
        onSelect={(item) => console.log('Selected:', item)}
      />
    </LexicalComposer>
  );
}
```

## API Reference

### MentionExtension Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSearch` | `(query: string, trigger: string) => Promise<MentionItem[]> \| MentionItem[]` | **Required** | Function to search for mention suggestions |
| `onSelect` | `(item: MentionItem) => void` | - | Callback when a mention is selected |
| `onMenuOpen` | `() => void` | - | Callback when the mention menu opens |
| `onMenuClose` | `() => void` | - | Callback when the mention menu closes |
| `triggerConfig` | `MentionTriggerConfig` | `{ trigger: '@' }` | Trigger configuration |
| `nodeConfig` | `MentionNodeConfig` | `{}` | Node appearance configuration |
| `maxSuggestions` | `number` | `10` | Maximum number of suggestions to display |
| `debounceMs` | `number` | `200` | Debounce delay for search requests |
| `renderMenu` | `(props: MentionMenuProps) => JSX.Element` | - | Custom menu renderer |
| `renderMenuItem` | `(props: MentionMenuItemProps) => ReactNode` | - | Custom menu item renderer |
| `loadingContent` | `ReactNode` | `"Loading..."` | Content shown while loading |
| `emptyContent` | `ReactNode` | - | Content shown when no results found |
| `menuClassName` | `string` | - | Additional CSS class for the menu |
| `menuPortalTarget` | `HTMLElement` | - | Portal target for the menu |
| `disabled` | `boolean` | `false` | Disable the extension |

### MentionItem

```typescript
interface MentionItem {
  id: string;           // Unique identifier
  name: string;         // Display name
  data?: Record<string, unknown>; // Optional metadata
}
```

### MentionTriggerConfig

```typescript
interface MentionTriggerConfig {
  trigger?: string;      // Trigger character(s), default: '@'
  minLength?: number;    // Min chars before searching, default: 0
  maxLength?: number;    // Max query length, default: 75
  allowSpaces?: boolean; // Allow spaces in query, default: true
}
```

### MentionNodeConfig

```typescript
interface MentionNodeConfig {
  className?: string;      // CSS class for mention nodes
  style?: string;          // Inline styles
  includeTrigger?: boolean; // Include trigger in display text, default: true
}
```

## Examples

### Basic Usage with Local Data

```tsx
import { MentionExtension, MentionNode } from '@typix-editor/mention';

const users = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' },
];

function Editor() {
  const handleSearch = (query: string) => {
    return users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <LexicalComposer initialConfig={{ nodes: [MentionNode] }}>
      <MentionExtension onSearch={handleSearch} />
    </LexicalComposer>
  );
}
```

### Async Search with API

```tsx
function Editor() {
  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  };

  return (
    <MentionExtension
      onSearch={handleSearch}
      debounceMs={300}
      maxSuggestions={5}
    />
  );
}
```

### Multiple Trigger Types

```tsx
function Editor() {
  return (
    <>
      {/* User mentions with @ */}
      <MentionExtension
        onSearch={searchUsers}
        triggerConfig={{ trigger: '@' }}
      />

      {/* Hashtags with # */}
      <MentionExtension
        onSearch={searchTags}
        triggerConfig={{ trigger: '#', allowSpaces: false }}
      />

      {/* Channel mentions with # */}
      <MentionExtension
        onSearch={searchChannels}
        triggerConfig={{ trigger: '/' }}
      />
    </>
  );
}
```

### Custom Menu Rendering

```tsx
import { MentionExtension, MentionMenuProps } from '@typix-editor/mention';

function CustomMenu({ items, selectedIndex, onSelectItem, onHighlightItem }: MentionMenuProps) {
  return (
    <div className="custom-mention-menu">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`custom-item ${selectedIndex === index ? 'selected' : ''}`}
          onClick={() => onSelectItem(index)}
          onMouseEnter={() => onHighlightItem(index)}
        >
          <img src={item.data?.avatar as string} alt="" />
          <span>{item.name}</span>
          <span className="email">{item.data?.email as string}</span>
        </div>
      ))}
    </div>
  );
}

function Editor() {
  return (
    <MentionExtension
      onSearch={searchUsers}
      renderMenu={(props) => <CustomMenu {...props} />}
    />
  );
}
```

### Custom Menu Item Rendering

```tsx
import { MentionExtension, MentionMenuItemProps } from '@typix-editor/mention';

function CustomMenuItem({ item, isSelected, onClick, onMouseEnter }: MentionMenuItemProps) {
  return (
    <div
      className={`user-item ${isSelected ? 'active' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.data?.avatar as string}
        alt={item.name}
        className="avatar"
      />
      <div className="user-info">
        <span className="name">{item.name}</span>
        <span className="role">{item.data?.role as string}</span>
      </div>
    </div>
  );
}

function Editor() {
  return (
    <MentionExtension
      onSearch={searchUsers}
      renderMenuItem={(props) => <CustomMenuItem {...props} />}
    />
  );
}
```

### Configure Node Appearance

```tsx
import { configureMentionNode, MentionExtension, MentionNode } from '@typix-editor/mention';

// Configure before creating the editor
configureMentionNode({
  className: 'my-mention',
  style: 'color: blue; font-weight: bold;',
  includeTrigger: true,
});

function Editor() {
  return (
    <LexicalComposer initialConfig={{ nodes: [MentionNode] }}>
      <MentionExtension onSearch={searchUsers} />
    </LexicalComposer>
  );
}
```

### With Loading and Empty States

```tsx
function Editor() {
  return (
    <MentionExtension
      onSearch={searchUsers}
      loadingContent={
        <div className="loading">
          <Spinner /> Searching...
        </div>
      }
      emptyContent={
        <div className="empty">
          No users found. Try a different search.
        </div>
      }
    />
  );
}
```

### Handling Selection

```tsx
function Editor() {
  const handleSelect = (item: MentionItem) => {
    console.log('Selected mention:', item);

    // Track analytics
    analytics.track('mention_selected', {
      userId: item.id,
      userName: item.name,
    });

    // Notify other users
    if (item.data?.notifyOnMention) {
      sendNotification(item.id, 'You were mentioned!');
    }
  };

  return (
    <MentionExtension
      onSearch={searchUsers}
      onSelect={handleSelect}
      onMenuOpen={() => console.log('Menu opened')}
      onMenuClose={() => console.log('Menu closed')}
    />
  );
}
```

## Working with MentionNode

### Creating Mentions Programmatically

```tsx
import { $createMentionNode, $isMentionNode } from '@typix-editor/mention';

// Inside an editor.update() callback
editor.update(() => {
  const mention = $createMentionNode({
    id: 'user-123',
    name: 'John Doe',
    trigger: '@',
    data: { avatar: '/avatars/john.jpg' }
  });

  // Insert at selection
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    selection.insertNodes([mention]);
  }
});
```

### Reading Mention Data

```tsx
import { $isMentionNode } from '@typix-editor/mention';

editor.getEditorState().read(() => {
  const nodes = $getRoot().getAllTextNodes();

  nodes.forEach(node => {
    if ($isMentionNode(node)) {
      console.log('Mention ID:', node.getMentionId());
      console.log('Mention Name:', node.getMentionName());
      console.log('Mention Trigger:', node.getMentionTrigger());
      console.log('Mention Data:', node.getMentionData());
    }
  });
});
```

### Extracting All Mentions

```tsx
function extractMentions(editorState: EditorState): MentionItem[] {
  const mentions: MentionItem[] = [];

  editorState.read(() => {
    const root = $getRoot();
    const textNodes = root.getAllTextNodes();

    textNodes.forEach(node => {
      if ($isMentionNode(node)) {
        mentions.push({
          id: node.getMentionId(),
          name: node.getMentionName(),
          data: node.getMentionData(),
        });
      }
    });
  });

  return mentions;
}
```

## Styling

The extension uses BEM-style class names for easy styling:

```css
/* Menu container */
.typix-mention-menu {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

/* Menu list */
.typix-mention-menu-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

/* Menu item */
.typix-mention-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.typix-mention-menu-item:hover,
.typix-mention-menu-item--selected {
  background: #f0f0f0;
}

/* Item name */
.typix-mention-menu-item-name {
  font-weight: 500;
}

/* Loading state */
.typix-mention-menu-loading {
  padding: 12px;
  color: #666;
  text-align: center;
}

/* Empty state */
.typix-mention-menu-empty {
  padding: 12px;
  color: #999;
  text-align: center;
}

/* Mention node in editor */
.typix-mention {
  background-color: rgba(24, 119, 232, 0.15);
  border-radius: 4px;
  padding: 2px 4px;
  color: #1877e8;
  cursor: pointer;
}

.typix-mention:hover {
  background-color: rgba(24, 119, 232, 0.25);
}
```

## Serialization

Mentions are automatically serialized to JSON format:

```json
{
  "type": "mention",
  "mentionId": "user-123",
  "mentionName": "John Doe",
  "mentionTrigger": "@",
  "mentionData": {
    "avatar": "/avatars/john.jpg",
    "email": "john@example.com"
  },
  "text": "@John Doe"
}
```

## HTML Export

When exporting to HTML, mentions become `<span>` elements with data attributes:

```html
<span
  class="typix-mention"
  data-typix-mention="true"
  data-typix-mention-id="user-123"
  data-typix-mention-name="John Doe"
  data-typix-mention-trigger="@"
  data-typix-mention-data='{"avatar":"/avatars/john.jpg"}'
>@John Doe</span>
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  MentionItem,
  MentionMenuProps,
  MentionMenuItemProps,
  MentionTriggerConfig,
  MentionNodeConfig,
  MentionSearchFn,
  MentionExtensionProps,
  SerializedMentionNode,
  CreateMentionNodeParams,
} from '@typix-editor/mention';
```

## License

MIT
