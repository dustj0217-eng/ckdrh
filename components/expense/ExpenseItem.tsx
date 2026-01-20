"use client";

import { X, Tag } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Item } from '@/lib/types';

interface Props {
  item: Item;
  theme: any;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseItem({ item, theme, onEdit, onDelete }: Props) {
  const Icon = CATEGORY_ICONS[item.category];

  return (
    <div
      onClick={() => onEdit(item)}
      className={`p-4 rounded-2xl border ${theme.border} ${theme.card} cursor-pointer transition-all hover:scale-[1.01]`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${theme.categories[item.category]}`}>
              <Icon size={12} />
              {item.category}
            </span>
            <span className={`text-xs ${theme.accent}`}>{item.time}</span>
          </div>

          <div className="font-medium mb-1">{item.name}</div>

          {item.memo && (
            <div className={`text-sm ${theme.accent}`}>{item.memo}</div>
          )}

          {item.tags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {item.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-full ${theme.secondary} flex items-center gap-1`}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-4">
          <span className="font-semibold text-lg">
            {item.amount.toLocaleString()}원
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="opacity-40 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
