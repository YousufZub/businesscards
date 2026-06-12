import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BIOMETRIC_PREF_KEY = 'cardvault_biometric_enabled';
const LOCK_TIMEOUT_KEY   = 'cardvault_lock_timeout';

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  return LocalAuthentication.isEnrolledAsync();
}

export type BiometricType = 'Face ID' | 'Touch ID' | 'Fingerprint' | 'Passcode';

export async function getBiometricType(): Promise<BiometricType> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'Face ID';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  }
  return 'Passcode';
}

export async function authenticate(reason = 'Authenticate to access CardVault'): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage:         reason,
    fallbackLabel:         'Use Passcode',
    cancelLabel:           'Cancel',
    disableDeviceFallback: false,
  });
  return result.success;
}

export async function saveBiometricPreference(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_PREF_KEY, enabled ? '1' : '0');
}

export async function loadBiometricPreference(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(BIOMETRIC_PREF_KEY);
  return val === '1';
}

export async function saveLockTimeout(seconds: number): Promise<void> {
  await SecureStore.setItemAsync(LOCK_TIMEOUT_KEY, String(seconds));
}

export async function loadLockTimeout(): Promise<number> {
  const val = await SecureStore.getItemAsync(LOCK_TIMEOUT_KEY);
  return val ? parseInt(val, 10) : 30;
}
