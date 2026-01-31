// components/LoginScreen.tsx
"use client"

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { THEMES } from '@/lib/constants';

interface LoginScreenProps {
  onLogin: (pin: string, secret: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pinCode, setPinCode] = useState('');
  const [secretChar, setSecretChar] = useState('');
  const currentTheme = THEMES['modern'];

  const handleLogin = () => {
    if (secretChar.length === 0) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (pinCode.length < 4) {
      alert('PIN 코드는 최소 4자리 이상이어야 합니다.');
      return;
    }
    onLogin(pinCode, secretChar);
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen ${currentTheme.bg} ${currentTheme.text} flex items-center justify-center p-4`}>
      <div className={`w-full ${currentTheme.card} p-8 rounded-3xl border ${currentTheme.border} space-y-6`}>
        <div className="text-center">
          <div className={`w-20 h-20 ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">예산 관리 앱</h1>
          <p className={`text-sm ${currentTheme.accent}`}>아이디 + PIN으로 로그인</p>
        </div>

        <div>
            <label className="text-sm font-medium mb-2 block">ID</label>
            <input
              type="password"
              placeholder="한 글자 이상"
              value={secretChar}
              onChange={(e) => setSecretChar(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} text-center text-2xl tracking-widest`}
              maxLength={20}
            />
          </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">PIN 코드</label>
            <input
              type="password"
              placeholder="4자리 이상 숫자"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className={`w-full p-4 rounded-2xl border ${currentTheme.input} text-center text-2xl tracking-widest`}
              maxLength={20}
            />
          </div>
          
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
            원하는 아이디와 PIN 코드를 입력하고 로그인하면 자동으로 계정이 생성됩니다. 
            이 조합으로 어떤 기기에서든 로그인 가능합니다.
          </p>
        </div>

        <div className={`p-4 rounded-2xl bg-blue-50 text-sm`}>
          <p className="font-semibold mb-2 text-blue-900">🔒 보안 팁</p>
          <p className="text-blue-700">
            아이디: 아이디 (예: abc)
            PIN: 본인만 아는 숫자 (예: 1234)<br/>
          </p>
        </div>
      </div>
    </div>
  );
}