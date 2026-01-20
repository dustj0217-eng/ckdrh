"use client";

import { useState } from 'react';
import { CATEGORIES } from '@/lib/constants';

interface Props {
  mode: 'create' | 'edit';
  initial?: {
    category: string;
    amount: number;
    name: string;
    memo: string;
    time: string;
    tags: string[];
  };
  onSubmit: (v: {
    category: string;
    amount: number;
    name: string;
    memo: string;
    time: string;
    tags: string[];
  }) => void;
  onCancel?: () => void;
  theme: any;
}

export default function ExpenseForm({ mode, initial, onSubmit, onCancel, theme }: Props) {
  const [form, setForm] = useState({
    category: initial?.category ?? '식비',
    amount: initial?.amount?.toString() ?? '',
    name: initial?.name ?? '',
    memo: initial?.memo ?? '',
    time: initial?.time ?? new Date().toTimeString().slice(0, 5),
    tags: initial?.tags?.join(', ') ?? ''
  });

  const submit = () => {
    if (!form.amount || !form.name) return;

    onSubmit({
      category: form.category,
      amount: parseInt(form.amount),
      name: form.name,
      memo: form.memo,
      time: form.time,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <div className={`p-5 rounded-2xl border ${theme.border} ${theme.card} space-y-3`}>
      <div className="flex gap-2">
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className={`flex-1 p-3 rounded-xl border ${theme.input}`}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input
          type="time"
          value={form.time}
          onChange={e => setForm({ ...form, time: e.target.value })}
          className={`p-3 rounded-xl border ${theme.input}`}
        />
      </div>

      <input
        type="number"
        placeholder="금액"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
        className={`w-full p-3 rounded-xl border ${theme.input}`}
      />

      <input
        placeholder="항목 이름"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className={`w-full p-3 rounded-xl border ${theme.input}`}
      />

      <textarea
        placeholder="메모"
        value={form.memo}
        onChange={e => setForm({ ...form, memo: e.target.value })}
        className={`w-full p-3 rounded-xl border ${theme.input}`}
      />

      <input
        placeholder="태그 (콤마)"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
        className={`w-full p-3 rounded-xl border ${theme.input}`}
      />

      <button
        onClick={submit}
        className={`w-full py-3 rounded-xl ${theme.primary}`}
      >
        {mode === 'create' ? '추가' : '수정 완료'}
      </button>

      {onCancel && (
        <button onClick={onCancel} className="w-full text-sm opacity-60">
          취소
        </button>
      )}
    </div>
  );
}
