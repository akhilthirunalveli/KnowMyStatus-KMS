import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  [key: string]: any;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        {...props}
      />
      <Text style={[styles.label, (isFocused || value) && styles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 12,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#262626',
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'CabinetGrotesk-Regular',
  },
  label: {
    position: 'absolute',
    left: 18,
    top: 18,
    color: '#7a7a7a',
    fontSize: 15,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelFocused: {
    top: 2,
    left: 14,
    fontSize: 12,
    color: '#ef4444',
    backgroundColor: '#000',
  },
});
