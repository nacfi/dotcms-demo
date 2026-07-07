/** Palette mirroring the web app's Tailwind tokens (slate / indigo / rose). */
export const colors = {
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  indigo700: "#4338ca",
  indigo600: "#4f46e5",
  indigo300: "#a5b4fc",
  sky500: "#0ea5e9",
  rose600: "#e11d48",
  white: "#ffffff",
};

/** Card chrome shared by Product/Activity/Testimonial/etc. */
export const cardShadow = {
  backgroundColor: colors.white,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.slate200,
  shadowColor: colors.slate900,
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
