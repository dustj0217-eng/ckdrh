import { DayData, Item } from '@/lib/types';

interface Params {
  data: DayData[];
  setData: (d: DayData[]) => void;
  selectedDate: string;
  allTags: string[];
  setAllTags: (t: string[]) => void;
}

export function useExpenses({
  data,
  setData,
  selectedDate,
  allTags,
  setAllTags
}: Params) {
  const todayData =
    data.find(d => d.date === selectedDate) ??
    { date: selectedDate, items: [], dailyNote: '' };

  const dailyTotal = todayData.items.reduce((s, i) => s + i.amount, 0);

  const normalizeTags = (tags: string[]) => {
    tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        setAllTags([...allTags, tag]);
      }
    });
  };

  const addExpense = (item: Omit<Item, 'id'>) => {
    normalizeTags(item.tags);

    const newItem: Item = { ...item, id: Date.now() };

    const exists = data.find(d => d.date === selectedDate);

    if (exists) {
      setData(data.map(d =>
        d.date === selectedDate
          ? { ...d, items: [...d.items, newItem] }
          : d
      ));
    } else {
      setData([...data, {
        date: selectedDate,
        items: [newItem],
        dailyNote: ''
      }]);
    }
  };

  const updateExpense = (id: number, updated: Omit<Item, 'id'>) => {
    normalizeTags(updated.tags);

    setData(data.map(d =>
      d.date === selectedDate
        ? {
            ...d,
            items: d.items.map(i =>
              i.id === id ? { ...updated, id } : i
            )
          }
        : d
    ));
  };

  const deleteExpense = (id: number) => {
    setData(data.map(d =>
      d.date === selectedDate
        ? { ...d, items: d.items.filter(i => i.id !== id) }
        : d
    ));
  };

  const updateNote = (note: string) => {
    const exists = data.find(d => d.date === selectedDate);

    if (exists) {
      setData(data.map(d =>
        d.date === selectedDate ? { ...d, dailyNote: note } : d
      ));
    } else {
      setData([...data, { date: selectedDate, items: [], dailyNote: note }]);
    }
  };

  return {
    todayData,
    dailyTotal,
    addExpense,
    updateExpense,
    deleteExpense,
    updateNote
  };
}
