import { DayData } from '@/lib/types';

const DAY_MS = 24 * 60 * 60 * 1000;

// YYYY-MM-DD → 절대 day index (UTC 기준, 타임존 영향 없음)
function toDayIndex(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

// day index → YYYY-MM-DD
function fromDayIndex(idx: number) {
  const date = new Date(idx * DAY_MS);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useWeeklyStats(data: DayData[], selectedDate: string) {
  const baseIdx = toDayIndex(selectedDate);

  const dates = Array.from({ length: 7 }, (_, i) =>
    fromDayIndex(baseIdx - (6 - i))
  );

  return dates.map(date => {
    const day = data.find(d => d.date === date);
    const total = day
      ? day.items.reduce((s, i) => s + i.amount, 0)
      : 0;

    return { date, total };
  });
}
