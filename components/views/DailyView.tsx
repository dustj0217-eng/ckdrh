"use client";

import { Plus } from 'lucide-react';
import { useState } from 'react';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpenseList from '@/components/expense/ExpenseList';
import { useExpenses } from '@/hooks/useExpenses';
import { THEMES } from '@/lib/constants';

export default function DailyView(props: any) {
  const theme = THEMES[props.theme];
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    todayData,
    dailyTotal,
    addExpense,
    updateExpense,
    deleteExpense,
    updateNote
  } = useExpenses(props);

  return (
    <div className="p-4 space-y-6">
      <input
        type="date"
        value={props.selectedDate}
        onChange={e => props.setSelectedDate(e.target.value)}
        className={`w-full p-4 rounded-2xl border ${theme.input}`}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">지출 내역</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-3 rounded-full ${theme.primary}`}
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          mode="create"
          theme={theme}
          onSubmit={(v) => {
            addExpense(v);
            setShowForm(false);
          }}
        />
      )}

      {editing && (
        <ExpenseForm
          mode="edit"
          theme={theme}
          initial={editing}
          onSubmit={(v) => {
            updateExpense(editing.id, v);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <ExpenseList
        items={todayData.items}
        theme={theme}
        onEdit={setEditing}
        onDelete={deleteExpense}
      />

      <div className="flex justify-between text-xl font-bold">
        <span>오늘 총액</span>
        <span>{dailyTotal.toLocaleString()}원</span>
      </div>

      <textarea
        value={todayData.dailyNote}
        onChange={e => updateNote(e.target.value)}
        placeholder="하루 총평"
        className={`w-full p-4 rounded-2xl border ${theme.input}`}
      />
    </div>
  );
}
