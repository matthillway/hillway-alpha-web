// TradeSmart Design System - STRICT RULES
// NO OTHER COLORS ALLOWED - Follow this exactly

export const tokens = {
  colors: {
    accent: "emerald-600",
    accentHover: "emerald-700",
    text: "gray-900",
    textMuted: "gray-500",
    border: "gray-200",
    background: "white",
    backgroundMuted: "gray-50",
  },
  spacing: {
    section: "py-24 md:py-32",
    container: "max-w-6xl mx-auto px-6",
    gap: "gap-8 md:gap-12",
  },
  typography: {
    h1: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900",
    h2: "text-3xl md:text-4xl font-bold text-gray-900",
    h3: "text-xl font-semibold text-gray-900",
    body: "text-base text-gray-600 leading-relaxed",
    small: "text-sm text-gray-500",
  },
  buttons: {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-4 font-medium transition-colors",
    secondary:
      "border border-gray-300 hover:border-gray-400 text-gray-900 rounded-full px-8 py-4 font-medium transition-colors",
    ghost: "text-gray-600 hover:text-gray-900 font-medium transition-colors",
  },
  cards: {
    base: "bg-white border border-gray-200 rounded-2xl p-8 md:p-10",
    hover: "hover:shadow-lg transition-shadow duration-300",
  },
} as const;

// Tailwind class strings for direct use
export const styles = {
  // Section wrapper
  section: "py-24 md:py-32",

  // Container
  container: "max-w-6xl mx-auto px-6",

  // Typography
  h1: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900",
  h2: "text-3xl md:text-4xl font-bold text-gray-900",
  h3: "text-xl font-semibold text-gray-900",
  body: "text-base text-gray-600 leading-relaxed",
  bodyLarge: "text-lg md:text-xl text-gray-600 leading-relaxed",
  small: "text-sm text-gray-500",

  // Buttons
  buttonPrimary:
    "inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-4 font-medium transition-colors",
  buttonSecondary:
    "inline-flex items-center justify-center border border-gray-300 hover:border-gray-400 bg-white text-gray-900 rounded-full px-8 py-4 font-medium transition-colors",
  buttonGhost:
    "text-gray-600 hover:text-gray-900 font-medium transition-colors",

  // Cards
  card: "bg-white border border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-shadow duration-300",

  // Badge
  badge:
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700",
} as const;
