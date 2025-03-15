import React, { type FC } from 'react'
import { Box, Text } from 'ink'
import { useInput } from 'ink'

interface InputFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export const InputField: FC<InputFieldProps> = ({ value, onChange, onSubmit }) => {
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
