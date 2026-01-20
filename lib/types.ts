// lib/types.ts
export interface Item {
  id: number;
  category: string;
  amount: number;
  name: string;
  memo: string;
  time: string;
  tags: string[];
}

export interface DayData {
  date: string;
  items: Item[];
  dailyNote: string;
}

export interface ThemeConfig {
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