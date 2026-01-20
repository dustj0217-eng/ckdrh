"use client"

import React, { useState, useMemo } from 'react';
import { Plus, X, TrendingUp, Calendar } from 'lucide-react';

const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

const DUMMY_DATA = [
  {
    date: '2026-01-20',
    items: [
      { id: 1, category: '식비', amount: 12000, reason: '점심 김치찌개' },
      { id: 2, category: '교통', amount: 2800, reason: '지하철' },
      { id: 3, category: '쇼핑', amount: 35000, reason: '티셔츠' }
    ],
    dailyNote: '오늘은 쇼핑을 좀 했다. 필요한 거였으니 괜찮아.'
  },
  {
    date: '2026-01-19',
    items: [
      { id: 4, category: '식비', amount: 15000, reason: '저녁 회식' },
      { id: 5, category: '교통', amount: 3000, reason: '택시' },
      { id: 6, category: '문화', amount: 14000, reason: '영화' }
    ],
    dailyNote: '친구들이랑 영화 보고 저녁 먹었음. 즐거웠다!'
  },
  {
    date: '2026-01-18',
    items: [
      { id: 7, category: '식비', amount: 8000, reason: '아침 빵' },
      { id: 8, category: '식비', amount: 11000, reason: '점심 덮밥' },
      { id: 9, category: '교통', amount: 2800, reason: '지하철' }
    ],
    dailyNote: '평범한 하루. 지출 적당함.'
  },
  {
    date: '2026-01-17',
    items: [
      { id: 10, category: '공과금', amount: 80000, reason: '관리비' },
      { id: 11, category: '식비', amount: 25000, reason: '장보기' }
    ],
    dailyNote: '관리비 나가는 날... 아프다'
  },
  {
    date: '2026-01-16',
    items: [
      { id: 12, category: '식비', amount: 13000, reason: '점심 파스타' },
      { id: 13, category: '쇼핑', amount: 28000, reason: '화장품' }
    ],
    dailyNote: ''
  },
  {
    date: '2026-01-15',
    items: [
      { id: 14, category: '식비', amount: 9500, reason: '브런치' },
      { id: 15, category: '문화', amount: 45000, reason: '콘서트 티켓' }
    ],
    dailyNote: '콘서트 너무 기대된다!'
  },
  {
    date: '2026-01-14',
    items: [
      { id: 16, category: '식비', amount: 7000, reason: '커피' },
      { id: 17, category: '교통', amount: 5600, reason: '지하철 왕복' }
    ],
    dailyNote: ''
  }
];

