import "./globals.css";

export const metadata = {
  title: "Student Course Registration System",
  description: "Air University, Kharian Campus - CS330L Assignment 2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}