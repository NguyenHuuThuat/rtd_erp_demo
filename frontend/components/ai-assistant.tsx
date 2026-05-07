'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { cn, formatVND } from '@/lib/utils';
import { useMockStore } from '@/lib/mock-store';
import { MOCK_APPROVALS, MOCK_FINANCIAL_KPIS } from '@/lib/mock-data';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  at: number;
}

const SUGGESTIONS = [
  'Tổng doanh thu tháng này?',
  'Có hóa đơn nào quá hạn không?',
  'Ai đang chờ duyệt?',
  'Số dư tiền mặt và ngân hàng?',
  'Top 3 đại lý nợ nhiều nhất?',
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      content:
        'Xin chào! Tôi là **RTD AI** — trợ lý dữ liệu. Hãy hỏi tôi về doanh thu, công nợ, phê duyệt, người dùng… (Demo dùng template; phase tới tích hợp Claude API thật)',
      at: Date.now(),
    },
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const partners = useMockStore((s) => s.partners);
  const invoices = useMockStore((s) => s.invoices);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function generateAnswer(q: string): string {
    const lower = q.toLowerCase();

    if (/doanh thu|revenue|bán/.test(lower)) {
      return `**Doanh thu T5/2026**: ${formatVND(MOCK_FINANCIAL_KPIS.revenueMonth)} (+9.3% so với T4).\n\nCơ cấu theo cty con:\n- RTD Feed: ~7.8 tỷ\n- RTD Farm: ~3.2 tỷ\n- RTD Food: ~1.5 tỷ\n- RTD Vet + Logistics: ~0.6 tỷ`;
    }

    if (/quá hạn|overdue|nợ.*đại lý|công nợ/.test(lower)) {
      const overdue = invoices.filter((i) => i.status !== 'PAID' && i.totalAmount > i.paidAmount);
      const top = [...partners].filter((p) => p.currentDebt > 0).sort((a, b) => b.currentDebt - a.currentDebt).slice(0, 3);
      return `Có **${overdue.length} hóa đơn** đang còn dư nợ (tổng ${formatVND(overdue.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0))}).\n\nTop 3 đại lý nợ nhiều:\n${top.map((p, i) => `${i + 1}. **${p.name}** — ${formatVND(p.currentDebt)} (hạn mức ${formatVND(p.creditLimit)})`).join('\n')}`;
    }

    if (/duyệt|approval|chờ/.test(lower)) {
      const pending = MOCK_APPROVALS.filter((a) => a.status === 'PENDING');
      return `Đang có **${pending.length} yêu cầu chờ duyệt**, tổng giá trị ${formatVND(pending.reduce((s, a) => s + a.amount, 0))}:\n${pending.map((a) => `- **${a.code}** · ${a.targetSummary} (${formatVND(a.amount)}) — chờ ${a.currentApprover}`).join('\n')}`;
    }

    if (/tiền mặt|tiền gửi|số dư|cash/.test(lower)) {
      return `Số dư tại 07/05/2026:\n- **TK 111 (Tiền mặt)**: ${formatVND(850_000_000)}\n- **TK 112 (Tiền gửi NH)**: ${formatVND(4_200_000_000)}\n- **Tổng tiền**: ${formatVND(5_050_000_000)}`;
    }

    if (/lợi nhuận|lnst|profit/.test(lower)) {
      return `**Lợi nhuận sau thuế lũy kế 5 tháng**: ${formatVND(1_884_000_000)}\n\n- Doanh thu: ${formatVND(13_135_000_000)}\n- Giá vốn: ${formatVND(9_280_000_000)}\n- LN gộp: ${formatVND(3_855_000_000)}\n- CP bán hàng + QLDN: ${formatVND(1_500_000_000)}\n- Thuế TNDN (20%): ${formatVND(471_000_000)}`;
    }

    if (/người dùng|user|account|tài khoản/.test(lower)) {
      return `Hiện có **8 user** trong hệ thống — 7 đang hoạt động, 1 tạm khóa. Phân bố theo role:\n- SUPER_ADMIN: 1\n- ADMIN: 3\n- VIEWER: 4`;
    }

    if (/help|trợ giúp|làm gì|hỏi gì/.test(lower)) {
      return 'Tôi có thể trả lời câu hỏi về:\n- 💰 Doanh thu, chi phí, lợi nhuận\n- 📑 Công nợ, hóa đơn quá hạn\n- ✅ Phê duyệt đang chờ\n- 🏦 Số dư tiền mặt/ngân hàng\n- 👥 Người dùng, vai trò\n- 🏢 Cơ cấu tổ chức\n\nHãy hỏi bằng tiếng Việt tự nhiên!';
    }

    return `Mình chưa được train câu hỏi này trong demo. Thử hỏi về:\n- "Doanh thu tháng này?"\n- "Có hóa đơn nào quá hạn?"\n- "Ai đang chờ duyệt?"\n- "Số dư tiền mặt?"\n\n💡 Phase tới sẽ tích hợp Claude API để trả lời mọi câu hỏi về dữ liệu thực tế.`;
  }

  async function send(q: string) {
    if (!q.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: q, at: Date.now() }]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const answer = generateAnswer(q);
    setMessages((prev) => [...prev, { role: 'assistant', content: answer, at: Date.now() }]);
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full shadow-xl transition-all flex items-center justify-center',
          open
            ? 'bg-slate-700 text-white rotate-180'
            : 'bg-gradient-to-br from-rtd-500 to-emerald-600 text-white hover:scale-110',
        )}
        aria-label="AI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-30 w-96 max-w-[calc(100vw-3rem)] h-[540px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in">
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-rtd-50 to-emerald-50 rounded-t-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rtd-500 to-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">RTD AI Assistant</div>
              <div className="text-xs text-rtd-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rtd-500 live-dot" />
                Sẵn sàng · Demo template
              </div>
            </div>
          </div>

          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Đang xử lý…
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-slate-400 mb-1.5">Gợi ý:</div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-slate-100 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về dữ liệu RTD…"
              className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-slate-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-rtd-600 hover:bg-rtd-700 disabled:opacity-50 text-white p-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap',
          isUser
            ? 'bg-rtd-600 text-white rounded-br-sm'
            : 'bg-slate-100 text-slate-800 rounded-bl-sm',
        )}
      >
        {formatBubbleContent(msg.content)}
      </div>
    </div>
  );
}

function formatBubbleContent(text: string): React.ReactNode {
  // Format markdown-lite: **bold**, line breaks
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
