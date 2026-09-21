import { useTranslations } from "@/lib/i18n";
import { Translations } from "@/lib/i18n/en";

export default function MetricCard({ titleKey, value, descriptionKey, tone = 'emerald' }: {
  titleKey: keyof Translations['partnerDashboard'];
  value: string;
  descriptionKey: keyof Translations['partnerDashboard'];
  tone?: 'emerald' | 'amber' | 'rose' | 'ocean';
}) {
  const t = useTranslations();

  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
    ocean: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  };

  return (
    <div className={`rounded-xl p-5 ${toneClasses[tone]}`}>
      <p className="text-sm font-medium">{t.partnerDashboard[titleKey]}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs opacity-80">{t.partnerDashboard[descriptionKey]}</p>
    </div>
  );
}