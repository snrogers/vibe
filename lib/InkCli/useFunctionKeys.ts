import { useStdin } from "ink";
import { useCallback, useEffect, useState } from "react";

export type FnKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12';

export const useFunctionKeys = (fn: (key: FnKey) => void) => {
  const { stdin } = useStdin();

  useEffect(() => {
    if (!stdin) return;

    const handleData = (data: string) => {
      // Check for function key sequences
      if (data === '\u001bOP') {
        fn('F1');
      } else if (data === '\u001bOQ') {
        fn('F2');
      } else if (data === '\u001bOR') {
        fn('F3');
      } else if (data === '\u001bOS') {
        fn('F4');
      } else if (data === '\u001b[15~') {
        fn('F5');
      } else if (data === '\u001b[17~') {
        fn('F6');
      } else if (data === '\u001b[18~') {
        fn('F7');
      } else if (data === '\u001b[19~') {
        fn('F8');
      } else if (data === '\u001b[20~') {
        fn('F9');
      } else if (data === '\u001b[21~') {
        fn('F10');
      } else if (data === '\u001b[23~') {
        fn('F11');
      } else if (data === '\u001b[24~') {
        fn('F12');
      }
    };

    // Attach the data event listener
    stdin.on('data', handleData);

    // Cleanup on unmount
    return () => {
      stdin.removeListener('data', handleData);
    };
  }, [ fn ]);
};
