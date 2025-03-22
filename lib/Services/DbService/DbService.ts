import { PGlite } from '@electric-sql/pglite';
import { homedir } from 'os';
import { join } from 'path';
import type { ChatSession } from '@/lib/Domain/ChatSession';
import {logger} from '../LogService';
import {serializeError} from 'serialize-error';

// Persistent storage in user's home directory
const dataDir = join(homedir(), '.vibe.db');
const db = new PGlite({ dataDir });

export const DbService = {
  db,
  /** Initialize the database and create the chat_session table if it doesn't exist */
  async init() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_session (
        id INT PRIMARY KEY,
        data JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },
  /** Save or update the chat session in the database */
  async saveChatSession(chatSession: ChatSession) {
    const serializedData = JSON.stringify(chatSession);
    await db.query(
      'INSERT INTO chat_session (id, data, updated_at) VALUES (1, $1, CURRENT_TIMESTAMP) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = CURRENT_TIMESTAMP',
      [serializedData]
    );
  },
  /** Load the chat session from the database */
  async loadChatSession(): Promise<ChatSession | null> {
    try {
      const result = await db.query('SELECT data FROM chat_session WHERE id = 1');
      logger.log('info', 'DbService->loadChatSession', { result })
      if (result.rows.length > 0) {
        return result.rows[0].data;
      }
      return null;
    } catch (error) {
      logger.log('error', 'DbService->loadChatSession', { error: serializeError(error) })
      return null;
    }
  },
};
