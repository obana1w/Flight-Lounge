'use client';

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Ambient Glow Orbs - Enhanced Visibility */}
      <div className="absolute inset-0">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
        <div className="glow-orb glow-orb-4" />
      </div>

      <style jsx>{`
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0;
          animation: orbFloat 25s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .glow-orb-1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.25) 0%,
            rgba(59, 130, 246, 0.12) 40%,
            rgba(59, 130, 246, 0.05) 70%,
            transparent 100%
          );
          top: -20%;
          left: -15%;
          animation-delay: 0s;
        }

        .glow-orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.22) 0%,
            rgba(99, 102, 241, 0.10) 40%,
            rgba(99, 102, 241, 0.04) 70%,
            transparent 100%
          );
          top: 35%;
          right: -10%;
          animation-delay: -12s;
        }

        .glow-orb-3 {
          width: 650px;
          height: 650px;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.20) 0%,
            rgba(59, 130, 246, 0.10) 40%,
            rgba(59, 130, 246, 0.04) 70%,
            transparent 100%
          );
          bottom: -15%;
          left: 25%;
          animation-delay: -25s;
        }

        .glow-orb-4 {
          width: 550px;
          height: 550px;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.18) 0%,
            rgba(99, 102, 241, 0.08) 40%,
            rgba(99, 102, 241, 0.03) 70%,
            transparent 100%
          );
          top: 10%;
          left: 40%;
          animation-delay: -18s;
        }

        @keyframes orbFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          20% {
            transform: translate(100px, -80px) scale(1.15);
            opacity: 0.8;
          }
          40% {
            transform: translate(150px, 20px) scale(0.95);
            opacity: 0.6;
          }
          60% {
            transform: translate(80px, 120px) scale(1.1);
            opacity: 0.75;
          }
          80% {
            transform: translate(-80px, 60px) scale(1.05);
            opacity: 0.85;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
