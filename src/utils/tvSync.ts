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

export interface TvReceiverHandle {
  roomCode: string;
  destroy: () => void;
}

/**
 * DIRECTION 1 (TV hosts code -> Tablet enters TV's code):
 * TV opens room `wanderbook-atlas-v1-XXXX` and waits for the Android tablet.
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
): TvReceiverHandle {
  const cleanCode = normalizeRoomCode(roomCode);
  let peer: Peer | null = null;
  let activeConn: DataConnection | null = null;
  let bc: BroadcastChannel | null = null;
  let destroyed = false;

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
      // ignore
    }
  }

  try {
    peer = new Peer(`${ROOM_PREFIX}${cleanCode}`, { debug: 0 });
    peer.on('open', () => {
      if (!destroyed) callbacks.onReady();
    });
    peer.on('connection', (conn) => {
      if (destroyed) return;
      if (activeConn && activeConn.open) activeConn.close();
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
      if (err.type === 'unavailable-id') {
        callbacks.onError('That room code is already open. Tap "New Code" to refresh.');
      } else {
        callbacks.onError('Waiting on network relay — or enter a Tablet Code below!');
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

/**
 * DIRECTION 2 (Tablet hosts code -> TV enters Tablet's code!):
 * TV joins `wanderbook-atlas-v1-XXXX` hosted by the Android tablet, requests state,
 * and receives live updates in real time!
 */
export function connectTvToTablet(
  roomCode: string,
  callbacks: {
    onConnected: () => void;
    onDisconnected: () => void;
    onStateReceived: (state: LiveSessionState) => void;
    onError: (msg: string) => void;
  }
): TvReceiverHandle {
  const cleanCode = normalizeRoomCode(roomCode);
  let peer: Peer | null = null;
  let conn: DataConnection | null = null;
  let bc: BroadcastChannel | null = null;
  let connected = false;
  let destroyed = false;

  const markConnected = () => {
    if (!connected && !destroyed) {
      connected = true;
      callbacks.onConnected();
    }
  };

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(`${ROOM_PREFIX}${cleanCode}`);
      bc.onmessage = (ev) => {
        if (destroyed) return;
        const msg = ev.data as { type?: string; state?: LiveSessionState };
        if (msg?.type === 'state' && msg.state) {
          markConnected();
          callbacks.onStateReceived(msg.state);
        } else if (msg?.type === 'tablet-ack') {
          markConnected();
        } else if (msg?.type === 'bye') {
          connected = false;
          callbacks.onDisconnected();
        }
      };
      bc.postMessage({ type: 'tv-hello' });
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
        conn?.send({ type: 'tv-hello' });
      });
      conn.on('data', (raw) => {
        if (destroyed) return;
        const msg = raw as { type?: string; state?: LiveSessionState };
        if (msg?.type === 'state' && msg.state) {
          markConnected();
          callbacks.onStateReceived(msg.state);
        }
      });
      conn.on('close', () => {
        if (!destroyed) {
          connected = false;
          callbacks.onDisconnected();
        }
      });
      conn.on('error', () => {
        if (!destroyed && !connected) {
          callbacks.onError('Could not reach that Tablet code. Make sure the tablet is showing that 4-letter code!');
        }
      });
    });
    peer.on('error', () => {
      if (!destroyed && !connected) {
        callbacks.onError('Could not find that Tablet code yet. Double-check the 4 letters on your tablet.');
      }
    });
  } catch {
    callbacks.onError('Could not connect TV to tablet.');
  }

  return {
    roomCode: cleanCode,
    destroy: () => {
      destroyed = true;
      try {
        bc?.postMessage({ type: 'tv-bye' });
        conn?.close();
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
 * Tablet joins a TV-hosted room code (Direction 1).
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
        if (msg?.type === 'ack') markConnected();
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
      conn.on('open', () => markConnected());
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
        if (conn && conn.open) conn.send({ type: 'state', state });
      } catch {
        // ignore
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

/**
 * NEW: Tablet hosts its OWN 4-letter code so the TV can type it in (Direction 2)!
 */
export function startTabletHost(
  roomCode: string,
  callbacks: {
    onReady: () => void;
    onTvConnected: () => void;
    onTvDisconnected: () => void;
    onError: (msg: string) => void;
  }
): TabletControllerHandle {
  const cleanCode = normalizeRoomCode(roomCode);
  let peer: Peer | null = null;
  let activeConn: DataConnection | null = null;
  let bc: BroadcastChannel | null = null;
  let lastState: LiveSessionState | null = null;
  let destroyed = false;

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(`${ROOM_PREFIX}${cleanCode}`);
      bc.onmessage = (ev) => {
        if (destroyed) return;
        const msg = ev.data as { type?: string };
        if (msg?.type === 'tv-hello') {
          callbacks.onTvConnected();
          bc?.postMessage({ type: 'tablet-ack' });
          if (lastState) bc?.postMessage({ type: 'state', state: lastState });
        } else if (msg?.type === 'tv-bye') {
          callbacks.onTvDisconnected();
        }
      };
    } catch {
      // ignore
    }
  }

  try {
    peer = new Peer(`${ROOM_PREFIX}${cleanCode}`, { debug: 0 });
    peer.on('open', () => {
      if (!destroyed) callbacks.onReady();
    });
    peer.on('connection', (conn) => {
      if (destroyed) return;
      if (activeConn && activeConn.open) activeConn.close();
      activeConn = conn;
      conn.on('open', () => {
        if (destroyed) return;
        callbacks.onTvConnected();
        if (lastState) {
          conn.send({ type: 'state', state: lastState });
        }
      });
      conn.on('data', (raw) => {
        if (destroyed) return;
        const msg = raw as { type?: string };
        if (msg?.type === 'tv-hello' && lastState && conn.open) {
          conn.send({ type: 'state', state: lastState });
        }
      });
      conn.on('close', () => {
        if (!destroyed) callbacks.onTvDisconnected();
      });
    });
    peer.on('error', (err) => {
      if (destroyed) return;
      if (err.type === 'unavailable-id') {
        callbacks.onError('Code in use—tap New Code to generate a fresh one.');
      } else {
        callbacks.onError('Waiting on network relay for TV connection...');
      }
    });
  } catch {
    callbacks.onError('Could not start tablet pairing host.');
  }

  return {
    roomCode: cleanCode,
    sendState: (state: LiveSessionState) => {
      lastState = state;
      if (destroyed) return;
      try {
        if (activeConn && activeConn.open) {
          activeConn.send({ type: 'state', state });
        }
      } catch {
        // ignore
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
        activeConn?.close();
        peer?.destroy();
        bc?.close();
      } catch {
        // ignore
      }
    },
  };
}
