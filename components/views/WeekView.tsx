"use client";

import { THEMES } from '@/lib/constants';
import { useWeeklyStats } from '@/hooks/useWeeklyStats';

export default function WeekView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];
  const weekData = useWeeklyStats(data, selectedDate);

  const max = Math.max(...weekData.map(d => d.total));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">주간 통계</h2>

      <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
        <div className="flex items-end justify-between h-48 gap-3">
          {weekData.map(day => {
            const height = max > 0 ? (day.total / max) * 100 : 0;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="h-40 w-full flex items-end">
                  <div
                    className={`${currentTheme.primary} w-full rounded-t-xl`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-xs mt-2">
                  {new Date(day.date).getDate()}일
                </div>
                <div className={`text-xs ${currentTheme.accent}`}>
                  {day.total ? `${(day.total / 1000).toFixed(0)}k` : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
        <div className="flex justify-between">
          <span className="text-lg">주간 총액</span>
          <span className="text-3xl font-bold">
            {weekData.reduce((s, d) => s + d.total, 0).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
