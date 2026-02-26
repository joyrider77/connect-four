import { Heart } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function GameFooter() {
  const { t } = useTranslation();

  return (
    <footer className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © 2025. {t.builtWith}{' '}
        <Heart className="inline w-4 h-4 text-red-500 mx-1" />{' '}
        {t.using}{' '}
        <a 
          href="https://caffeine.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
