import { DayData } from '@/lib/types';

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useWeeklyStats(data: DayData[], selectedDate: string) {
  const base = parseLocalDate(selectedDate);
  const dates: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    dates.push(formatLocalDate(d));
  }

  return dates.map(date => {
    const day = data.find(d => d.date === date);
    const total = day
      ? day.items.reduce((s, i) => s + i.amount, 0)
      : 0;

    return { date, total };
  });
}
