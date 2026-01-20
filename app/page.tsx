"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Tag, Settings, Palette } from 'lucide-react';

interface Item {
  id: number;
  category: string;
  amount: number;
  name: string;
  memo: string;
  time: string;
  tags: string[];
}

interface DayData {
  date: string;
  items: Item[];
  dailyNote: string;
}

interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  accent: string;
  card: string;
}

const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

const THEMES: Record<string, ThemeConfig> = {
  modern: {
    name: '모던',
    bg: 'bg-white',
    text: 'text-gray-900',
    primary: 'bg-black text-white',
    secondary: 'bg-gray-100 text-gray-700',
    border: 'border-gray-300',
    accent: 'text-gray-500',
    card: 'bg-white border-gray-200'
  },
  nightsky: {
    name: '밤하늘',
    bg: 'bg-slate-900',
    text: 'text-slate-100',
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-slate-800 text-slate-200',
    border: 'border-slate-700',
    accent: 'text-indigo-400',
    card: 'bg-slate-800 border-slate-700'
  },
  lovelypink: {
    name: '러블리핑크',
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    primary: 'bg-pink-500 text-white',
    secondary: 'bg-pink-100 text-pink-700',
    border: 'border-pink-200',
    accent: 'text-pink-600',
    card: 'bg-white border-pink-200'
  }
};

