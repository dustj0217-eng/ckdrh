// hooks/useBudgetData.ts
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DayData } from '@/lib/types';

export function useBudgetData(userPin: string, isLoggedIn: boolean) {
  const [data, setData] = useState<DayData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [theme, setTheme] = useState('modern');
  const [font, setFont] = useState('font-sans');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isLoading, setIsLoading] = useState(true);

  // Firebase에서 데이터 로드
  const loadFromCloud = async (pin: string) => {
    try {
      setSyncStatus('syncing');
      const docRef = doc(db, 'budgets', pin);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        setData(cloudData.data || []);
        setAllTags(cloudData.allTags || []);
        setTheme(cloudData.theme || 'modern');
        setFont(cloudData.font || 'font-sans');
      }
      setSyncStatus('synced');
      return true;
    } catch (error) {
      console.error('로드 실패:', error);
      setSyncStatus('synced');
      return true;
    }
  };

  // Firebase에 데이터 저장
  const saveToCloud = async (pin: string, dataToSave: any) => {
    try {
      setSyncStatus('syncing');
      const docRef = doc(db, 'budgets', pin);
      await setDoc(docRef, dataToSave);
      setSyncStatus('synced');
    } catch (error) {
      console.error('저장 실패:', error);
      setSyncStatus('error');
    }
  };

  // 로그인 시 데이터 로드
  useEffect(() => {
    const savedPin = localStorage.getItem('budgetPin');
    if (savedPin) {
      loadFromCloud(savedPin).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (isLoggedIn && userPin && !isLoading) {
      const dataToSave = { data, allTags, theme, font };
      saveToCloud(userPin, dataToSave);
    }
  }, [data, allTags, theme, font, isLoggedIn, userPin, isLoading]);

  return {
    data,
    setData,
    allTags,
    setAllTags,
    theme,
    setTheme,
    font,
    setFont,
    syncStatus,
    isLoading,
    setIsLoading,
    loadFromCloud
  };
}