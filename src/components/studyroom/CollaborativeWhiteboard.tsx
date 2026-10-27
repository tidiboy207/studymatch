import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  Trash2,
  Download,
  Palette,
  Maximize2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface CollaborativeWhiteboardProps {
  sessionId: string;
}

interface StrokeData {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
  isEraser: boolean;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({ sessionId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    { label: 'Trắng', hex: '#ffffff' },
    { label: 'Indigo', hex: '#818cf8' },
    { label: 'Emerald', hex: '#34d399' },
    { label: 'Amber', hex: '#fbbf24' },
    { label: 'Rose', hex: '#f87171' },
    { label: 'Cyan', hex: '#38bdf8' }
  ];

  // Khởi tạo Canvas và Resize listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimension based on container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // Only resize if different to avoid wiping drawing
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        // Save current canvas content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx && canvas.width > 0) {
          tempCtx.drawImage(canvas, 0, 0);
        }

        canvas.width = rect.width;
        canvas.height = rect.height;

        // Restore content
        if (canvas.width > 0) {
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Đồng bộ Realtime Stroke từ tab khác
    const unsub = dataService.subscribeToBroadcast((ev) => {
      if (ev.sessionId !== sessionId) return;

      if (ev.type === 'DRAW_STROKE') {
        const stroke: StrokeData = ev.stroke;
        drawSegment(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.size, stroke.isEraser);
      } else if (ev.type === 'CLEAR_BOARD') {
        clearCanvasLocal();
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      unsub();
    };
  }, [sessionId]);

  const drawSegment = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    strokeColor: string,
    strokeSize: number,
    eraserMode: boolean
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = eraserMode ? '#090d16' : strokeColor;
    ctx.lineWidth = eraserMode ? strokeSize * 4 : strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.closePath();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    prevPointRef.current = getCanvasCoords(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !prevPointRef.current) return;
    const currentPoint = getCanvasCoords(e);

    const stroke: StrokeData = {
      x0: prevPointRef.current.x,
      y0: prevPointRef.current.y,
      x1: currentPoint.x,
      y1: currentPoint.y,
      color,
      size,
      isEraser
    };

    drawSegment(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.size, stroke.isEraser);

    // Phát sóng stroke qua Realtime
    dataService.broadcastEvent({
      type: 'DRAW_STROKE',
      sessionId,
      stroke
    });

    prevPointRef.current = currentPoint;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    prevPointRef.current = null;
  };

  const clearCanvasLocal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClearBoard = () => {
    clearCanvasLocal();
    dataService.broadcastEvent({
      type: 'CLEAR_BOARD',
      sessionId
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `studymatch-whiteboard-${sessionId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Whiteboard Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Tools: Pen vs Eraser */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
              !isEraser
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Bút viết công thức Toán"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bút viết</span>
          </button>

          <button
            onClick={() => setIsEraser(true)}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
              isEraser
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Tẩy nét vẽ"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tẩy</span>
          </button>
        </div>

        {/* Color Palette */}
        {!isEraser && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  color === c.hex ? 'scale-125 ring-2 ring-indigo-400' : 'hover:scale-110 opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        )}

        {/* Stroke Size Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
          {[2, 4, 8].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-2 py-0.5 rounded transition-all font-semibold ${
                size === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 2 ? 'Mảnh' : s === 4 ? 'Vừa' : 'Đậm'}
            </button>
          ))}
        </div>

        {/* Action buttons: Clear & Download */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearBoard}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 transition-all"
            title="Xóa toàn bộ bảng trắng"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Tải ảnh lời giải bài tập"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* HTML5 Canvas Area */}
      <div className="relative flex-1 bg-[#090d16] min-h-[380px] cursor-crosshair">
        {/* Math Grid background subtle pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full touch-none"
        />

        {/* Sync hint pill */}
        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-400 border border-slate-800 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Bảng trắng đồng bộ 2 chiều (P2P Realtime)</span>
        </div>
      </div>

    </div>
  );
};
