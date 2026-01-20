// components/TabViews.tsx
"use client"

import { useState, useMemo } from 'react';
import { Plus, X, Tag, Cloud, LogOut } from 'lucide-react';
import { CATEGORY_ICONS, THEMES, CATEGORIES, FONTS } from '@/lib/constants';
import { DayData, Item } from '@/lib/types';

interface TabViewsProps {
  currentView: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  data: DayData[];
  setData: (data: DayData[]) => void;
  allTags: string[];
  setAllTags: (tags: string[]) => void;
  theme: string;
  setTheme: (theme: string) => void;
  font: string;
  setFont: (font: string) => void;
  userPin: string;
  onLogout: () => void;
}

export default function TabViews({
  currentView,
  selectedDate,
  setSelectedDate,
  data,
  setData,
  allTags,
  setAllTags,
  theme,
  setTheme,
  font,
  setFont,
  userPin,
  onLogout
}: TabViewsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    category: '식비',
    amount: '',
    name: '',
    memo: '',
    time: new Date().toTimeString().slice(0, 5),
    tags: ''
  });

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
          ? {
            ...d, items: [...d.items, {
              id: Date.now(),
              category: newItem.category,
              amount: parseInt(newItem.amount),
              name: newItem.name,
              memo: newItem.memo,
              time: newItem.time,
              tags: tags
            }]
          }
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

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setNewItem({
      category: item.category,
      amount: item.amount.toString(),
      name: item.name,
      memo: item.memo,
      time: item.time,
      tags: item.tags.join(', ')
    });
    setShowAddForm(false);
  };

  const updateItem = () => {
    if (!newItem.amount || !newItem.name || editingId === null) return;

    const tags = newItem.tags.split(',').map(t => t.trim()).filter(t => t);
    tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    });

    setData(data.map(d =>
      d.date === selectedDate
        ? {
          ...d,
          items: d.items.map(item =>
            item.id === editingId
              ? {
                ...item,
                category: newItem.category,
                amount: parseInt(newItem.amount),
                name: newItem.name,
                memo: newItem.memo,
                time: newItem.time,
                tags: tags
              }
              : item
          )
        }
        : d
    ));

    setEditingId(null);
    setNewItem({
      category: '식비',
      amount: '',
      name: '',
      memo: '',
      time: new Date().toTimeString().slice(0, 5),
      tags: ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewItem({
      category: '식비',
      amount: '',
      name: '',
      memo: '',
      time: new Date().toTimeString().slice(0, 5),
      tags: ''
    });
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

  // 오늘 뷰
  if (currentView === 'daily') {
    return (
      <div className="p-4 space-y-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`w-full p-4 rounded-2xl border ${currentTheme.input} ${currentTheme.text} text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
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

          {showAddForm && !editingId && (
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
            {editingId && (
              <div className={`p-5 rounded-2xl border-2 border-blue-500 ${currentTheme.card} space-y-3 animate-slideDown`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-blue-600">항목 수정</h3>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    취소
                  </button>
                </div>
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
                  placeholder="항목 이름"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                />
                <textarea
                  placeholder="메모"
                  value={newItem.memo}
                  onChange={(e) => setNewItem({ ...newItem, memo: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${currentTheme.input} min-h-20 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                />
                <input
                  type="text"
                  placeholder="태그 (콤마로 구분)"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${currentTheme.input} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                />
                <button
                  onClick={updateItem}
                  className={`w-full py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-medium transition-all duration-200 active:scale-95`}
                >
                  수정 완료
                </button>
              </div>
            )}
            
            {todayData.items
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((item, index) => {
                const Icon = CATEGORY_ICONS[item.category];
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border ${editingId === item.id ? 'border-blue-500 opacity-50' : currentTheme.border} ${currentTheme.card} transition-all duration-200 hover:scale-[1.01] animate-slideIn cursor-pointer`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => !editingId && startEdit(item)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
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
    );
  }

  // 주간 뷰
  if (currentView === 'week') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold">주간 통계</h2>

        <div className={`p-6 rounded-2xl ${currentTheme.card} border ${currentTheme.border}`}>
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
    );
  }

  // 월간 뷰
  if (currentView === 'month') {
    return (
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
    );
  }

  // 설정 뷰
  if (currentView === 'settings') {
    return (
      <div className="p-4 space-y-8">
        <h2 className="text-2xl font-bold">설정</h2>

        <div>
          <h3 className="text-lg font-semibold mb-4">테마</h3>
          <div className="space-y-3">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`w-full p-5 rounded-2xl border ${currentTheme.border} ${currentTheme.card} text-left transition-all duration-200 active:scale-95 ${theme === key ? `ring-2 ring-offset-2` : ''
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
                className={`w-full p-5 rounded-2xl border ${currentTheme.border} ${currentTheme.card} text-left ${f.value} transition-all duration-200 active:scale-95 ${font === f.value ? `ring-2 ring-offset-2` : ''
                  }`}
              >
                <div className="font-semibold text-lg">{f.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">계정</h3>
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl ${currentTheme.secondary}`}>
              <div className="text-sm mb-2">현재 PIN 코드</div>
              <div className="font-mono text-2xl tracking-widest">{userPin}</div>
            </div>

            <button
              onClick={onLogout}
              className={`w-full p-4 rounded-2xl bg-red-100 text-red-700 text-left transition-all duration-200 active:scale-95 flex items-center gap-3`}
            >
              <LogOut size={20} />
              <div>
                <div className="font-semibold">로그아웃</div>
                <div className="text-sm text-red-600">다른 계정으로 전환</div>
              </div>
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${currentTheme.secondary}`}>
          <div className="text-sm">
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Cloud size={16} />
              Firebase 클라우드 동기화
            </div>
            <div className={currentTheme.accent}>
              • 총 {data.length}일의 기록<br />
              • {data.reduce((sum, d) => sum + d.items.length, 0)}개의 지출 항목<br />
              • {allTags.length}개의 태그<br />
              • 모든 기기에서 자동 동기화 ✨
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}