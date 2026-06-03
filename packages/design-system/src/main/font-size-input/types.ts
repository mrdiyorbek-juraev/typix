export interface UseFontSizeOptions {
  hideWhenUnavailable?: boolean;
  onChanged?: (size: number) => void;
}

export interface UseFontSizeReturn {
  isVisible: boolean;
  currentSize: number;
  canIncrease: boolean;
  canDecrease: boolean;
  handleSetSize: (size: number) => void;
  handleIncrease: () => void;
  handleDecrease: () => void;
  minSize: number;
  maxSize: number;
  increaseShortcutKeys: string[];
  decreaseShortcutKeys: string[];
}

export interface FontSizeInputProps {
  hideWhenUnavailable?: boolean;
  onChanged?: (size: number) => void;
  className?: string;
}
