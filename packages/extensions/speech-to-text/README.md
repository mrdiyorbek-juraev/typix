# @typix-editor/extension-speech-to-text

Voice input extension for Typix editors using the Web Speech API. Supports custom voice commands, language selection, and full control via a hook.

## Installation

```bash
npm install @typix-editor/extension-speech-to-text
```

## Usage

```tsx
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <SpeechToTextExtension
    language="en-US"
    continuous
    onStart={() => console.log("Listening...")}
    onStop={() => console.log("Stopped")}
  />
</EditorRoot>
```

### Using the Hook

```tsx
import { useSpeechToText, isSpeechRecognitionSupported } from "@typix-editor/extension-speech-to-text";

function VoiceButton() {
  const { isListening, start, stop } = useSpeechToText({ language: "en-US" });

  if (!isSpeechRecognitionSupported()) return null;

  return (
    <button onClick={isListening ? stop : start}>
      {isListening ? "Stop" : "Speak"}
    </button>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | Browser default | Speech recognition language |
| `continuous` | `boolean` | `false` | Keep listening after results |
| `interimResults` | `boolean` | `false` | Show interim results |
| `voiceCommands` | `VoiceCommands` | - | Custom voice command handlers |
| `onStart` | `() => void` | - | Called when recognition starts |
| `onStop` | `() => void` | - | Called when recognition stops |
| `onResult` | `(result) => void` | - | Called with recognition results |
| `onError` | `(error) => void` | - | Called on recognition error |

## Documentation

[typix.com/docs/extensions/speech-to-text](https://typix.com/docs/extensions/speech-to-text)

## License

MIT
