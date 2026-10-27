import React, { useState, useEffect, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Copy,
  ExternalLink,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { UserProfile, StudySession } from '../../types';

interface P2PCameraMeshProps {
  currentUser: UserProfile;
  session: StudySession;
}

export const P2PCameraMesh: React.FC<P2PCameraMeshProps> = ({ currentUser, session }) => {
  const [activeVideoTab, setActiveVideoTab] = useState<'p2p' | 'external'>('p2p');
  
  // Media states
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdInput, setRemotePeerIdInput] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);

  const partnerName = session.partner_profile?.display_name || 'Bạn học ghép cặp';

  // Khởi tạo Media Stream & PeerJS
  useEffect(() => {
    let streamTrack: MediaStream | null = null;

    async function initMediaAndPeer() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        streamTrack = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn('Camera/Mic not available, using simulated stream for demo:', err);
        setMediaError('Không phát hiện camera/mic thực tế. Chế độ mô phỏng P2P đang chạy.');
      }

      // Khởi tạo PeerJS
      const prefix = currentUser.id.slice(0, 8);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `studymatch-${prefix}-${randomSuffix}`;
      
      try {
        const peer = new Peer(generatedId, {
          debug: 1
        });

        peer.on('open', (id) => {
          setPeerId(id);
        });

        peer.on('call', (incomingCall) => {
          if (localStreamRef.current) {
            incomingCall.answer(localStreamRef.current);
          } else {
            incomingCall.answer();
          }
          callRef.current = incomingCall;

          incomingCall.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
          });
        });

        peer.on('error', (err) => {
          console.warn('PeerJS error', err);
        });

        peerRef.current = peer;
      } catch (e) {
        console.warn('PeerJS init failed', e);
      }
    }

    initMediaAndPeer();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (callRef.current) {
        callRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [currentUser.id]);

  // Toggle Camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    } else {
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  // Connect to Remote Peer
  const handleConnectPeer = () => {
    if (!peerRef.current || !remotePeerIdInput.trim()) return;

    if (localStreamRef.current) {
      const call = peerRef.current.call(remotePeerIdInput.trim(), localStreamRef.current);
      callRef.current = call;
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setIsConnected(true);
      });
    } else {
      // Simulate connection in demo mode
      setIsConnected(true);
    }
  };

  const copyPeerId = () => {
    if (!peerId) return;
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Tab Switcher: P2P WebRTC vs Safe Fallback External Meet */}
      <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
        <button
          onClick={() => setActiveVideoTab('p2p')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeVideoTab === 'p2p'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Video P2P (0% Bên thứ 3)</span>
        </button>

        <button
          onClick={() => setActiveVideoTab('external')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeVideoTab === 'external'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span>Dự phòng (Meet/Discord)</span>
        </button>
      </div>

      {/* TAB 1: P2P WEBRTC MESH */}
      {activeVideoTab === 'p2p' ? (
        <div className="space-y-2.5">
          {/* 2 Camera Windows Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            
            {/* Camera 1: Local User */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner group">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${
                  isCameraOn ? 'block' : 'hidden'
                }`}
              />
              {!isCameraOn && (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                    {currentUser.display_name.charAt(0)}
                  </div>
                  <span className="text-[10px] mt-1 text-slate-400">Camera đang tắt</span>
                </div>
              )}

              {/* Local Overlay Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1">
                <span>Bạn ({currentUser.display_name.split(' ').pop()})</span>
                {!isMicOn && <MicOff className="w-3 h-3 text-rose-400" />}
              </div>
            </div>

            {/* Camera 2: Remote Peer */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${isConnected ? 'block' : 'hidden'}`}
              />
              {!isConnected && (
                <div className="flex flex-col items-center justify-center text-center p-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-sm font-bold text-white shadow mb-1">
                    {partnerName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{partnerName}</span>
                  <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Đang kết nối P2P...
                  </span>
                </div>
              )}

              {/* Partner Overlay Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{partnerName}</span>
              </div>
            </div>

          </div>

          {/* Quick Mic / Cam Action Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCameraOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
                title={isCameraOn ? 'Tắt camera' : 'Bật camera'}
              >
                {isCameraOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                <span className="text-[11px]">{isCameraOn ? 'Cam Bật' : 'Cam Tắt'}</span>
              </button>

              <button
                onClick={toggleMic}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isMicOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
                title={isMicOn ? 'Tắt micro' : 'Bật micro'}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-indigo-400" /> : <MicOff className="w-4 h-4" />}
                <span className="text-[11px]">{isMicOn ? 'Mic Bật' : 'Mic Tắt'}</span>
              </button>
            </div>

            {/* Quick Peer Connect Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyPeerId}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 flex items-center gap-1"
                title="Sao chép mã kết nối nhanh P2P"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Đã chép' : 'Mã P2P'}</span>
              </button>
            </div>
          </div>

          {/* Quick Connect Code Input for 2 Tabs */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono shrink-0">Ghép mã:</span>
            <input
              type="text"
              value={remotePeerIdInput}
              onChange={(e) => setRemotePeerIdInput(e.target.value)}
              placeholder="Dán mã P2P của bạn học vào đây..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={handleConnectPeer}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all shrink-0"
            >
              Kết nối
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2: SAFE FALLBACK TO EXTERNAL MEET / DISCORD */
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ExternalLink className="w-4 h-4" />
            <span>Kênh Dự Phòng An Toàn Khi Bị Chặn Tường Lửa</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nếu mạng Wifi ký túc xá hoặc tường lửa của trường chặn giao thức WebRTC P2P, bạn có thể chuyển ngay sang phòng Google Meet được hệ thống gắn sẵn cho phiên học này:
          </p>
          <a
            href={session.external_meet_url || 'https://meet.google.com/new'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Mở phòng Google Meet / Discord (Tab Mới)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-[10px] text-slate-500 text-center">
            Bảng trắng đồng bộ và Bộ giám sát Anti-AFK vẫn hoạt động song song tại tab này.
          </p>
        </div>
      )}
    </div>
  );
};
