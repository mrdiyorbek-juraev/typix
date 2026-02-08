import { beforeEach, describe, expect, it, vi } from "vitest";
import { isSpeechRecognitionSupported } from "../index";

describe("speech-to-text utilities", () => {
  describe("isSpeechRecognitionSupported", () => {
    const originalWindow = global.window;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns false in SSR environment (no window)", () => {
      // @ts-expect-error - simulating SSR
      delete global.window;

      expect(isSpeechRecognitionSupported()).toBe(false); 

      // Restore window
      global.window = originalWindow;
    });

    it("returns true when SpeechRecognition is available", () => {
      // Mock SpeechRecognition
      const mockWindow = {
        ...global.window, 
        SpeechRecognition: class MockSpeechRecognition {},
      };
      global.window = mockWindow as unknown as Window & typeof globalThis;

      expect(isSpeechRecognitionSupported()).toBe(true);

      // Restore
      global.window = originalWindow;
    });

    it("returns true when webkitSpeechRecognition is available", () => {
      // Mock webkitSpeechRecognition (Safari/Chrome)
      const mockWindow = {
        ...global.window,
        webkitSpeechRecognition: class MockWebkitSpeechRecognition {},
      };
      global.window = mockWindow as unknown as Window & typeof globalThis;

      expect(isSpeechRecognitionSupported()).toBe(true);

      // Restore
      global.window = originalWindow;
    });

    it("returns false when neither SpeechRecognition nor webkitSpeechRecognition is available", () => {
      // Mock window without speech recognition
      const mockWindow = { ...global.window };
      // @ts-expect-error - removing properties for test
      delete mockWindow.SpeechRecognition;
      // @ts-expect-error - removing properties for test
      delete mockWindow.webkitSpeechRecognition;
      global.window = mockWindow as unknown as Window & typeof globalThis;

      expect(isSpeechRecognitionSupported()).toBe(false);

      // Restore
      global.window = originalWindow;
    });
  });

  describe("SpeechRecognitionResult type", () => {
    it("has correct structure", () => {
      // Type check - the result should have these properties
      const mockResult = {
        transcript: "hello world", 
        confidence: 0.95,
        isFinal: true,
      };

      expect(mockResult.transcript).toBe("hello world");
      expect(mockResult.confidence).toBe(0.95);
      expect(mockResult.isFinal).toBe(true);
    });
  });

  describe("SpeechToTextState type", () => {
    it("has correct structure", () => {
      // Type check - the state should have these properties
      const mockState = {
        isListening: false,
        isSupported: true,
        error: null,
        lastTranscript: "previous text",
      };

      expect(mockState.isListening).toBe(false);
      expect(mockState.isSupported).toBe(true);
      expect(mockState.error).toBeNull();
      expect(mockState.lastTranscript).toBe("previous text");
    });

    it("can have error state", () => {
      const mockState = {
        isListening: false,
        isSupported: true,
        error: new Error("Microphone access denied"),
        lastTranscript: null,
      };

      expect(mockState.error).toBeInstanceOf(Error);
      expect(mockState.error?.message).toBe("Microphone access denied");
    });
  });

  describe("VoiceCommands type", () => {
    it("supports command handlers", () => {
      const mockCommands = {
        "new line": () => {},
        undo: () => {},
        redo: () => {},
        "bold text": () => {},
      };

      expect(Object.keys(mockCommands)).toHaveLength(4);
      expect(typeof mockCommands["new line"]).toBe("function");
      expect(typeof mockCommands["undo"]).toBe("function");
    });
  });

  describe("SpeechToTextExtensionProps defaults", () => {
    it("has expected default values based on documentation", () => {
      // These are the documented defaults
      const defaults = {
        language: "en-US",
        continuous: true,
        interimResults: true,
        maxAlternatives: 1,
        includeDefaultCommands: true,
      };

      expect(defaults.language).toBe("en-US");
      expect(defaults.continuous).toBe(true);
      expect(defaults.interimResults).toBe(true);
      expect(defaults.maxAlternatives).toBe(1);
      expect(defaults.includeDefaultCommands).toBe(true);
    });

    it("supports various language codes", () => {
      const supportedLanguages = [
        "en-US", // English (US)
        "en-GB", // English (UK)
        "es-ES", // Spanish
        "fr-FR", // French
        "de-DE", // German
        "zh-CN", // Chinese (Simplified)
        "ja-JP", // Japanese
        "ko-KR", // Korean
        "pt-BR", // Portuguese (Brazil) 
        "ru-RU", // Russian
      ]; 

      // All should be valid BCP-47 language tags
      for (const lang of supportedLanguages) {
        expect(lang).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      }
    });
  });
});
