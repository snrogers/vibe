import { useStdout } from "ink";
import { useEffect, useState } from "react";

export const useTerminalDimensions = () => {
  const useStdoutResult = useStdout();
  const { stdout } = useStdoutResult;

  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    // Try to get size from stdout first
    if (stdout.isTTY && stdout.columns && stdout.rows) {
      setColumns(stdout.columns);
      setRows(stdout.rows);
    } else {
      throw new Error('Terminal size not available');
    }

    // Handle resize events
    const handleResize = () => {
      if (stdout.isTTY && stdout.columns && stdout.rows) {
        setColumns(stdout.columns);
        setRows(stdout.rows);
      } else {
        throw new Error('Terminal size not available');
      }
    };

    stdout.on('resize', handleResize);
    return () => { stdout.off('resize', handleResize) }
  }, [stdout]);
  return { columns, rows };
};
