import React, { type FC } from 'react'
import { Box, Text, useStdin } from 'ink'
import { useInput } from 'ink'




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

export const LiveInputField: FC<InputFieldProps> = (props) => {
  const { value, onChange, onSubmit } = props

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
      <Text> {value}</Text>
      <Text color="cyan">▋</Text>
    </Box>
  )
}


// ----------------------------------------------------------------- //
// Public Component
// ----------------------------------------------------------------- //
interface InputFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}
export const InputField: FC<InputFieldProps> = ({ value, onChange, onSubmit }) => {
  const { isRawModeSupported } = useStdin()


  if (isRawModeSupported) {
    return <LiveInputField value={value} onChange={onChange} onSubmit={onSubmit} />
  } else {
    return <DummyInputField />
  }
}
