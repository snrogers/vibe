import type { AppEvent } from "@/lib/App/AppEvent";
import { V_DEBUG } from "@/lib/Constants";
import { serializeError } from "serialize-error";

/**
 * Logger Service for capturing and persisting application events
 */
export class LogService {
  private static instance: LogService;
  private memoryLogs: Array<{ timestamp: string; event: AppEvent }> = [];
  private consoleEnabled: boolean = true;
  private fileEnabled: boolean = false;
  private logFile: string = 'vibe-app.log';

  private constructor() {
    // Initialize the logger
    this.setupFileLogging();
    this.log('info', 'LoggerService initialized');
  }

  /**
   * Get the singleton instance of LoggerService
   */
  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  /**
   * Try to set up file logging if the environment supports it
   */
  private setupFileLogging(): void {
    try {
      // Check if we're in a Node.js environment with fs module
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');

        // Create logs directory if it doesn't exist
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }

        // Set the full path to the log file
        this.logFile = path.join(logsDir, 'vibe-app.log');
        this.fileEnabled = true;

        // Log the initialization
        this.writeToFile('LoggerService file logging enabled');
      }
    } catch (error) {
      console.warn('File logging is not available:', error);
      this.fileEnabled = false;
    }
  }

  /**
   * Log an event with a specific log level
   */
  public log(level: 'debug' | 'info' | 'warn' | 'error', message: string, _data?: any): void {
    const timestamp = new Date().toISOString();

    let data;
    if (_data instanceof Error) {
      data = serializeError(_data);
    } else {
      data = this.sanitizeData(_data);
    }

    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };

    // Add to memory logs
    this.memoryLogs.push({ timestamp, event: logEntry as any });

    // Limit memory logs size to prevent memory leaks
    if (this.memoryLogs.length > 1000) {
      this.memoryLogs.shift();
    }

    // Console logging
    if (this.consoleEnabled) {
      if (level === 'debug' && !V_DEBUG) {
        // Skip debug logs unless debug mode is enabled
        return;
      }

      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}] ${message}`, data || '');
          break;
        case 'info':
          console.info(`[${timestamp}] ${message}`, data || '');
          break;
        case 'warn':
          console.warn(`[${timestamp}] ${message}`, data || '');
          break;
        case 'error':
          console.error(`[${timestamp}] ${message}`, data || '');
          break;
      }
    }

    // File logging
    if (this.fileEnabled) {
      this.writeToFile(`[${timestamp}] [${level.toUpperCase()}] ${message} ${data ? JSON.stringify(this.sanitizeData(data)) : ''}`);
    }
  }

  /**
   * Log an AppEvent
   */
  public logEvent(event: AppEvent): void {
    try {
      this.log('info', `EVENT: ${event?.type}`, event?.payload);
    } catch (error) {
      this.log('error', `Error logging event: ${event}`, error);
    }
  }

  /**
   * Sanitize data for logging by truncating large strings
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // Make a deep copy to avoid modifying the original data
    const sanitized = JSON.parse(JSON.stringify(data));

    // Helper function to recursively process object properties
    const processObject = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach(key => {
        const value = obj[key];

        if (typeof value === 'string' && value.length > 500) {
          obj[key] = value.substring(0, 500) + '... [TRUNCATED]';
        } else if (typeof value === 'object' && value !== null) {
          processObject(value);
        }
      });
    };

    processObject(sanitized);
    return sanitized;
  }

  /**
   * Write a log entry to the file
   */
  private writeToFile(logEntry: string): void {
    try {
      if (!this.fileEnabled) return;

      const fs = require('fs');
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Error writing to log file:', error);
      this.fileEnabled = false;
    }
  }

  /**
   * Get all logs from memory
   */
  public getLogs(): Array<{ timestamp: string; event: AppEvent }> {
    return [...this.memoryLogs];
  }

  /**
   * Clear memory logs
   */
  public clearMemoryLogs(): void {
    this.memoryLogs = [];
  }
}

// Create a singleton export
export const logger = LogService.getInstance();
