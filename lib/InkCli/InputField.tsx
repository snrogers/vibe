import React, { useMemo, useState, type FC } from 'react'
import { Box, Text, useFocus, useStdin } from 'ink'
import { useInput } from 'ink'
import { appStore } from '../App'
import { useAppSelector } from '../App/AppProvider'

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

export const LiveInputField: FC = () => {
  const [textInput, setTextInput] = useState("")
  const inProgress = useAppSelector((state) => state.inProgress)
  const isFocused = useFocus()

  const onSubmit = useMemo(() =>
    (value: string) => {
      if (appStore.getState().inProgress) return
      if (!isFocused) return

      appStore.dispatch({ type: 'PROMPT_SUBMITTED', payload: { prompt: value } })
      setTextInput('')
    },
    [setTextInput]
  )

  useInput((input, key) => {
    if (!isFocused) return

    if (key.return) {
      onSubmit(textInput)
    } else if (key.backspace || key.delete) {
      setTextInput(textInput.slice(0, -1))
    } else if (key.escape) {
      setTextInput('')
    } else if (input && !key.ctrl && !key.meta) {
      setTextInput(textInput + input)
    }
  })

  return (
    <Box borderStyle="round" borderColor={appStore.getState().inProgress ? 'gray' : 'cyan'} padding={1} width="100%">
      <Text color="white" dimColor>{'>'}</Text>
      <Text color={appStore.getState().inProgress ? 'gray' : 'white'}>{textInput}</Text>
      <Text color={appStore.getState().inProgress ? 'gray' : 'cyan'}>▋</Text>
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
