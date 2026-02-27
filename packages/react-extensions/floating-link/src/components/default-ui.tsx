import type { JSX } from "react";
import * as React from "react";
import { sanitizeUrl } from "../lib";
import type { FloatingLinkRenderProps } from "../ui/types";
import {
  CheckIcon,
  ExternalLinkIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "./icons";

export function DefaultFloatingLinkUI({
  isEditing,
  linkUrl,
  editedUrl,
  isValidUrl,
  setEditedUrl,
  submitLink,
  cancelEdit,
  startEdit,
  deleteLink,
  inputRef,
}: FloatingLinkRenderProps): JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitLink();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="typix-floating-link__edit">
        <div className="typix-floating-link__input-wrapper">
          <span className="typix-floating-link__input-icon">
            <LinkIcon />
          </span>
          <input
            ref={inputRef}
            className="typix-floating-link__input"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste or type a link..."
            aria-label="Link URL"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="typix-floating-link__actions">
          <button
            type="button"
            className="typix-floating-link__btn typix-floating-link__btn--cancel"
            aria-label="Cancel"
            title="Cancel"
            onClick={cancelEdit}
            onMouseDown={(e) => e.preventDefault()}
          >
            <XIcon />
          </button>
          <button
            type="button"
            className="typix-floating-link__btn typix-floating-link__btn--confirm"
            aria-label="Apply link"
            title="Apply"
            disabled={!isValidUrl}
            onClick={(e) => {
              e.preventDefault();
              submitLink();
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <CheckIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="typix-floating-link__view">
      <a
        className="typix-floating-link__url"
        href={sanitizeUrl(linkUrl)}
        target="_blank"
        rel="noopener noreferrer"
        title={linkUrl}
      >
        <span className="typix-floating-link__url-text">{linkUrl}</span>
        <ExternalLinkIcon />
      </a>
      <div className="typix-floating-link__divider" />
      <button
        type="button"
        className="typix-floating-link__btn typix-floating-link__btn--edit"
        aria-label="Edit link"
        title="Edit"
        onClick={(e) => {
          e.preventDefault();
          startEdit();
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        className="typix-floating-link__btn typix-floating-link__btn--delete"
        aria-label="Remove link"
        title="Remove"
        onClick={deleteLink}
        onMouseDown={(e) => e.preventDefault()}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
