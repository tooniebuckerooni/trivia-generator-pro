import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A calm, dignified palette suited to the subject matter.
        ink: "#1f2733",
        slate: {
          850: "#1b2230",
        },
        sage: {
          50: "#f3f6f4",
          100: "#e3ece6",
          200: "#c6d8cd",
          400: "#7fa593",
          500: "#5e8a76",
          600: "#4a7160",
          700: "#3c5b4e",
        },
        cream: "#f8f6f1",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,39,51,0.04), 0 8px 24px rgba(31,39,51,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
