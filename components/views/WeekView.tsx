"use client";

import { THEMES } from "@/lib/constants";

export default function MonthView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // 1일
  const firstDay = new Date(year, month, 1);
  // 달력 시작 (일요일)
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  // 6주 * 7일 = 42칸
  const days = Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  // 날짜별 수입/지출 계산
  const getDaySummary = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    const items = data.filter((d: any) => d.date === key);

    const income = items
      .filter((i: any) => i.type === "income")
      .reduce((s: number, i: any) => s + i.amount, 0);

    const expense = items
      .filter((i: any) => i.type === "expense")
      .reduce((s: number, i: any) => s + i.amount, 0);

    return { income, expense, total: income - expense };
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">
        {year}년 {month + 1}월
      </h2>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-xs opacity-60">
        {["일", "월", "화", "수", "목", "금", "토"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 달력 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(date => {
          const { income, expense, total } = getDaySummary(date);
          const isCurrentMonth = date.getMonth() === month;

          return (
            <div
              key={date.toISOString()}
              className={`
                h-28 p-2 rounded-xl border text-xs
                flex flex-col justify-between
                ${currentTheme.card} ${currentTheme.border}
                ${isCurrentMonth ? "" : "opacity-40"}
              `}
            >
              {/* 날짜 */}
              <div className="font-semibold">
                {date.getDate()}
              </div>

              {/* 금액 */}
              <div className="space-y-0.5">
                {income > 0 && (
                  <div className="text-blue-500">
                    +{income.toLocaleString()}
                  </div>
                )}
                {expense > 0 && (
                  <div className="text-red-500">
                    -{expense.toLocaleString()}
                  </div>
                )}
                {(income || expense) && (
                  <div className="font-semibold">
                    {total.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
