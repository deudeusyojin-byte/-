import { Injectable, signal, OnDestroy } from '@angular/core';

export interface CursorPosition {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  capsuleId: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  color: string;
}

export interface CollabMessage {
  type: 'CURSOR' | 'JOIN' | 'LEAVE' | 'ITEM_UPDATE' | 'ITEM_ADD' | 'CHAT' | 'CAPSULE_RESET';
  payload: any;
  capsuleId: string;
  senderId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollabService implements OnDestroy {
  private channel = new BroadcastChannel('time_capsuffle_collab_v2');
  
  // Signals for components to consume
  activeCursors = signal<CursorPosition[]>([]);
  remoteUpdates = signal<any>(null); // Trigger for items update
  chatMessages = signal<ChatMessage[]>([]);
  notifications = signal<string[]>([]);

  private myId = '';
  private currentCapsuleId = '';
  private cleanupTimer: any;

  constructor() {
    this.channel.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    // Periodic cleanup of stale cursors (older than 10s)
    this.cleanupTimer = setInterval(() => {
      // In a broadcast channel world, we can't easily check 'staleness' without timestamps, 
      // but for now we rely on explicit LEAVE or window events.
    }, 5000);
  }

  init(userId: string, capsuleId: string) {
    this.myId = userId;
    this.currentCapsuleId = capsuleId;
    this.activeCursors.set([]);
    this.chatMessages.set([]);
    this.notifications.set([]);
    
    // Announce join
    this.sendMessage('JOIN', { userId });
  }

  leave() {
    if (this.currentCapsuleId) {
      this.sendMessage('LEAVE', { userId: this.myId });
    }
    this.activeCursors.set([]);
    this.currentCapsuleId = '';
  }

  broadcastCursor(x: number, y: number, userName: string, color: string) {
    if (!this.currentCapsuleId) return;
    
    this.sendMessage('CURSOR', {
      userId: this.myId,
      userName,
      color,
      x,
      y,
      capsuleId: this.currentCapsuleId
    });
  }

  broadcastItemUpdate(items: any) {
    this.sendMessage('ITEM_UPDATE', { items });
  }

  broadcastItemAdd(item: any) {
    this.sendMessage('ITEM_ADD', { item });
  }
  
  broadcastCapsuleReset() {
     this.sendMessage('CAPSULE_RESET', {});
  }

  broadcastChat(text: string, userName: string, color: string) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      userId: this.myId,
      userName,
      text,
      timestamp: Date.now(),
      color
    };
    // Add locally immediately
    this.chatMessages.update(msgs => [...msgs, msg]);
    this.sendMessage('CHAT', msg);
  }

  private sendMessage(type: CollabMessage['type'], payload: any) {
    const msg: CollabMessage = {
      type,
      payload,
      capsuleId: this.currentCapsuleId,
      senderId: this.myId
    };
    this.channel.postMessage(msg);
  }

  private handleMessage(msg: CollabMessage) {
    if (msg.capsuleId !== this.currentCapsuleId || msg.senderId === this.myId) {
      return;
    }

    switch (msg.type) {
      case 'CURSOR':
        this.updateCursor(msg.payload);
        break;
      case 'LEAVE':
        this.removeCursor(msg.payload.userId);
        this.addNotification('누군가 캡슐을 나갔습니다.');
        break;
      case 'JOIN':
         this.addNotification('새로운 사용자가 참여했습니다.');
         break;
      case 'ITEM_UPDATE':
      case 'ITEM_ADD':
      case 'CAPSULE_RESET':
        this.remoteUpdates.set({ type: msg.type, timestamp: Date.now() });
        break;
      case 'CHAT':
        this.chatMessages.update(msgs => [...msgs, msg.payload]);
        break;
    }
  }

  private updateCursor(data: CursorPosition) {
    this.activeCursors.update(cursors => {
      const existing = cursors.findIndex(c => c.userId === data.userId);
      if (existing !== -1) {
        const newCursors = [...cursors];
        newCursors[existing] = data;
        return newCursors;
      } else {
        return [...cursors, data];
      }
    });
  }

  private removeCursor(userId: string) {
    this.activeCursors.update(cursors => cursors.filter(c => c.userId !== userId));
  }

  private addNotification(text: string) {
    this.notifications.update(n => [text, ...n].slice(0, 3));
    setTimeout(() => {
      this.notifications.update(n => n.filter(x => x !== text));
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.cleanupTimer);
    this.channel.close();
  }
}