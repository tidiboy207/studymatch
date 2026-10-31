import React from 'react';
import { Calendar, Clock, Check, Sparkles } from 'lucide-react';
import { DAYS_OF_WEEK, SHIFTS, getAvailabilitySummary } from '../../data/subjectsCatalog';

interface WeeklyAvailabilityEditorProps {
  freeSlots: string[];
  onChange: (slots: string[]) => void;
  readOnly?: boolean;
}

export const WeeklyAvailabilityEditor: React.FC<WeeklyAvailabilityEditorProps> = ({
  freeSlots,
  onChange,
  readOnly = false
}) => {
  const toggleSlot = (code: string) => {
    if (readOnly) return;
    if (freeSlots.includes(code)) {
      onChange(freeSlots.filter(s => s !== code));
    } else {
      onChange([...freeSlots, code]);
    }
  };

  const naturalSummary = getAvailabilitySummary(freeSlots);

  return (
    <div className="rounded-2xl bg-white border border-[#365C4A]/15 p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Header & Natural Language Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#365C4A]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#365C4A]/10 text-[#365C4A] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#365C4A]">Lịch rảnh của tôi</h4>
            <p className="text-xs text-[#553F35]/70">Lưới 3 ca × 7 ngày dùng để thuật toán tự động khớp lịch học</p>
          </div>
        </div>

        {/* Counter Badge */}
        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#A7B99A]/20 text-[#365C4A] font-bold text-xs border border-[#A7B99A]/40">
          Đã chọn: {freeSlots.length} ca
        </span>
      </div>

      {/* Natural Summary Pill */}
      <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#D89C57]/30 flex items-start gap-2.5 text-xs text-[#553F35]">
        <Sparkles className="w-4 h-4 text-[#D89C57] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#365C4A]">Tóm tắt lịch rảnh: </span>
          <span className="italic">{naturalSummary}</span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto pb-1">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-bold text-[#553F35]/80 uppercase tracking-wider">Ca / Ngày</th>
              {DAYS_OF_WEEK.map(d => (
                <th key={d.key} className="p-2 text-xs font-bold text-[#365C4A]">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIFTS.map(shift => (
              <tr key={shift.key} className="border-t border-[#365C4A]/10">
                <td className="p-2 text-left text-xs font-semibold text-[#553F35]">
                  <div>{shift.label}</div>
                  <div className="text-[10px] text-[#553F35]/60 font-normal">{shift.time}</div>
                </td>
                {DAYS_OF_WEEK.map(day => {
                  const code = `${day.key}_${shift.key}`;
                  const isChecked = freeSlots.includes(code);
                  return (
                    <td key={code} className="p-1 sm:p-1.5">
                      <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => toggleSlot(code)}
                        className={`w-full py-2 sm:py-2.5 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-1 ${
                          isChecked
                            ? 'bg-[#365C4A] text-white shadow-md shadow-[#365C4A]/20 hover:bg-[#2B4A3B]'
                            : 'bg-[#F8F5EE] text-[#553F35]/40 hover:bg-[#EBE8DF] hover:text-[#553F35] border border-[#365C4A]/10'
                        } ${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                        title={`${day.label} (${shift.label})`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#A7B99A]" />
                            <span className="hidden sm:inline">Rảnh</span>
                          </>
                        ) : (
                          <span className="text-[#553F35]/30">—</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="flex items-center justify-between text-[11px] text-[#553F35]/70 pt-1">
          <span>💡 Bấm vào ô bất kỳ để chọn hoặc bỏ chọn ca rảnh.</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange(['T2_TOI', 'T4_TOI', 'T6_TOI'])}
              className="text-[#365C4A] hover:underline font-semibold"
            >
              Chọn tối 2-4-6
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onChange(['T3_TOI', 'T5_TOI', 'CN_TOI'])}
              className="text-[#365C4A] hover:underline font-semibold"
            >
              Chọn tối 3-5-CN
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
