import { Metadata } from 'next';
import { HelpClient } from './help-client';

export const metadata: Metadata = {
  title: 'Help & FAQ | PriceGhost',
  description: 'Get help with PriceGhost - frequently asked questions and guides',
};

export default function HelpPage() {
  return <HelpClient />;
}
