export const colors = {
  gold: {
    primary: '#F4C542',
    soft: 'rgba(244, 197, 66, 0.2)',
    glow: 'rgba(244, 197, 66, 0.4)',
  },
  black: {
    base: '#000000',
    surface: '#0A0A0A',
    elevated: '#141414',
  },
  white: {
    primary: '#FFFFFF',
    muted: 'rgba(255, 255, 255, 0.6)',
  }
};

export const transitions = {
  smooth: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1
  },
  snap: {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.8
  },
  cinematic: {
    type: "tween",
    ease: [0.16, 1, 0.3, 1], // expoOut
    duration: 0.8
  }
};

export const shadows = {
  glow: `0 0 15px ${colors.gold.soft}, inset 0 0 10px ${colors.gold.soft}`,
  heavy: "0 20px 50px rgba(0, 0, 0, 0.5)",
  glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
};
