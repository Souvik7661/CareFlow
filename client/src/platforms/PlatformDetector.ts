/**
 * CareFlow AI — Cross-Platform OS Detection and Optimization Engine
 * Supports native-feeling adaptation for:
 * - Android (Material ripples, hardware back-button, system bar colors, haptics)
 * - iOS (Safe Area insets, Dynamic Island/notch handling, Cupertino touches, WebClip)
 * - Windows (Windows 11 Fluent scrollbars, Mica glass, Ctrl shortcuts, tile notifications)
 * - macOS (Apple SF Pro typography stack, Frosted glass vibrancy, Cmd+K Spotlight, traffic light header)
 */

export type SupportedOS = 'android' | 'ios' | 'windows' | 'mac';

class PlatformEngine {
  private overrideOS: SupportedOS | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    const saved = localStorage.getItem('careflow_override_os');
    if (saved && ['android', 'ios', 'windows', 'mac'].includes(saved)) {
      this.overrideOS = saved as SupportedOS;
    }
  }

  /**
   * Auto-detect the underlying operating system
   */
  public getDetectedOS(): SupportedOS {
    if (typeof window === 'undefined' || !navigator) return 'mac';

    const ua = navigator.userAgent || '';
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

    // Android
    if (/Android/i.test(ua)) {
      return 'android';
    }

    // iOS (iPhone, iPod, or iPad including iPadOS reporting MacIntel with touch points)
    if (/iPhone|iPad|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }

    // Windows
    if (/Win/i.test(platform) || /Windows/i.test(ua)) {
      return 'windows';
    }

    // macOS
    if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) {
      return 'mac';
    }

    return 'mac';
  }

  /**
   * Get active OS (honors manual preview override if set)
   */
  public getActiveOS(): SupportedOS {
    return this.overrideOS || this.getDetectedOS();
  }

  /**
   * Override OS for previewing / testing platform specific UI
   */
  public setOSOverride(os: SupportedOS | null): void {
    this.overrideOS = os;
    if (os) {
      localStorage.setItem('careflow_override_os', os);
    } else {
      localStorage.removeItem('careflow_override_os');
    }
    this.applyOSToDocument();
  }

  /**
   * Apply data-os attribute to <html> so CSS selectors like [data-os="ios"] trigger
   */
  public applyOSToDocument(): void {
    if (typeof document === 'undefined') return;
    const os = this.getActiveOS();
    document.documentElement.setAttribute('data-os', os);

    // Sync theme-color meta tag for Android / iOS browser header
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (os === 'android') {
      metaThemeColor.setAttribute('content', isDark ? '#060c18' : '#0d9488');
    } else if (os === 'ios') {
      metaThemeColor.setAttribute('content', isDark ? '#000000' : '#ffffff');
    } else {
      metaThemeColor.setAttribute('content', isDark ? '#060c18' : '#0d9488');
    }
  }

  /**
   * Check if running as installed PWA / standalone app
   */
  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  /**
   * Cross-platform physical/auditory haptic feedback
   */
  public triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'): void {
    const os = this.getActiveOS();

    // Hardware vibration on Android / supported devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(25);
            break;
          case 'heavy':
            navigator.vibrate(45);
            break;
          case 'success':
            navigator.vibrate([15, 40, 20]);
            break;
          case 'warning':
            navigator.vibrate([30, 50, 30, 50]);
            break;
        }
      } catch (e) {
        // Ignore vibration errors
      }
    }

    // Subtle audio micro-click synthesizer for iOS / Desktop tactile confirmation
    if (os !== 'android') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          if (!this.audioCtx) {
            this.audioCtx = new AudioContextClass();
          }
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          const now = this.audioCtx.currentTime;
          const freq = type === 'success' ? 880 : type === 'heavy' ? 220 : 540;
          osc.frequency.setValueAtTime(freq, now);
          osc.type = 'sine';

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

          osc.start(now);
          osc.stop(now + 0.05);
        }
      } catch (e) {
        // Ignore audio errors
      }
    }
  }

  /**
   * Get OS Display Info
   */
  public getOSInfo() {
    const active = this.getActiveOS();
    const detected = this.getDetectedOS();
    const isOverride = this.overrideOS !== null;

    const metadata = {
      android: {
        name: 'Android',
        icon: '🤖',
        badge: 'Android Material You',
        shortcutLabel: 'Back button & Touch haptics enabled',
        fileTitle: 'CareFlow.apk (Android Package)',
        features: [
          'Material 3 rounded elevation & touch ripples',
          'Dynamic status bar color synchronization',
          'Hardware back-button popstate listener',
          'Native Vibration API multi-pattern haptics',
          'Android Package installer (.apk ready)'
        ]
      },
      ios: {
        name: 'Apple iOS',
        icon: '📱',
        badge: 'Apple iOS Cupertino',
        shortcutLabel: 'Dynamic Island & Safe Areas active',
        fileTitle: 'CareFlow-Apple-iOS.mobileconfig / .ipa',
        features: [
          'Apple Safe Area insets (Dynamic Island / Notch)',
          'Cupertino frosted glass navigation tabs',
          'Rubber-band scroll momentum & tap-zoom lock',
          'Apple iOS WebClip & Profile package (.mobileconfig)',
          'Full-screen standalone display mode'
        ]
      },
      windows: {
        name: 'Windows 11',
        icon: '🪟',
        badge: 'Windows Fluent UI',
        shortcutLabel: 'Ctrl+K Search • Ctrl+B Booking',
        fileTitle: 'CareFlow-Windows.exe',
        features: [
          'Windows 11 Fluent Design & Mica acrylic glass',
          'Custom sleek Windows scrollbars (thin track & thumb)',
          'Ctrl+K spotlight search & Ctrl+B booking shortcuts',
          'Native Windows Executable installer (.exe)',
          'Windows Live Tile & Start Menu browserconfig'
        ]
      },
      mac: {
        name: 'macOS Sonoma/Sequoia',
        icon: '🍎',
        badge: 'macOS Frosted Vibrancy',
        shortcutLabel: 'Cmd+K Search • Cmd+B Booking',
        fileTitle: 'CareFlow-Mac.dmg',
        features: [
          'Apple SF Pro typography hierarchy',
          'Ultra-deep frosted glass vibrancy (blur 28px)',
          'Cmd+K Spotlight search & Cmd shortcuts',
          'Native Apple macOS Disk Image package (.dmg)',
          'Apple traffic light window control clearance'
        ]
      }
    };

    return {
      active,
      detected,
      isOverride,
      ...metadata[active]
    };
  }
}

export const platform = new PlatformEngine();
