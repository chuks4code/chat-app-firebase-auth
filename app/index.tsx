import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { View, ActivityIndicator } from "react-native";

export default function StartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    if (isAuthenticated) {
      router.replace("/chat/global");
    } else {
      router.replace("/signIn");
    }
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}