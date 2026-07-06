import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devex — Domain-specific IT talent marketplace",
  description: "Buy assignments from senior experts, build real skills, get endorsed. Proof-of-work for IT talent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0a0f1e; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; color: #f1f5f9; }
          input, textarea, select, button { font-family: inherit; }
          * { min-width: 0; }
          h1, h2, h3, h4, p { overflow-wrap: break-word; word-break: break-word; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: #0a0f1e; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
