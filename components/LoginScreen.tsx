// components/LoginScreen.tsx
"use client"

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { THEMES } from '@/lib/constants';

interface LoginScreenProps {
  onLogin: (pin: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pinCode, setPinCode] = useState('');
  const currentTheme = THEMES['modern'];

  const handleLogin = () => {
    if (pinCode.length < 4) {
      alert('PIN 코드는 최소 4자리 이상이어야 합니다.');
      return;
    }
    onLogin(pinCode);
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center p-4`}>
      <div className={`w-full ${currentTheme.card} p-8 rounded-3xl border ${currentTheme.border} space-y-6`}>
        <div className="text-center">
          <div className={`w-20 h-20 ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">예산 관리 앱</h1>
          <p className={`text-sm ${currentTheme.accent}`}>PIN 코드로 로그인하세요</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="password"
            placeholder="PIN 코드 입력 (4자리 이상)"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className={`w-full p-4 rounded-2xl border ${currentTheme.input} text-center text-2xl tracking-widest`}
            maxLength={20}
          />
          
          <button
            onClick={handleLogin}
            className={`w-full py-4 rounded-2xl ${currentTheme.primary} ${currentTheme.primaryHover} font-semibold transition-all duration-200 active:scale-95`}
          >
            로그인
          </button>
        </div>

        <div className={`p-4 rounded-2xl ${currentTheme.secondary} text-sm`}>
          <p className="font-semibold mb-2">💡 처음 사용하시나요?</p>
          <p className={currentTheme.accent}>
            원하는 PIN 코드를 입력하고 로그인하면 자동으로 계정이 생성됩니다. 
            이 PIN으로 어떤 기기에서든 로그인 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}