'use client';

import { useState } from 'react';
import { Briefcase, Globe, Lock, Mail, Save, SettingsIcon, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTitle } from '@/components/page-title';
import { MOCK_SETTINGS, type MockSetting } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const CATEGORY_META: Record<MockSetting['category'], { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  general: { label: 'Tổng quan', icon: Briefcase },
  accounting: { label: 'Kế toán', icon: Wallet },
  security: { label: 'Bảo mật', icon: Lock },
  i18n: { label: 'Ngôn ngữ & Định dạng', icon: Globe },
  email: { label: 'Email', icon: Mail },
};

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<MockSetting['category']>('general');
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_SETTINGS.map((s) => [s.key, s.value])),
  );
  const [dirty, setDirty] = useState(false);

  const settings = MOCK_SETTINGS.filter((s) => s.category === activeCategory);

  function handleChange(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
    setDirty(true);
  }

  function handleSave() {
    toast.success('Đã lưu cấu hình');
    setDirty(false);
  }

  return (
    <div>
      <PageTitle
        title="Cài đặt hệ thống"
        subtitle={`${MOCK_SETTINGS.length} cấu hình · Áp dụng cho toàn tập đoàn`}
        actions={
          dirty && (
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {Object.entries(CATEGORY_META).map(([k, meta]) => {
              const Icon = meta.icon;
              const active = activeCategory === k;
              const count = MOCK_SETTINGS.filter((s) => s.category === k).length;
              return (
                <button
                  key={k}
                  onClick={() => setActiveCategory(k as MockSetting['category'])}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm border-l-2 transition',
                    active
                      ? 'border-l-rtd-600 bg-rtd-50 text-rtd-700 font-medium'
                      : 'border-l-transparent hover:bg-slate-50 text-slate-700',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{meta.label}</span>
                  <span className="text-xs text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800">{CATEGORY_META[activeCategory].label}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {settings.map((s) => (
                <div key={s.key} className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-1">
                    <div className="text-sm font-medium text-slate-800">{s.label}</div>
                    {s.description && <div className="text-xs text-slate-500 mt-0.5">{s.description}</div>}
                    <code className="text-[10px] text-slate-400 mt-1 inline-block">{s.key}</code>
                  </div>
                  <div className="md:col-span-2">
                    {s.type === 'boolean' ? (
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={values[s.key] === 'true'}
                          onChange={(e) => handleChange(s.key, e.target.checked ? 'true' : 'false')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-rtd-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rtd-600"></div>
                        <span className="ml-2 text-sm text-slate-600">
                          {values[s.key] === 'true' ? 'Bật' : 'Tắt'}
                        </span>
                      </label>
                    ) : s.type === 'select' ? (
                      <select
                        value={values[s.key]}
                        onChange={(e) => handleChange(s.key, e.target.value)}
                        className="input max-w-xs"
                      >
                        {s.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={s.type === 'number' ? 'number' : 'text'}
                        value={values[s.key]}
                        onChange={(e) => handleChange(s.key, e.target.value)}
                        className="input max-w-md"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
