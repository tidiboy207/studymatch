import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
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
    <div className="flex flex-col h-[340px] rounded-3xl bg-white border border-[#365C4A]/20 shadow-md overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-3 bg-[#F8F5EE] border-b border-[#365C4A]/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-black text-[#365C4A] uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-[#D89C57]" />
          <span>Trao đổi nội bộ ({partnerName})</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          P2P Encrypted
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs bg-white">
        {messages.map((m) => {
          const isMe = m.senderId === currentUser.id;
          const isSys = m.senderId === 'system';

          if (isSys) {
            return (
              <div key={m.id} className="text-center my-1.5">
                <span className="px-3 py-1 rounded-full bg-[#F8F5EE] text-[10px] text-[#365C4A] border border-[#365C4A]/15 font-medium inline-block max-w-[90%]">
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
              <div className="flex items-center gap-1 text-[10px] text-[#553F35]/70 mb-0.5 px-1 font-medium">
                <span className="font-bold text-[#365C4A]">{isMe ? 'Bạn' : m.senderName}</span>
                <span>• {m.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] px-3.5 py-2 rounded-2xl leading-relaxed font-medium ${
                  isMe
                    ? 'bg-[#365C4A] text-white rounded-br-none shadow-sm'
                    : 'bg-[#F8F5EE] border border-[#365C4A]/15 text-[#553F35] rounded-bl-none'
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
      <div className="px-3 py-1.5 bg-[#F8F5EE] border-t border-[#365C4A]/10 flex items-center gap-1 overflow-x-auto text-[10px]">
        <span className="text-[#553F35]/60 shrink-0 font-bold">Ký hiệu:</span>
        {mathSymbols.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => handleInsertSymbol(` ${sym} `)}
            className="px-2 py-0.5 rounded-lg bg-white hover:bg-[#EBE8DF] text-[#365C4A] border border-[#365C4A]/15 font-mono font-bold transition-all shrink-0"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-[#F8F5EE] border-t border-[#365C4A]/15 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn giải bài tập..."
          className="flex-1 px-3.5 py-2 rounded-full bg-white border border-[#365C4A]/20 text-xs text-[#553F35] placeholder-[#553F35]/50 focus:outline-none focus:border-[#365C4A]"
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-[#365C4A] hover:bg-[#2B4A3B] text-white transition-all shadow-sm shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
