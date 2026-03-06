"use client";

import { Separator } from "@/components/ui/separator";
import { HistoryGroup } from "./groups/history-group";
import { TextFormatGroup } from "./groups/text-format-group";
import { TextExtrasGroup } from "./groups/text-extras-group";
import { HeadingGroup } from "./groups/heading-group";
import { ListGroup } from "./groups/list-group";
import { BlockGroup } from "./groups/block-group";
import { InsertGroup } from "./groups/insert-group";
import { AlignmentGroup } from "./groups/alignment-group";
import { LinkGroup } from "./groups/link-group";
import { SpeechGroup } from "./groups/speech-group";
import { FontSizeGroup } from "./groups/font-size-group";
import { FontFamilyGroup } from "./groups/font-family-group";

function ToolbarSeparator() {
  return <Separator orientation="vertical" className="mx-0.5 h-4" />;
}

export function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
      <HistoryGroup />
      <ToolbarSeparator />
      <FontFamilyGroup />
      <ToolbarSeparator />
      <FontSizeGroup />
      <ToolbarSeparator />
      <TextFormatGroup />
      <ToolbarSeparator />
      <TextExtrasGroup />
      <ToolbarSeparator />
      <HeadingGroup />
      <ToolbarSeparator />
      <ListGroup />
      <ToolbarSeparator />
      <BlockGroup />
      <ToolbarSeparator />
      <InsertGroup />
      <ToolbarSeparator />
      <AlignmentGroup />
      <ToolbarSeparator />
      <LinkGroup />
      <ToolbarSeparator />
      <SpeechGroup />
    </div>
  );
}
