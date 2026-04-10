import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/lib/fitglass/styles/fitglass.css';

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
  title: 'FitGlass — AI Calorie & Nutrition Tracker',
  description:
    'Track your calories, macros, and micronutrients with AI-powered food analysis. Snap a photo or describe your meal.',
  openGraph: {
    title: 'FitGlass — AI Calorie & Nutrition Tracker',
    description:
      'Track your calories, macros, and micronutrients with AI-powered food analysis.',
    type: 'website',
    siteName: 'FitGlass',
  },
  robots: { index: false, follow: false },
};

export default function FitGlassLayout({
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
