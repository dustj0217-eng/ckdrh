"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Tag, Settings, ShoppingBag, Coffee, Bus, Film, Home, Package } from 'lucide-react';

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
  primaryHover: string;
  secondary: string;
  border: string;
  accent: string;
  card: string;
  input: string;
  categories: Record<string, string>;
}

const CATEGORY_ICONS: Record<string, any> = {
  '식비': Coffee,
  '교통': Bus,
  '쇼핑': ShoppingBag,
  '문화': Film,
  '공과금': Home,
  '기타': Package
};

const THEMES: Record<string, ThemeConfig> = {
  modern: {
    name: '모던',
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    primary: 'bg-slate-900 text-white',
    primaryHover: 'hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200',
    accent: 'text-slate-600',
    card: 'bg-white',
    input: 'bg-white border-slate-200',
    categories: {
      '식비': 'bg-emerald-100 text-emerald-700',
      '교통': 'bg-sky-100 text-sky-700',
      '쇼핑': 'bg-violet-100 text-violet-700',
      '문화': 'bg-pink-100 text-pink-700',
      '공과금': 'bg-amber-100 text-amber-700',
      '기타': 'bg-gray-100 text-gray-700'
    }
  },
  nightsky: {
    name: '밤하늘',
    bg: 'bg-slate-900',
    text: 'text-slate-50',
    primary: 'bg-indigo-600 text-white',
    primaryHover: 'hover:bg-indigo-500',
    secondary: 'bg-slate-800 text-slate-200',
    border: 'border-slate-700',
    accent: 'text-slate-400',
    card: 'bg-slate-800',
    input: 'bg-slate-800 border-slate-700',
    categories: {
      '식비': 'bg-emerald-900 text-emerald-300',
      '교통': 'bg-sky-900 text-sky-300',
      '쇼핑': 'bg-violet-900 text-violet-300',
      '문화': 'bg-pink-900 text-pink-300',
      '공과금': 'bg-amber-900 text-amber-300',
      '기타': 'bg-gray-700 text-gray-300'
    }
  },
  coral: {
    name: '코랄핑크',
    bg: 'bg-rose-50',
    text: 'text-rose-950',
    primary: 'bg-rose-400 text-white',
    primaryHover: 'hover:bg-rose-500',
    secondary: 'bg-rose-100 text-rose-700',
    border: 'border-rose-200',
    accent: 'text-rose-600',
    card: 'bg-white',
    input: 'bg-white border-rose-200',
    categories: {
      '식비': 'bg-orange-100 text-orange-700',
      '교통': 'bg-cyan-100 text-cyan-700',
      '쇼핑': 'bg-purple-100 text-purple-700',
      '문화': 'bg-pink-100 text-pink-700',
      '공과금': 'bg-amber-100 text-amber-700',
      '기타': 'bg-rose-100 text-rose-700'
    }
  }
};

