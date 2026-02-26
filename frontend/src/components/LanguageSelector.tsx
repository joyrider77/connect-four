import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '../hooks/useTranslation';
import { getAvailableLanguages } from '../lib/i18n';

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, t } = useTranslation();
  const availableLanguages = getAvailableLanguages();

  const currentLangData = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLangData?.nativeName || 'English'}</span>
          <span className="sm:hidden">{currentLangData?.code.toUpperCase() || 'EN'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code 
                ? 'bg-primary/10 text-primary font-medium' 
                : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono opacity-60">
                {language.code.toUpperCase()}
              </span>
              <span>{language.nativeName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
