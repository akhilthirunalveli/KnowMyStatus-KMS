import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TYPING_TEXT = 'KnowMyStatus';
const TYPING_SPEED = 90; // ms per character

export default function SplashTyping({ onDone }: { onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < TYPING_TEXT.length) {
        setDisplayed((prev) => prev + TYPING_TEXT[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowDot(true), 300);
        setTimeout(onDone, 1200);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.typingText}>
        {displayed}
        {showDot && <Text style={styles.redDot}>.</Text>}
        <Text style={styles.cursor}>|</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingText: {
    fontSize: 38,
    color: '#fff',
    fontFamily: 'monospace', // Use Bitcount if available
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  redDot: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  cursor: {
    color: '#ef4444',
    fontWeight: 'bold',
    opacity: 0.7,
  },
});
