export type TextSize = 'normal' | 'large' | 'xlarge';

const percentages: Record<TextSize, string> = {
  normal: '100%',
  large: '118%',
  xlarge: '135%',
};

const STORAGE_KEY = 'medtrack-text-size';

export function getSavedTextSize(): TextSize {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'large' || saved === 'xlarge') return saved;
  } catch {
    // storage unavailable, fall through to default
  }
  return 'normal';
}

export function applyTextSize(size: TextSize) {
  document.documentElement.style.fontSize = percentages[size];
  try {
    localStorage.setItem(STORAGE_KEY, size);
  } catch {
    // ignore, the size still applies for this session
  }
}