import { create } from 'zustand';

interface SecurityState {
  biometricEnabled: boolean;
  isLocked:         boolean;
  backgroundedAt:   number | null;
  lockTimeout:      number; // seconds; 0 = lock immediately on background

  setBiometricEnabled: (v: boolean)      => void;
  lock:                ()                 => void;
  unlock:              ()                 => void;
  setBackgroundedAt:   (t: number | null) => void;
  setLockTimeout:      (s: number)        => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  biometricEnabled: false,
  isLocked:         false,
  backgroundedAt:   null,
  lockTimeout:      30,

  setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
  lock:                ()                  => set({ isLocked: true }),
  unlock:              ()                  => set({ isLocked: false }),
  setBackgroundedAt:   (backgroundedAt)    => set({ backgroundedAt }),
  setLockTimeout:      (lockTimeout)       => set({ lockTimeout }),
}));
