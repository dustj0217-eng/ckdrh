"use client";

import { THEMES } from '@/lib/constants';
import { useWeeklyStats } from '@/hooks/useWeeklyStats';

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function todayStr() {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function WeekView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];
  const weekData = useWeeklyStats(data, selectedDate);
  const today = todayStr();

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">주간 내역</h2>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-xs opacity-60">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 캘린더 영역 */}
      <div
        className={`
          grid grid-cols-7
          p-5 rounded-2xl
          ${currentTheme.card} border ${currentTheme.border}
        `}
      >
        {weekData.map(day => {
          const dateObj = parseLocalDate(day.date);
          const isToday = day.date === today;

          return (
            <div
              key={day.date}
              className={`
                h-24 rounded-xl
                flex flex-col justify-between
                ${currentTheme.card}
                ${isToday ? currentTheme.primary : ''}
              `}
            >
              {/* 날짜 */}
              <div className="text-xs font-semibold">
                {dateObj.getDate()}
              </div>

              {/* 금액 */}
              <div className="space-y-1">
                <div className="text-[11px] text-red-500">
                  {day.total < 0
                    ? Math.abs(day.total).toLocaleString()
                    : ''}
                </div>

                <div className="text-[11px] text-blue-500">
                  {day.total > 0
                    ? day.total.toLocaleString()
                    : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 주간 합계 */}
      <div
        className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-lg">주간 합계</span>
          <span className="text-3xl font-bold">
            {weekData.reduce((s, d) => s + d.total, 0).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