export default function BudgetTracker() {
  const [currentView, setCurrentView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2026-01-20');
  const [data, setData] = useState(DUMMY_DATA);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: '식비', amount: '', reason: '' });

  const todayData = data.find(d => d.date === selectedDate) || { date: selectedDate, items: [], dailyNote: '' };

  const addItem = () => {
    if (!newItem.amount || !newItem.reason) return;
    
    const updatedData = data.map(d => {
      if (d.date === selectedDate) {
        return {
          ...d,
          items: [...d.items, { 
            id: Date.now(), 
            category: newItem.category, 
            amount: parseInt(newItem.amount), 
            reason: newItem.reason 
          }]
        };
      }
      return d;
    });
    
    if (!data.find(d => d.date === selectedDate)) {
      updatedData.push({
        date: selectedDate,
        items: [{ id: Date.now(), category: newItem.category, amount: parseInt(newItem.amount), reason: newItem.reason }],
        dailyNote: ''
      });
    }
    
    setData(updatedData);
    setNewItem({ category: '식비', amount: '', reason: '' });
    setShowAddForm(false);
  };

  const deleteItem = (itemId) => {
    const updatedData = data.map(d => {
      if (d.date === selectedDate) {
        return { ...d, items: d.items.filter(item => item.id !== itemId) };
      }
      return d;
    });
    setData(updatedData);
  };

  const updateNote = (note) => {
    const updatedData = data.map(d => {
      if (d.date === selectedDate) {
        return { ...d, dailyNote: note };
      }
      return d;
    });
    
    if (!data.find(d => d.date === selectedDate)) {
      updatedData.push({ date: selectedDate, items: [], dailyNote: note });
    }
    
    setData(updatedData);
  };

  const weekData = useMemo(() => {
    const weekDates = [];
    const today = new Date(selectedDate);
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    return weekDates.map(date => {
      const dayData = data.find(d => d.date === date);
      const total = dayData ? dayData.items.reduce((sum, item) => sum + item.amount, 0) : 0;
      return { date, total };
    });
  }, [selectedDate, data]);

  const monthData = useMemo(() => {
    const currentMonth = selectedDate.substring(0, 7);
    const monthItems = data.filter(d => d.date.startsWith(currentMonth));
    
    const categoryTotals = {};
    let total = 0;
    
    monthItems.forEach(day => {
      day.items.forEach(item => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
        total += item.amount;
      });
    });
    
    return { categoryTotals, total, days: monthItems.length };
  }, [selectedDate, data]);

  const yearData = useMemo(() => {
    const currentYear = selectedDate.substring(0, 4);
    const monthTotals = {};
    
    for (let i = 1; i <= 12; i++) {
      const month = `${currentYear}-${String(i).padStart(2, '0')}`;
      const monthItems = data.filter(d => d.date.startsWith(month));
      monthTotals[month] = monthItems.reduce((sum, day) => 
        sum + day.items.reduce((daySum, item) => daySum + item.amount, 0), 0
      );
    }
    
    return monthTotals;
  }, [selectedDate, data]);

  const dailyTotal = todayData.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setCurrentView('daily')}
            className={`flex-1 py-4 text-sm ${currentView === 'daily' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
          >
            오늘
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`flex-1 py-4 text-sm ${currentView === 'week' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
          >
            주간
          </button>
          <button
            onClick={() => setCurrentView('month')}
            className={`flex-1 py-4 text-sm ${currentView === 'month' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
          >
            월간
          </button>
          <button
            onClick={() => setCurrentView('year')}
            className={`flex-1 py-4 text-sm ${currentView === 'year' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
          >
            연간
          </button>
        </div>
      </div>

      {currentView === 'daily' && (
        <div className="p-4">
          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 text-base"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">지출 내역</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {showAddForm && (
              <div className="mb-4 p-4 border border-gray-300 space-y-3">
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full p-2 border border-gray-300"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="금액"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="사유"
                  value={newItem.reason}
                  onChange={(e) => setNewItem({ ...newItem, reason: e.target.value })}
                  className="w-full p-2 border border-gray-300"
                />
                <button
                  onClick={addItem}
                  className="w-full py-2 bg-black text-white hover:bg-gray-800"
                >
                  추가
                </button>
              </div>
            )}

            <div className="space-y-2">
              {todayData.items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 border border-gray-300">{item.category}</span>
                      <span className="text-sm">{item.reason}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.amount.toLocaleString()}원</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">총액</span>
                <span className="text-2xl font-bold">{dailyTotal.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">하루 총평</h2>
            <textarea
              value={todayData.dailyNote}
              onChange={(e) => updateNote(e.target.value)}
              placeholder="오늘 하루 소비는 어땠나요?"
              className="w-full p-3 border border-gray-300 min-h-24 resize-none"
            />
          </div>
        </div>
      )}

      {currentView === 'week' && (
        <div className="p-4">
          <h2 className="text-xl font-medium mb-6">주간 통계</h2>
          
          <div className="mb-8">
            <div className="flex items-end justify-between h-48 gap-2">
              {weekData.map((day, idx) => {
                const maxAmount = Math.max(...weekData.map(d => d.total));
                const height = maxAmount > 0 ? (day.total / maxAmount) * 100 : 0;
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-40">
                      <div
                        className="w-full bg-black"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-xs mt-2 text-center">
                      {new Date(day.date).getDate()}일
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.total > 0 ? `${(day.total / 1000).toFixed(0)}k` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">주간 총액</span>
              <span className="text-2xl font-bold">
                {weekData.reduce((sum, day) => sum + day.total, 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}

      {currentView === 'month' && (
        <div className="p-4">
          <h2 className="text-xl font-medium mb-6">월간 통계</h2>
          
          <div className="mb-6 p-4 border border-gray-300">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">총 지출</span>
              <span className="text-xl font-bold">{monthData.total.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>기록된 날</span>
              <span>{monthData.days}일</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">카테고리별 지출</h3>
            <div className="space-y-3">
              {Object.entries(monthData.categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = monthData.total > 0 ? (amount / monthData.total) * 100 : 0;
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{amount.toLocaleString()}원</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {currentView === 'year' && (
        <div className="p-4">
          <h2 className="text-xl font-medium mb-6">연간 통계</h2>
          
          <div className="space-y-3">
            {Object.entries(yearData).map(([month, amount]) => (
              <div key={month} className="flex justify-between items-center p-3 border border-gray-200">
                <span className="font-medium">{month.substring(5)}월</span>
                <span className="text-lg">{amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">연간 총액</span>
              <span className="text-2xl font-bold">
                {Object.values(yearData).reduce((sum, amount) => sum + amount, 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}