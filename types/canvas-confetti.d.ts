declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  type ConfettiCallback = (options?: ConfettiOptions) => void;
  
  interface ConfettiFire {
    (options?: ConfettiOptions): Promise<null>;
    reset: () => void;
  }

  const confetti: ConfettiFire & ConfettiCallback;
  export default confetti;
} 