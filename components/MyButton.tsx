
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  title: string;
  loading?: boolean;
  onPress: () => void;
};

export default function MyButton({ title, loading, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
  <>
    <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.text}>Signing in...</Text>
  </>
) : (
  <Text style={styles.text}>{title}</Text>
)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3478F6",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
