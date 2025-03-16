import { useState, useEffect, type FC } from "react";
import { Box, Text } from "ink";
import { Frame } from "./Frame";

import { pp } from "@/lib/Utils";
import { useAppSelector } from "@/lib/App/AppProvider";
import { logger } from "@/lib/Services/LogService";

export const DebugView: FC = () => {
  const appState = useAppSelector((st) => st);
  const { events } = appState;
  const [viewMode, setViewMode] = useState<'state' | 'events' | 'logs'>('state');
  const [logs, setLogs] = useState<any[]>([]);

  // Update logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs().slice(-10)); // Get the last 10 logs
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard shortcuts for switching views
  useEffect(() => {
    const handleKeyPress = (key: any) => {
      if (key.ctrl) {
        if (key.key === '1') setViewMode('state');
        if (key.key === '2') setViewMode('events');
        if (key.key === '3') setViewMode('logs');
      }
    };

    // This would normally set up a key listener but for this example we'll skip it

    return () => {
      // Cleanup listener
    };
  }, []);

  return (
    <Frame height="100%">
      <Box marginBottom={1}>
        <Text bold color="yellow">Debug Mode</Text>
        <Box marginLeft={2}>
          <Text color={viewMode === 'state' ? 'green' : 'gray'}>
            [1] State
          </Text>
          <Text color={viewMode === 'events' ? 'green' : 'gray'}>
            [2] Events
          </Text>
          <Text color={viewMode === 'logs' ? 'green' : 'gray'}>
            [3] Logs
          </Text>
        </Box>
      </Box>

      {viewMode === 'state' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold underline color="yellow">State:</Text>
          <Text>{pp(appState)}</Text>
        </Box>
      )}

      {viewMode === 'events' && (
        <Box flexDirection="column">
          <Text bold underline color="yellow">Events ({events.length}):</Text>
          {events.length === 0 ? (
            <Text color="gray">No events dispatched yet</Text>
          ) : (
            events.slice(-10).map((event, idx) => (
              <Text key={idx} color="white">{pp(event)}</Text>
            ))
          )}
        </Box>
      )}

      {viewMode === 'logs' && (
        <Box flexDirection="column">
          <Text bold underline color="yellow">Application Logs:</Text>
          {logs.length === 0 ? (
            <Text color="gray">No logs available</Text>
          ) : (
            logs.map((log, idx) => (
              <Text key={idx} color="white">
                [{log.timestamp}] {log.event.level}: {log.event.message}
              </Text>
            ))
          )}
        </Box>
      )}
    </Frame>
  );
};
