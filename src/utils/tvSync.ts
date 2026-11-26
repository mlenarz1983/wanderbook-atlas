import Peer, { type DataConnection } from 'peerjs';
import type { LiveSessionState } from '../types/game';

const ROOM_PREFIX = 'wanderbook-atlas-v1-';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRoomCode(): string {
  const friendlyWords = [
    'KITE',
    'MAPS',
    'SAIL',
    'STAR',
    'FERN',
    'WAVE',
    'REEF',
    'PEAK',
    'WIND',
    'GOLD',
    'PALM',
    'LYNX',
  ];
  if (Math.random() < 0.55) {
    return friendlyWords[Math.floor(Math.random() * friendlyWords.length)];
  }
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export function normalizeRoomCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
}

export type SyncStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface TvHostHandle {
  roomCode: string;
  destroy: () => void;
}

/**
 * TV Big Screen Host:
 * Listens via PeerJS (cross-device: Google TV Streamer <-> Android tablet)
 * AND BroadcastChannel (instant same-device multi-tab preview).
 */
export function startTvHost(
  roomCode: string,
  callbacks: {
    onReady: () => void;
    onControllerConnected: () => void;
    onControllerDisconnected: () => void;
    onStateReceived: (state: LiveSessionState) => void;
    onError: (msg: string) => void;
  }
): TvHostHandle {
  const cleanCode = normalizeRoomCode(roomCode);
  let peer: Peer | null = null;
  let activeConn: DataConnection | null = null;
  let bc: BroadcastChannel | null = null;
  let destroyed = false;

  // Same-origin BroadcastChannel bridge for instant local preview
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(`${ROOM_PREFIX}${cleanCode}`);
      bc.onmessage = (ev) => {
        if (destroyed) return;
        const msg = ev.data as { type: string; state?: LiveSessionState };
        if (msg?.type === 'hello') {
          callbacks.onControllerConnected();
          bc?.postMessage({ type: 'ack' });
        } else if (msg?.type === 'state' && msg.state) {
          callbacks.onControllerConnected();
          callbacks.onStateReceived(msg.state);
        } else if (msg?.type === 'bye') {
          callbacks.onControllerDisconnected();
        }
      };
    } catch {
      // ignore BroadcastChannel failures
    }
  }

  try {
    peer = new Peer(`${ROOM_PREFIX}${cleanCode}`, {
      debug: 0,
    });

    peer.on('open', () => {
      if (!destroyed) callbacks.onReady();
    });

    peer.on('connection', (conn) => {
      if (destroyed) return;
      if (activeConn && activeConn.open) {
        activeConn.close();
      }
      activeConn = conn;
      conn.on('open', () => {
        if (!destroyed) callbacks.onControllerConnected();
      });
      conn.on('data', (raw) => {
        if (destroyed) return;
        const msg = raw as { type?: string; state?: LiveSessionState };
        if (msg?.type === 'state' && msg.state) {
          callbacks.onStateReceived(msg.state);
        }
      });
      conn.on('close', () => {
        if (!destroyed) callbacks.onControllerDisconnected();
      });
    });

    peer.on('error', (err) => {
      if (destroyed) return;
      // Still allow BroadcastChannel to function, but surface clear note
      if (err.type === 'unavailable-id') {
        callbacks.onError('That room code is already in use. Tap "New Code" to refresh.');
      } else {
        callbacks.onError('Waiting on internet relay — or test locally in another tab with the same code!');
      }
    });
  } catch {
    callbacks.onError('Could not start TV pairing link.');
  }

  return {
    roomCode: cleanCode,
    destroy: () => {
      destroyed = true;
      try {
        activeConn?.close();
        peer?.destroy();
        bc?.close();
      } catch {
        // ignore
      }
    },
  };
}

export interface TabletControllerHandle {
  roomCode: string;
  sendState: (state: LiveSessionState) => void;
  disconnect: () => void;
}

/**
 * Android Tablet Controller Client:
 * Keeps all save data on the tablet and beams LiveSessionState to the paired TV.
 */
export function connectTabletToTv(
  roomCode: string,
  callbacks: {
    onConnected: () => void;
    onDisconnected: () => void;
    onError: (msg: string) => void;
  }
): TabletControllerHandle {
  const cleanCode = normalizeRoomCode(roomCode);
  let peer: Peer | null = null;
  let conn: DataConnection | null = null;
  let bc: BroadcastChannel | null = null;
  let isConnected = false;
  let destroyed = false;

  const markConnected = () => {
    if (!isConnected && !destroyed) {
      isConnected = true;
      callbacks.onConnected();
    }
  };

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(`${ROOM_PREFIX}${cleanCode}`);
      bc.onmessage = (ev) => {
        if (destroyed) return;
        const msg = ev.data as { type?: string };
        if (msg?.type === 'ack') {
          markConnected();
        }
      };
      bc.postMessage({ type: 'hello' });
    } catch {
      // ignore
    }
  }

  try {
    peer = new Peer({ debug: 0 });
    peer.on('open', () => {
      if (destroyed || !peer) return;
      conn = peer.connect(`${ROOM_PREFIX}${cleanCode}`, { reliable: true });
      conn.on('open', () => {
        markConnected();
      });
      conn.on('close', () => {
        if (!destroyed) {
          isConnected = false;
          callbacks.onDisconnected();
        }
      });
      conn.on('error', () => {
        if (!destroyed && !isConnected) {
          callbacks.onError('Could not reach that TV code. Double-check the 4 letters on your TV.');
        }
      });
    });

    peer.on('error', () => {
      if (!destroyed && !isConnected) {
        callbacks.onError('Could not connect to TV yet. Make sure the TV screen is open with that code.');
      }
    });
  } catch {
    callbacks.onError('TV pairing could not be initialized.');
  }

  return {
    roomCode: cleanCode,
    sendState: (state: LiveSessionState) => {
      if (destroyed) return;
      try {
        if (conn && conn.open) {
          conn.send({ type: 'state', state });
        }
      } catch {
        // ignore transient send error
      }
      try {
        bc?.postMessage({ type: 'state', state });
      } catch {
        // ignore
      }
    },
    disconnect: () => {
      destroyed = true;
      try {
        bc?.postMessage({ type: 'bye' });
        conn?.close();
        peer?.destroy();
        bc?.close();
      } catch {
        // ignore
      }
    },
  };
}
