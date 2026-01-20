"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface Item {
  id: number;
  category: string;
  amount: number;
  reason: string;
  time: string;
  tags: string[];
}

interface DayData {
  date: string;
  items: Item[];
  dailyNote: string;
}

const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

export default function BudgetTracker() {
  const [currentView, setCurrentView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [data, setData] = useState<DayData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ 
    category: '식비', 
    amount: '', 
    reason: '',
    time: new Date().toTimeString().slice(0, 5),
    tags: '' 
  });
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('budgetData');
    const savedTags = localStorage.getItem('budgetTags');
    if (saved) {
      setData(JSON.parse(saved));
    }
    if (savedTags) {
      setAllTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('budgetData', JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (allTags.length > 0) {
      localStorage.setItem('budgetTags', JSON.stringify(allTags));
    }
  }, [allTags]);

  const todayData = data.find(d => d.date === selectedDate) || { date: selectedDate, items: [], dailyNote: '' };

  const addItem = () => {
    if (!newItem.amount || !newItem.reason) return;
    
    const tags = newItem.tags.split(',').map(t => t.trim()).filter(t => t);
    tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    });
    
    const existingDay = data.find(d => d.date === selectedDate);
    
    if (existingDay) {
      setData(data.map(d => 
        d.date === selectedDate 
          ? { ...d, items: [...d.items, { 
              id: Date.now(), 
              category: newItem.category, 
              amount: parseInt(newItem.amount), 
              reason: newItem.reason,
              time: newItem.time,
              tags: tags
            }] }
          : d
      ));
    } else {
      setData([...data, {
        date: selectedDate,
        items: [{ 
          id: Date.now(), 
          category: newItem.category, 
          amount: parseInt(newItem.amount), 
          reason: newItem.reason,
          time: newItem.time,
          tags: tags
        }],
        dailyNote: ''
      }]);
    }
    
    setNewItem({ 
      category: '식비', 
      amount: '', 
      reason: '',
      time: new Date().toTimeString().slice(0, 5),
      tags: '' 
    });
    setShowAddForm(false);
  };

  const deleteItem = (itemId: number) => {
    setData(data.map(d => 
      d.date === selectedDate 
        ? { ...d, items: d.items.filter(item => item.id !== itemId) }
        : d
    ));
  };

  const updateNote = (note: string) => {
    const existingDay = data.find(d => d.date === selectedDate);
    
    if (existingDay) {
      setData(data.map(d => 
        d.date === selectedDate 
          ? { ...d, dailyNote: note }
          : d
      ));
    } else {
      setData([...data, { date: selectedDate, items: [], dailyNote: note }]);
    }
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
    
    const categoryTotals: Record<string, number> = {};
    let total = 0;
    
    monthItems.forEach(day => {
      day.items.forEach(item => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
        total += item.amount;
      });
    });
    
    return { categoryTotals, total, days: monthItems.length };
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
                <div className="flex gap-2">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="flex-1 p-2 border border-gray-300"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="p-2 border border-gray-300"
                  />
                </div>
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
                <input
                  type="text"
                  placeholder="태그 (콤마로 구분: 외식, 데이트)"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
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
              {todayData.items
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => (
                <div key={item.id} className="p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 border border-gray-300">{item.category}</span>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                      <div className="text-sm">{item.reason}</div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 flex items-center gap-1">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
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
              {weekData.map((day) => {
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
    </div>
  );
}