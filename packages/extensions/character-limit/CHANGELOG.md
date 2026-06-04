# @typix-editor/extension-character-limit

## 5.0.1

### Patch Changes

- Patch release 5.0.1 — minor fixes across cli, core, react, utils, and extensions.

## 5.0.0

### Major Changes

- **Initial release.** Counts characters and words live as the user types, emitting state the `CharacterLimit` UI consumes for a soft visual counter. Pair with `extension-max-length` if you also want to hard-block typing past the cap.
- Configurable `charset` (`UTF-8` vs `UTF-16`) for accurate byte counting on multi-byte content.
