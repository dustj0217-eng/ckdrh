"use client";

import { THEMES } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

function getMonthData(data: any[], year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const totalCells = Math.ceil((totalDays + startOffset) / 7) * 7;
  
  const monthData = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    
    if (dayNum < 1 || dayNum > totalDays) return null;
    
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const day = data.find(d => d.date === dateStr);
    
    const income = day
      ? day.items.filter((i: any) => i.amount > 0).reduce((s: number, i: any) => s + i.amount, 0)
      : 0;
    
    const expense = day
      ? day.items.filter((i: any) => i.amount < 0).reduce((s: number, i: any) => s + Math.abs(i.amount), 0)
      : 0;
    
    const total = income - expense;
    
    return { date: dateStr, income, expense, total };
  });

  return monthData;
}

export default function CalendarView({ data, selectedDate, setSelectedDate, theme }: any) {
  const currentTheme = THEMES[theme];
  const today = todayStr();
  
  const [year, month] = selectedDate.split('-').map(Number);
  const monthData = getMonthData(data, year, month);
  
  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 2, 1);
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    setSelectedDate(`${y}-${m}-01`);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(year, month, 1);
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    setSelectedDate(`${y}-${m}-01`);
  };

  const monthlyIncome = monthData.reduce((s, d) => d ? s + d.income : s, 0);
  const monthlyExpense = monthData.reduce((s, d) => d ? s + d.expense : s, 0);
  const monthlyTotal = monthlyIncome - monthlyExpense;

  return (
    <div className="p-4 space-y-6">
      {/* 월 네비게이션 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevMonth}
          className={`p-2 rounded-xl ${currentTheme.card} border ${currentTheme.border}`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-2xl font-bold">{year}년 {month}월</h2>
        
        <button
          onClick={handleNextMonth}
          className={`p-2 rounded-xl ${currentTheme.card} border ${currentTheme.border}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold opacity-70 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div 
            key={d} 
            className={i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 달력 그리드 - 통합된 테두리 */}
      <div className={`rounded-2xl border ${currentTheme.border} overflow-hidden bg-white`}>
        <div className="grid grid-cols-7">
          {monthData.map((day, idx) => {
            if (!day) {
              return (
                <div 
                  key={`empty-${idx}`} 
                  className={`h-20 border-r border-b border-gray-200 dark:border-gray-700 ${
                    (idx + 1) % 7 === 0 ? 'border-r-0' : ''
                  } ${idx >= monthData.length - 7 ? 'border-b-0' : ''}`}
                />
              );
            }

            const isToday = day.date === today;
            const dateObj = parseLocalDate(day.date);
            const dayOfWeek = dateObj.getDay();
            const isLastColumn = (idx + 1) % 7 === 0;
            const isLastRow = idx >= monthData.length - 7;

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  h-20 p-2
                  flex flex-col justify-between
                  border-r border-b border-gray-200 dark:border-gray-700
                  ${isLastColumn ? 'border-r-0' : ''}
                  ${isLastRow ? 'border-b-0' : ''}
                  ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  ${selectedDate === day.date ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                  hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                `}
              >
                {/* 날짜 */}
                <div className={`
                  text-sm font-semibold
                  ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : ''}
                  ${isToday ? 'underline underline-offset-2' : ''}
                `}>
                  {dateObj.getDate()}
                </div>

                {/* 금액 */}
                <div className="space-y-0.5 text-right">
                    {day.expense > 0 && (
                    <div className="text-[10px] text-red-500 font-medium">
                        -{day.expense.toLocaleString()}
                    </div>
                    )}
                    {day.income > 0 && (
                    <div className="text-[10px] text-blue-500 font-medium">
                        -{day.income.toLocaleString()}
                    </div>
                    )}
                </div>
              </button>
          );
        })}
        </div>
      </div>

      {/* 월간 통계 */}
      <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border} space-y-4`}>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">월간 지출</span>
          <span className="text-xl font-bold text-blue-500">
            {monthlyIncome.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}