"use client";

import ExpenseItem from './ExpenseItem';
import { Item } from '@/lib/types';

interface Props {
  items: Item[];
  theme: any;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseList({ items, theme, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {items
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(item => (
          <ExpenseItem
            key={item.id}
            item={item}
            theme={theme}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}
