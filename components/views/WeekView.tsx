"use client";

import { THEMES } from "@/lib/constants";

export default function MonthView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // 선택된 날짜가 속한 주의 일요일 찾기
  const start = new Date(selectedDate);
  start.setDate(selectedDate.getDate() - selectedDate.getDay());

  // 1주 * 7일 = 7칸
  const days = Array.from({ length: 7 }).map((_, i) => {
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

  // 주의 시작/끝 날짜 표시
  const weekStart = days[0];
  const weekEnd = days[6];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">
        {weekStart.getMonth() === weekEnd.getMonth()
          ? `${year}년 ${weekStart.getMonth() + 1}월`
          : `${weekStart.getFullYear()}년 ${weekStart.getMonth() + 1}월 - ${weekEnd.getFullYear()}년 ${weekEnd.getMonth() + 1}월`}
      </h2>
      <div className="text-sm opacity-60">
        {weekStart.getMonth() + 1}월 {weekStart.getDate()}일 - {weekEnd.getMonth() + 1}월 {weekEnd.getDate()}일
      </div>

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
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelectedDate = date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={date.toISOString()}
              className={`
                h-32 p-2 rounded-xl border text-xs
                flex flex-col justify-between
                ${currentTheme.card} ${currentTheme.border}
                ${isSelectedDate ? "ring-2 ring-blue-500" : ""}
                ${isToday ? "bg-blue-50 dark:bg-blue-950" : ""}
              `}
            >
              {/* 날짜 */}
              <div className="font-semibold">
                {date.getDate()}
                {isToday && <span className="ml-1 text-blue-500">●</span>}
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