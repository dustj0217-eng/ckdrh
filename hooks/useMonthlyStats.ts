import { DayData } from '@/lib/types';

export function useMonthlyStats(data: DayData[], selectedDate: string) {
  const month = selectedDate.slice(0, 7);
  const days = data.filter(d => d.date.startsWith(month));

  const categoryTotals: Record<string, number> = {};
  let total = 0;

  days.forEach(d => {
    d.items.forEach(i => {
      categoryTotals[i.category] =
        (categoryTotals[i.category] || 0) + i.amount;
      total += i.amount;
    });
  });

  return {
    total,
    days: days.length,
    categoryTotals
  };
}
