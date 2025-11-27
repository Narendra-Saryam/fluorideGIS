export const metadata = {
  title: 'Nagpur Fluoride GIS',
  description: 'Demo GIS + AI map for Nagpur district'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#0f172a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
