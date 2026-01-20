// lib/constants.ts
import { Coffee, Bus, ShoppingBag, Film, Home, Package } from 'lucide-react';
import { ThemeConfig } from './types';

export const CATEGORY_ICONS: Record<string, any> = {
  '식비': Coffee,
  '교통': Bus,
  '쇼핑': ShoppingBag,
  '문화': Film,
  '공과금': Home,
  '기타': Package
};

export const THEMES: Record<string, ThemeConfig> = {
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

export const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '공과금', '기타'];

export const FONTS = [
  { name: '기본', value: 'font-sans' },
  { name: '고딕', value: 'font-mono' },
  { name: '세리프', value: 'font-serif' }
];