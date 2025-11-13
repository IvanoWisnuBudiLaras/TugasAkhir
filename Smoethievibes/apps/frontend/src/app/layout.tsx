import '../styles/globals.css';
import { Nav } from '@/src/components/Nav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
