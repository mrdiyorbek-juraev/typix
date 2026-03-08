import type { MentionItem } from "@typix-editor/extension-mention";

export const MOCK_USERS: MentionItem[] = [
  {
    id: "1",
    name: "Alice Chen",
    data: {
      username: "@alice",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice",
    },
  },
  {
    id: "2",
    name: "Bob Smith",
    data: {
      username: "@bob",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob",
    },
  },
  {
    id: "3",
    name: "Charlie Park",
    data: {
      username: "@charlie",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie",
    },
  },
  {
    id: "4",
    name: "Diana Ross",
    data: {
      username: "@diana",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Diana",
    },
  },
  {
    id: "5",
    name: "Evan Li",
    data: {
      username: "@evan",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Evan",
    },
  },
  {
    id: "6",
    name: "Fiona Wu",
    data: {
      username: "@fiona",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Fiona",
    },
  },
];

export function searchMentions(query: string): MentionItem[] {
  const q = query.toLowerCase();
  return MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.data?.username as string)?.toLowerCase().includes(q),
  );
}
