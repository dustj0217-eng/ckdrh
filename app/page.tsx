"use client"

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface Item {
  id: number;
  category: string;
  amount: number;
  reason: string;
}

interface DayData {
  date: string;
  items: Item[];
  dailyNote: string;
}

const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

export default function BudgetTracker() {
  const [selectedDate, setSelectedDate] = useState('2026-01-20');
  const [data, setData] = useState<DayData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: '식비', amount: '', reason: '' });

  // 초기 로드
  useEffect(() => {
    const saved = localStorage.getItem('budgetData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // data 변경될 때마다 저장
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('budgetData', JSON.stringify(data));
    }
  }, [data]);

  const todayData = data.find(d => d.date === selectedDate) || { date: selectedDate, items: [], dailyNote: '' };

  const addItem = () => {
    if (!newItem.amount || !newItem.reason) return;
    
    const existingDay = data.find(d => d.date === selectedDate);
    
    if (existingDay) {
      setData(data.map(d => 
        d.date === selectedDate 
          ? { ...d, items: [...d.items, { id: Date.now(), category: newItem.category, amount: parseInt(newItem.amount), reason: newItem.reason }] }
          : d
      ));
    } else {
      setData([...data, {
        date: selectedDate,
        items: [{ id: Date.now(), category: newItem.category, amount: parseInt(newItem.amount), reason: newItem.reason }],
        dailyNote: ''
      }]);
    }
    
    setNewItem({ category: '식비', amount: '', reason: '' });
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

  const dailyTotal = todayData.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">가계부</h1>
        
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
    </div>
  );
}