const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

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
    <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} ${font} transition-colors duration-300`}>
      <div className={`border-b ${currentTheme.border} ${currentTheme.card} sticky top-0 z-10`}>
        <div className="flex">
          {[
            { key: 'daily', label: '오늘' },
            { key: 'week', label: '주간' },
            { key: 'month', label: '월간' },
            { key: 'settings', label: <Settings size={18} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key)}
              className={`flex-1 py-4 text-sm transition-all duration-200 ${
                currentView === tab.key 
                  ? `border-b-2 ${currentTheme.primary.split(' ')[0].replace('bg-', 'border-')} font-medium` 
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fadeIn">
        {currentView === 'daily' && (
          <div className="p-4 space-y-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.text} text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentTheme.primary.split(' ')[0].replace('bg-', '')}`}
            />

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">지출 내역</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`p-3 rounded-full ${currentTheme.primary} ${currentTheme.primaryHover} transition-all duration-200 active:scale-95`}
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddForm && (
                <div className={`mb-6 p-5 rounded-2xl border ${currentTheme.border} ${currentTheme.card} space-y-3 animate-slideDown`}>
                  <div className="flex gap-2">
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className={`flex-1 p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                      className={`p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="금액"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  />
                  <input
                    type="text"
                    placeholder="항목 이름 (예: 김치찌개)"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  />
                  <textarea
                    placeholder="메모 (예: 솔직히 좀 비싸긴 했는데 든든한 한 끼가 먹고 싶었음)"
                    value={newItem.memo}
                    onChange={(e) => setNewItem({ ...newItem, memo: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${currentTheme.input} min-h-20 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  />
                  <input
                    type="text"
                    placeholder="태그 (콤마로 구분: 외식, 데이트)"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  />
                  <button
                    onClick={addItem}
                    className={`w-full py-3 rounded-xl ${currentTheme.primary} ${currentTheme.primaryHover} font-medium transition-all duration-200 active:scale-95`}
                  >
                    추가
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {todayData.items
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((item, index) => {
                    const Icon = CATEGORY_ICONS[item.category];
                    return (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-2xl border ${currentTheme.border} ${currentTheme.card} transition-all duration-200 hover:scale-[1.01] animate-slideIn`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${currentTheme.categories[item.category]}`}>
                                <Icon size={12} />
                                {item.category}
                              </span>
                              <span className={`text-xs ${currentTheme.accent}`}>{item.time}</span>
                            </div>
                            <div className="font-medium text-base mb-1">{item.name}</div>
                            {item.memo && <div className={`text-sm ${currentTheme.accent} leading-relaxed`}>{item.memo}</div>}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {item.tags.map((tag, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-1 rounded-full ${currentTheme.secondary} flex items-center gap-1`}>
                                    <Tag size={10} />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="font-semibold whitespace-nowrap text-lg">{item.amount.toLocaleString()}원</span>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="opacity-40 hover:opacity-100 transition-all duration-200 active:scale-90"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className={`mt-6 pt-6 border-t ${currentTheme.border}`}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">오늘 총액</span>
                  <span className="text-3xl font-bold">{dailyTotal.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">하루 총평</h2>
              <textarea
                value={todayData.dailyNote}
                onChange={(e) => updateNote(e.target.value)}
                placeholder="오늘 하루 소비는 어땠나요?"
                className={`w-full p-4 rounded-2xl border ${currentTheme.input} min-h-28 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              />
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold">주간 통계</h2>
            
            <div className="p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}">
              <div className="flex items-end justify-between h-48 gap-3">
                {weekData.map((day, index) => {
                  const maxAmount = Math.max(...weekData.map(d => d.total));
                  const height = maxAmount > 0 ? (day.total / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="w-full flex flex-col justify-end h-40">
                        <div
                          className={`w-full ${currentTheme.primary} rounded-t-xl transition-all duration-500`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-xs mt-2 font-medium">
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

            <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">주간 총액</span>
                <span className="text-3xl font-bold">
                  {weekData.reduce((sum, day) => sum + day.total, 0).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'month' && (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold">월간 통계</h2>
            
            <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
              <div className="flex justify-between mb-3">
                <span className={`text-base ${currentTheme.accent}`}>총 지출</span>
                <span className="text-2xl font-bold">{monthData.total.toLocaleString()}원</span>
              </div>
              <div className={`flex justify-between text-sm ${currentTheme.accent}`}>
                <span>기록된 날</span>
                <span className="font-medium">{monthData.days}일</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">카테고리별 지출</h3>
              <div className="space-y-4">
                {Object.entries(monthData.categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount], index) => {
                    const percentage = monthData.total > 0 ? (amount / monthData.total) * 100 : 0;
                    const Icon = CATEGORY_ICONS[category];
                    
                    return (
                      <div key={category} className="animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex justify-between mb-2">
                          <span className={`font-medium flex items-center gap-2 ${currentTheme.categories[category]} px-3 py-1 rounded-full text-sm`}>
                            <Icon size={14} />
                            {category}
                          </span>
                          <span className="font-semibold text-lg">{amount.toLocaleString()}원</span>
                        </div>
                        <div className={`w-full h-3 rounded-full ${currentTheme.secondary} overflow-hidden`}>
                          <div
                            className={`h-full ${currentTheme.primary} rounded-full transition-all duration-700`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className={`text-xs ${currentTheme.accent} mt-1 text-right font-medium`}>
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
          <div className="p-4 space-y-8">
            <h2 className="text-2xl font-bold">설정</h2>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">테마</h3>
              <div className="space-y-3">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`w-full p-5 rounded-2xl border ${currentTheme.border} ${currentTheme.card} text-left transition-all duration-200 active:scale-95 ${
                      theme === key ? `ring-2 ring-offset-2 ring-${currentTheme.primary.split(' ')[0].replace('bg-', '')}` : ''
                    }`}
                  >
                    <div className="font-semibold text-lg mb-3">{t.name}</div>
                    <div className="flex gap-2">
                      <div className={`w-10 h-10 rounded-xl ${t.bg} border`}></div>
                      <div className={`w-10 h-10 rounded-xl ${t.primary}`}></div>
                      <div className={`w-10 h-10 rounded-xl ${t.secondary}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">글꼴</h3>
              <div className="space-y-3">
                {FONTS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFont(f.value)}
                    className={`w-full p-5 rounded-2xl border ${currentTheme.border} ${currentTheme.card} text-left ${f.value} transition-all duration-200 active:scale-95 ${
                      font === f.value ? `ring-2 ring-offset-2 ring-${currentTheme.primary.split(' ')[0].replace('bg-', '')}` : ''
                    }`}
                  >
                    <div className="font-semibold text-lg">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
          animation-fill-mode: both;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}