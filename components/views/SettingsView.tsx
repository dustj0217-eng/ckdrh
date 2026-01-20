"use client";

import { Cloud, LogOut } from 'lucide-react';
import { THEMES, FONTS } from '@/lib/constants';

export default function SettingsView({
  theme,
  setTheme,
  font,
  setFont,
  userPin,
  onLogout,
  data,
  allTags
}: any) {
  const currentTheme = THEMES[theme];

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">설정</h2>

      <div>
        <h3 className="font-semibold mb-3">테마</h3>
        {Object.entries(THEMES).map(([key, t]: any) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-full p-4 rounded-2xl border ${currentTheme.border} ${currentTheme.card} mb-2`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-3">글꼴</h3>
        {FONTS.map((f: any) => (
          <button
            key={f.value}
            onClick={() => setFont(f.value)}
            className={`w-full p-4 rounded-2xl border ${currentTheme.border} ${currentTheme.card} ${f.value}`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-3">계정</h3>

        <div className={`p-4 rounded-2xl ${currentTheme.secondary} mb-3`}>
          <div className="text-sm">현재 PIN</div>
          <div className="font-mono text-2xl tracking-widest">
            {userPin}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full p-4 rounded-2xl bg-red-100 text-red-700 flex items-center gap-2"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>

      <div className={`p-4 rounded-2xl ${currentTheme.secondary}`}>
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <Cloud size={14} />
            Firebase 동기화
          </div>
          <div className={currentTheme.accent}>
            • {data.length}일 기록<br />
            • {data.reduce((s: number, d: any) => s + d.items.length, 0)}개 항목<br />
            • {allTags.length}개 태그
          </div>
        </div>
      </div>
    </div>
  );
}
