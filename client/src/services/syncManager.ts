/**
 * CareFlow Offline Synchronization Manager
 * Detects online/offline network transitions and automatically syncs pending rural bookings.
 */

import { offlineStorage, OfflineSyncItem } from './offlineStorage';

type SyncListener = (status: { isOnline: boolean; isSyncing: boolean; pendingCount: number }) => void;

class SyncManager {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Initial check & auto-sync if pending items exist
      setTimeout(() => {
        if (this.isOnline) {
          this.syncPendingBookings();
        }
      }, 2000);
    }
  }

  public getStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: 0
    };
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async notify() {
    const queue = await offlineStorage.getSyncQueue();
    const status = {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: queue.length
    };
    for (const l of this.listeners) {
      try {
        l(status);
      } catch (e) {}
    }
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    this.notify();

    if (online) {
      console.log('[SyncManager] Internet restored! Triggering auto-sync for rural offline bookings...');
      this.syncPendingBookings();
    } else {
      console.log('[SyncManager] Offline mode detected. All actions will be safely stored in CareFlowOfflineDB.');
    }
  }

  /**
   * Transmits all pending offline bookings to the hospital server
   */
  public async syncPendingBookings(): Promise<number> {
    if (this.isSyncing || !this.isOnline) return 0;

    const queue = await offlineStorage.getSyncQueue();
    if (queue.length === 0) return 0;

    this.isSyncing = true;
    this.notify();

    let syncedCount = 0;

    for (const item of queue) {
      if (item.type === 'APPOINTMENT_BOOKING') {
        try {
          const res = await fetch('/api/appointments/book', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item.payload)
          });

          if (res.ok) {
            const data = await res.json();
            syncedCount++;

            // Update local appointment record with server details
            if (data?.appointment && item.payload.patientId) {
              const localAppts = await offlineStorage.getAppointments(item.payload.patientId);
              const updated = localAppts.map(a => {
                if (a.token_number === item.localToken || a.tokenNumber === item.localToken) {
                  return {
                    ...a,
                    ...data.appointment,
                    isOffline: false,
                    isSynced: true
                  };
                }
                return a;
              });
              await offlineStorage.saveAppointments(item.payload.patientId, updated);
            }

            // Remove synced item from queue
            await offlineStorage.removeSyncQueueItem(item.id);
          } else {
            console.warn('[SyncManager] Server responded with error during sync:', res.status);
          }
        } catch (err) {
          console.warn('[SyncManager] Sync request failed:', err);
          break; // Stop if network drops again
        }
      }
    }

    this.isSyncing = false;
    this.notify();

    if (syncedCount > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('careflow:synced', { detail: { count: syncedCount } }));
    }

    return syncedCount;
  }
}

export const syncManager = new SyncManager();
