import React, { useState, type FC } from 'react'
import { Box, Text, useStdin } from 'ink'
import { useInput } from 'ink'
import { appStore } from '../App'


// ----------------------------------------------------------------- //
// Private Components
// ----------------------------------------------------------------- //
const DummyInputField: FC = () => {
  return (
    <Box borderStyle="round" borderColor="cyan" padding={1} width="100%">
      <Text color="white" dimColor>{'>'}</Text>
      <Text color="gray"> Input Disabled without TTY / Raw Mode! </Text>
    </Box>
  )
}

const onSubmit = (value: string) => {
  appStore.dispatch({ type: 'PROMPT_SUBMITTED', payload: { prompt: value } })
}
export const LiveInputField: FC = () => {
  const [value, onChange] = useState("")

  useInput((input, key) => {
    if (key.return) {
      onSubmit(value)
    } else if (key.backspace || key.delete) {
      onChange(value.slice(0, -1))
    } else if (key.escape) {
      onChange('')
    } else if (input && !key.ctrl && !key.meta) {
      onChange(value + input)
    }
  })

  return (
    <Box borderStyle="round" borderColor="cyan" padding={1} width="100%">
      <Text color="white" dimColor>{'>'}</Text>
      <Text>{value}</Text>
      <Text color="cyan">▋</Text>
    </Box>
  )
}


// ----------------------------------------------------------------- //
// Public Component
// ----------------------------------------------------------------- //
export const InputField: FC = () => {
  const { isRawModeSupported } = useStdin()

  if (isRawModeSupported) {
    return <LiveInputField />
  } else {
    return <DummyInputField />
  }
}