const FONTS = [
  { name: '기본', value: 'font-sans' },
  { name: '고딕', value: 'font-mono' },
  { name: '세리프', value: 'font-serif' }
];

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
    name: '',
    memo: '',
    time: new Date().toTimeString().slice(0, 5),
    tags: '' 
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [theme, setTheme] = useState('modern');
  const [font, setFont] = useState('font-sans');

  useEffect(() => {
    const saved = localStorage.getItem('budgetData');
    const savedTags = localStorage.getItem('budgetTags');
    const savedTheme = localStorage.getItem('budgetTheme');
    const savedFont = localStorage.getItem('budgetFont');
    
    if (saved) setData(JSON.parse(saved));
    if (savedTags) setAllTags(JSON.parse(savedTags));
    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFont(savedFont);
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

  useEffect(() => {
    localStorage.setItem('budgetTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('budgetFont', font);
  }, [font]);

  const currentTheme = THEMES[theme];

  const todayData = data.find(d => d.date === selectedDate) || { date: selectedDate, items: [], dailyNote: '' };

  const addItem = () => {
    if (!newItem.amount || !newItem.name) return;
    
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
              name: newItem.name,
              memo: newItem.memo,
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
          name: newItem.name,
          memo: newItem.memo,
          time: newItem.time,
          tags: tags
        }],
        dailyNote: ''
      }]);
    }
    
    setNewItem({ 
      category: '식비', 
      amount: '', 
      name: '',
      memo: '',
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
    <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} ${font}`}>
      <div className={`border-b ${currentTheme.border}`}>
        <div className="flex">
          <button
            onClick={() => setCurrentView('daily')}
            className={`flex-1 py-4 text-sm ${currentView === 'daily' ? `border-b-2 ${currentTheme.accent} font-medium` : 'opacity-50'}`}
          >
            오늘
          </button>
          <button
            onClick={() => setCurrentView('week')}
            className={`flex-1 py-4 text-sm ${currentView === 'week' ? `border-b-2 ${currentTheme.accent} font-medium` : 'opacity-50'}`}
          >
            주간
          </button>
          <button
            onClick={() => setCurrentView('month')}
            className={`flex-1 py-4 text-sm ${currentView === 'month' ? `border-b-2 ${currentTheme.accent} font-medium` : 'opacity-50'}`}
          >
            월간
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex-1 py-4 text-sm ${currentView === 'settings' ? `border-b-2 ${currentTheme.accent} font-medium` : 'opacity-50'}`}
          >
            <Settings size={18} className="mx-auto" />
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
              className={`w-full p-3 border ${currentTheme.border} text-base ${currentTheme.card}`}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">지출 내역</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`p-2 border ${currentTheme.border} hover:${currentTheme.primary} transition-colors`}
              >
                <Plus size={20} />
              </button>
            </div>

            {showAddForm && (
              <div className={`mb-4 p-4 border ${currentTheme.border} ${currentTheme.card} space-y-3`}>
                <div className="flex gap-2">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className={`flex-1 p-2 border ${currentTheme.border} ${currentTheme.card}`}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className={`p-2 border ${currentTheme.border} ${currentTheme.card}`}
                  />
                </div>
                <input
                  type="number"
                  placeholder="금액"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                  className={`w-full p-2 border ${currentTheme.border} ${currentTheme.card}`}
                />
                <input
                  type="text"
                  placeholder="항목 이름 (예: 김치찌개)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className={`w-full p-2 border ${currentTheme.border} ${currentTheme.card}`}
                />
                <textarea
                  placeholder="메모 (예: 솔직히 좀 비싸긴 했는데 든든한 한 끼가 먹고 싶었음)"
                  value={newItem.memo}
                  onChange={(e) => setNewItem({ ...newItem, memo: e.target.value })}
                  className={`w-full p-2 border ${currentTheme.border} ${currentTheme.card} min-h-20 resize-none`}
                />
                <input
                  type="text"
                  placeholder="태그 (콤마로 구분: 외식, 데이트)"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  className={`w-full p-2 border ${currentTheme.border} ${currentTheme.card}`}
                />
                <button
                  onClick={addItem}
                  className={`w-full py-2 ${currentTheme.primary}`}
                >
                  추가
                </button>
              </div>
            )}

            <div className="space-y-2">
              {todayData.items
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => (
                <div key={item.id} className={`p-3 border ${currentTheme.border} ${currentTheme.card}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 border ${currentTheme.border}`}>{item.category}</span>
                        <span className={`text-xs ${currentTheme.accent}`}>{item.time}</span>
                      </div>
                      <div className="text-sm font-medium">{item.name}</div>
                      {item.memo && <div className={`text-xs ${currentTheme.accent} mt-1`}>{item.memo}</div>}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className={`text-xs px-2 py-1 ${currentTheme.secondary} flex items-center gap-1`}>
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="font-medium whitespace-nowrap">{item.amount.toLocaleString()}원</span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="opacity-50 hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 pt-4 border-t ${currentTheme.border}`}>
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
              className={`w-full p-3 border ${currentTheme.border} ${currentTheme.card} min-h-24 resize-none`}
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
                        className={currentTheme.primary}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-xs mt-2 text-center">
                      {new Date(day.date).getDate()}일
                    </div>
                    <div className={`text-xs ${currentTheme.accent}`}>
                      {day.total > 0 ? `${(day.total / 1000).toFixed(0)}k` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`pt-6 border-t ${currentTheme.border}`}>
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
          
          <div className={`mb-6 p-4 border ${currentTheme.border} ${currentTheme.card}`}>
            <div className="flex justify-between mb-2">
              <span className={currentTheme.accent}>총 지출</span>
              <span className="text-xl font-bold">{monthData.total.toLocaleString()}원</span>
            </div>
            <div className={`flex justify-between text-sm ${currentTheme.accent}`}>
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
                      <div className={`w-full h-2 ${currentTheme.secondary}`}>
                        <div
                          className={currentTheme.primary}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className={`text-xs ${currentTheme.accent} mt-1 text-right`}>
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {currentView === 'settings' && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">설정</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Palette size={20} />
              테마
            </h3>
            <div className="space-y-2">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`w-full p-4 border ${currentTheme.border} ${currentTheme.card} text-left transition-all ${
                    theme === key ? `ring-2 ${currentTheme.accent}` : ''
                  }`}
                >
                  <div className="font-medium">{t.name}</div>
                  <div className="flex gap-2 mt-2">
                    <div className={`w-6 h-6 rounded ${t.bg} border`}></div>
                    <div className={`w-6 h-6 rounded ${t.primary}`}></div>
                    <div className={`w-6 h-6 rounded ${t.secondary}`}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">글꼴</h3>
            <div className="space-y-2">
              {FONTS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFont(f.value)}
                  className={`w-full p-4 border ${currentTheme.border} ${currentTheme.card} text-left ${f.value} transition-all ${
                    font === f.value ? `ring-2 ${currentTheme.accent}` : ''
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}