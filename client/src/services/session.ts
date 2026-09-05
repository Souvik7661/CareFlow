import { User } from '../types';

const TOKEN_KEY = 'careflow_token';
const USER_KEY = 'careflow_current_user';
const REMEMBER_KEY = 'careflow_remember_me';

/**
 * Isolated Session Manager ensuring multi-user isolation.
 * Uses sessionStorage by default so that:
 * 1. Opening a new tab, window, or sharing the URL with another person starts fresh as a guest.
 * 2. Multiple users can log in simultaneously in different tabs/devices with zero data leakage.
 * 3. Page refreshes (F5 / Cmd+R) within the same tab preserve the session cleanly.
 * 4. If a user explicitly selects "Remember Me", session is stored in localStorage.
 */
export const sessionManager = {
  getToken(): string | null {
    try {
      const sessionToken = sessionStorage.getItem(TOKEN_KEY);
      if (sessionToken) return sessionToken;
      if (localStorage.getItem(REMEMBER_KEY) === 'true') {
        return localStorage.getItem(TOKEN_KEY);
      }
    } catch (e) {}
    return null;
  },

  setToken(token: string, remember: boolean = false): void {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REMEMBER_KEY, 'true');
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (e) {}
  },

  getUser(): User | null {
    try {
      const sessionUser = sessionStorage.getItem(USER_KEY);
      if (sessionUser) return JSON.parse(sessionUser);
      if (localStorage.getItem(REMEMBER_KEY) === 'true') {
        const localUser = localStorage.getItem(USER_KEY);
        if (localUser) return JSON.parse(localUser);
      }
    } catch (e) {}
    return null;
  },

  setUser(user: User | null, remember: boolean = false): void {
    try {
      if (!user) {
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_KEY);
        return;
      }
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      if (remember) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {}
  },

  clearSession(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem('careflow_latest_appointment');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem('careflow_latest_appointment');
    } catch (e) {}
  },

  getLatestAppointment(patientId?: string): any | null {
    try {
      if (patientId) {
        const str = sessionStorage.getItem(`careflow_latest_appointment_${patientId}`);
        if (str) return JSON.parse(str);
      }
      const general = sessionStorage.getItem('careflow_latest_appointment');
      if (general) return JSON.parse(general);
    } catch (e) {}
    return null;
  },

  setLatestAppointment(appt: any, patientId?: string): void {
    try {
      const data = JSON.stringify(appt);
      sessionStorage.setItem('careflow_latest_appointment', data);
      if (patientId) {
        sessionStorage.setItem(`careflow_latest_appointment_${patientId}`, data);
      }
    } catch (e) {}
  }
};
