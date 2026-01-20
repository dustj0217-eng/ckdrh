"use client";

import { useState } from "react";
import { THEMES } from "@/lib/constants";

export default function WeekView({ data, selectedDate, theme }: any) {
  const currentTheme = THEMES[theme];
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

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

    return { income, expense, total: income - expense, items };
  };

  // 주간 총합
  const weekSummary = days.reduce(
    (acc, date) => {
      const { income, expense } = getDaySummary(date);
      return {
        income: acc.income + income,
        expense: acc.expense + expense,
      };
    },
    { income: 0, expense: 0 }
  );

  const weekStart = days[0];
  const weekEnd = days[6];

  return (
    <div className="p-4 space-y-4">
      {/* 주간 헤더 */}
      <div>
        <h2 className="text-lg font-bold">
          {weekStart.getMonth() + 1}월 {weekStart.getDate()}일 - {weekEnd.getMonth() + 1}월 {weekEnd.getDate()}일
        </h2>
      </div>

      {/* 주간 총액 */}
      <div className={`p-4 rounded-xl ${currentTheme.card} ${currentTheme.border}`}>
        <div className="flex justify-around text-center">
          <div>
            <div className="text-xs opacity-60 mb-1">수입</div>
            <div className="text-lg font-bold text-blue-500">
              +{weekSummary.income.toLocaleString()}원
            </div>
          </div>
          <div>
            <div className="text-xs opacity-60 mb-1">지출</div>
            <div className="text-lg font-bold text-red-500">
              -{weekSummary.expense.toLocaleString()}원
            </div>
          </div>
          <div>
            <div className="text-xs opacity-60 mb-1">합계</div>
            <div className="text-lg font-bold">
              {(weekSummary.income - weekSummary.expense).toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold opacity-60">
        {["일", "월", "화", "수", "목", "금", "토"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 일주일 캘린더 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(date => {
          const { income, expense, total, items } = getDaySummary(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const dateKey = date.toISOString().slice(0, 10);
          const isExpanded = expandedDate === dateKey;

          return (
            <div key={date.toISOString()} className="space-y-2">
              {/* 날짜 카드 */}
              <button
                onClick={() => setExpandedDate(isExpanded ? null : dateKey)}
                className={`
                  w-full h-24 p-2 rounded-lg border text-xs
                  flex flex-col justify-between
                  ${currentTheme.card} ${currentTheme.border}
                  ${isToday ? "ring-2 ring-blue-400" : ""}
                  ${items.length > 0 ? "cursor-pointer hover:shadow-md" : ""}
                  transition-all
                `}
              >
                {/* 날짜 */}
                <div className="font-bold text-sm">
                  {date.getDate()}
                  {items.length > 0 && (
                    <span className="ml-1 text-[8px] opacity-60">
                      ●
                    </span>
                  )}
                </div>

                {/* 금액 요약 */}
                {(income > 0 || expense > 0) && (
                  <div className="space-y-0.5">
                    {income > 0 && (
                      <div className="text-blue-500 text-[10px]">
                        +{income.toLocaleString()}
                      </div>
                    )}
                    {expense > 0 && (
                      <div className="text-red-500 text-[10px]">
                        -{expense.toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </button>

              {/* 상세 내역 (확장시) */}
              {isExpanded && items.length > 0 && (
                <div className={`p-2 rounded-lg text-xs ${currentTheme.card} ${currentTheme.border} space-y-1`}>
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate">{item.category || item.description}</span>
                      <span className={item.type === "income" ? "text-blue-500" : "text-red-500"}>
                        {item.type === "income" ? "+" : "-"}
                        {item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}