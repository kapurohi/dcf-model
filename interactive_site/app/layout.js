import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata = {
  title: "Discounted Cash Flow Model",
  description: "Public-company DCF workbench with search-first valuation workflow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
