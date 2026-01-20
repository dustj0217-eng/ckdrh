// app/page.tsx
"use client"

import { useState } from 'react';
import { Settings, Cloud } from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import { THEMES } from '@/lib/constants';
import LoginScreen from '@/components/LoginScreen';
import TabViews from '@/components/TabViews';

export default function BudgetTracker() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userKey, setUserKey] = useState(''); // PIN_SECRET 조합
  const [displayPin, setDisplayPin] = useState(''); // 화면에 표시할 PIN
  const [currentView, setCurrentView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const {
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
  } = useBudgetData(userKey, isLoggedIn);

  const currentTheme = THEMES[theme];

  // 로그인 핸들러
  const handleLogin = async (pin: string, secret: string) => {
    setIsLoading(true);
    const combinedKey = `${pin}_${secret}`; // PIN과 비밀문자 조합
    await loadFromCloud(combinedKey);
    localStorage.setItem('budgetKey', combinedKey);
    setUserKey(combinedKey);
    setDisplayPin(pin); // 화면 표시용으로 PIN만 저장
    setIsLoggedIn(true);
    setIsLoading(false);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('budgetKey');
      setIsLoggedIn(false);
      setUserKey('');
      setDisplayPin('');
      setData([]);
      setAllTags([]);
    }
  };

  // 로딩 화면
  if (isLoading) {
    return (
      <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center`}>
        <div className="text-center">
          <Cloud className="animate-pulse mx-auto mb-4" size={48} />
          <p>데이터 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 화면
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 메인 앱 화면
  return (
    <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} ${font} transition-colors duration-300`}>
      {/* 상단 탭 바 */}
      <div className={`border-b ${currentTheme.border} ${currentTheme.card} sticky top-0 z-10`}>
        <div className="flex">
          {[
            { key: 'daily', label: '오늘' },
            { key: 'week', label: '주간' },
            { key: 'month', label: '월간' },
            { key: 'settings', label: <Settings size={18} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key)}
              className={`flex-1 py-4 text-sm transition-all duration-200 ${
                currentView === tab.key
                  ? `border-b-2 ${currentTheme.primary.split(' ')[0].replace('bg-', 'border-')} font-medium`
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 동기화 상태 표시 */}
        <div className={`px-4 py-2 text-xs ${currentTheme.accent} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Cloud size={12} />
            <span>
              {syncStatus === 'syncing' && '동기화 중...'}
              {syncStatus === 'synced' && '동기화 완료'}
              {syncStatus === 'error' && '동기화 실패'}
            </span>
          </div>
          <span>PIN: {displayPin.replace(/./g, '•')}</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="animate-fadeIn">
        <TabViews
          currentView={currentView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          data={data}
          setData={setData}
          allTags={allTags}
          setAllTags={setAllTags}
          theme={theme}
          setTheme={setTheme}
          font={font}
          setFont={setFont}
          userPin={displayPin}
          onLogout={handleLogout}
        />
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
          animation-fill-mode: both;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}