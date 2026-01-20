"use client";

import { CATEGORY_ICONS, THEMES } from '@/lib/constants';
import { useMonthlyStats } from '@/hooks/useMonthlyStats';

export default function MonthView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];
  const { total, days, categoryTotals } =
    useMonthlyStats(data, selectedDate);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">월간 통계</h2>

      <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
        <div className="flex justify-between mb-2">
          <span className={currentTheme.accent}>총 지출</span>
          <span className="text-2xl font-bold">{total.toLocaleString()}원</span>
        </div>
        <div className={`text-sm ${currentTheme.accent}`}>
          기록된 날 {days}일
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">카테고리별</h3>
        <div className="space-y-4">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const Icon = CATEGORY_ICONS[cat];
              const percent = total ? (amount / total) * 100 : 0;

              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className={`flex items-center gap-2 ${currentTheme.categories[cat]} px-3 py-1 rounded-full`}>
                      <Icon size={14} />
                      {cat}
                    </span>
                    <span className="font-semibold">
                      {amount.toLocaleString()}원
                    </span>
                  </div>
                  <div className={`h-3 rounded-full ${currentTheme.secondary}`}>
                    <div
                      className={`${currentTheme.primary} h-3 rounded-full`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className={`text-xs ${currentTheme.accent} text-right`}>
                    {percent.toFixed(1)}%
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
