import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Loading all weights used
  variable: "--font-poppins"
});

export const metadata = {
  title: "ANONY Extensions",
  description: "Tool that go beyond Learning",

  verification: {
    google: "oydgpHsA5uLuO_A7NRe1Qi4JF4k1HWQQ1qqCCPbC08g",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}