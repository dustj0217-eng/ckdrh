import { DayData } from '@/lib/types';

export function useWeeklyStats(data: DayData[], selectedDate: string) {
  const base = new Date(selectedDate);
  const dates: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates.map(date => {
    const day = data.find(d => d.date === date);
    const total = day
      ? day.items.reduce((s, i) => s + i.amount, 0)
      : 0;

    return { date, total };
  });
}
