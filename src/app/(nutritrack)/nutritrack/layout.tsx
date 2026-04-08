import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/lib/nutritrack/styles/nutritrack.css';

const dmSans = localFont({
  variable: '--font-dm-sans',
  display: 'swap',
  src: [
    { path: '../../../../public/fonts/DMSans-Regular.woff2', weight: '400' },
    { path: '../../../../public/fonts/DMSans-Medium.woff2', weight: '500' },
    { path: '../../../../public/fonts/DMSans-SemiBold.woff2', weight: '600' },
    { path: '../../../../public/fonts/DMSans-Bold.woff2', weight: '700' },
  ],
});

export const metadata: Metadata = {
  title: 'NutriTrack',
  description: 'AI-powered calorie and nutrition tracker',
};

export default function NutriTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} font-[family-name:var(--font-dm-sans)]`}>
      {children}
    </div>
  );
}
