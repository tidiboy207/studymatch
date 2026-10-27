import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { dataService } from '../../services/dataService';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface InRoomChatProps {
  sessionId: string;
  currentUser: UserProfile;
  partnerName: string;
}

export const InRoomChat: React.FC<InRoomChatProps> = ({
  sessionId,
  currentUser,
  partnerName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-seed-1',
      senderId: 'system',
      senderName: 'Hệ thống',
      text: 'Chào mừng hai bạn vào phòng học cam kết! Hãy tích chọn Checklist và bắt đầu hiệp Pomodoro 25 phút.',
      timestamp: '20:00'
    },
    {
      id: 'msg-seed-2',
      senderId: 'partner',
      senderName: partnerName,
      text: 'Chào bạn, mình đã mở sẵn cẩm nang công thức trên bảng trắng rồi nhé!',
      timestamp: '20:01'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Math chips
  const mathSymbols = ['∫', '∑', 'lim', 'λ', 'ΔG', 'A⁻¹', 'det(A)', 'e^x'];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lắng nghe Realtime tin nhắn
  useEffect(() => {
    const unsub = dataService.subscribeToBroadcast((ev) => {
      if (ev.type === 'CHAT_MSG' && ev.sessionId === sessionId) {
        setMessages((prev) => [...prev, ev.msg]);
      }
    });
    return unsub;
  }, [sessionId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.display_name,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    dataService.broadcastEvent({
      type: 'CHAT_MSG',
      sessionId,
      msg: newMsg
    });

    setInputText('');
  };

  const handleInsertSymbol = (sym: string) => {
    setInputText((prev) => prev + sym);
  };

  return (
    <div className="flex flex-col h-[340px] rounded-2xl bg-slate-900 border border-slate-800 shadow-lg overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>Trao đổi nội bộ ({partnerName})</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">P2P Encrypted</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
        {messages.map((m) => {
          const isMe = m.senderId === currentUser.id;
          const isSys = m.senderId === 'system';

          if (isSys) {
            return (
              <div key={m.id} className="text-center my-1">
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] text-indigo-300 border border-slate-800">
                  {m.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1">
                <span className="font-semibold text-slate-300">{isMe ? 'Bạn' : m.senderName}</span>
                <span>• {m.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-none shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Math Quick Symbols Chips */}
      <div className="px-3 py-1 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto text-[10px]">
        <span className="text-slate-500 shrink-0 font-mono">Ký hiệu:</span>
        {mathSymbols.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => handleInsertSymbol(` ${sym} `)}
            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono transition-all shrink-0"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn giải bài tập..."
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
