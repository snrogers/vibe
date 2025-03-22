import { PGlite } from '@electric-sql/pglite';
import { hstore } from '@electric-sql/pglite/contrib/hstore';
import { vector } from '@electric-sql/pglite/vector';
import { homedir } from 'os';
import { join } from 'path';
import { serializeError } from 'serialize-error';

import type { ChatSession } from '@/lib/Domain/ChatSession';
import { logger } from '../LogService';
import type {RagDocument} from './Document';

// Persistent storage in user's home directory
const dataDir = join(homedir(), '.vibe.db');
const db = new PGlite({
  dataDir,
  extensions: { hstore, vector }
});

export const DbService = {
  db,

  /** Initialize the database and create the chat_session table if it doesn't exist */
  async init() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_session (
        id         INT PRIMARY KEY,
        data       JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rag_vectors (
        id        SERIAL PRIMARY KEY,
        embedding REAL[], -- Array of floats for Vector
        text      TEXT,   -- Original text
        metadata  JSONB   -- e.g., { "file_path": "VIBE.md" }
      );
    `);
  },

  async saveDocument(document: RagDocument) {
    const { embedding, metadata, text } = document;
    await db.query(
      "INSERT INTO rag_vectors (embedding, text, metadata) VALUES ($1, $2, $3)",
      [embedding, text, metadata]
    );
  },

  async findDocumentByVector(vector: number[]) {
    const result = await db.query(
      "SELECT * FROM rag_vectors WHERE embedding @> vector_to_array($1, $2)",
      [vector, vector.length]
    );
    return result.rows[0];
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
        // TODO: Validate the data?
        // @ts-expect-error
        return result.rows[0].data;
      }
      return null;
    } catch (error) {
      logger.log('error', 'DbService->loadChatSession', { error: serializeError(error) })
      return null;
    }
  },
};
