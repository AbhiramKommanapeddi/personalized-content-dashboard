import { useAppSelector } from '@/store/hooks';
import { TRANSLATIONS } from '@/utils/translations';

export function useTranslation() {
  const language = useAppSelector((state) => state.preferences.language);

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return { t, currentLanguage: language };
}
