import { ConverterForm } from '@/components/converter';

/**
 * Main page for the Unit Converter app.
 * 
 * Layout: Centered card on a clean background.
 * The ConverterForm component handles all conversion logic and UI.
 */
export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <ConverterForm />
    </main>
  );
}
