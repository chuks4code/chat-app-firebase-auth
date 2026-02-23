import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet , Button} from "react-native";
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";

type ChatType = {
  id: string;
  lastMessage: string;
  updatedAt: any;
  username: string;
};

const Home = () => {
  
  const [chats, setChats] = useState<ChatType[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
  const chatPromises = snapshot.docs.map(async (docSnap) => {
    const data = docSnap.data();

    const otherUid = data.participants.find(
      (uid: string) => uid !== user.uid
    );

    // fetch other user info
    const userDoc = await getDoc(doc(db, "users", otherUid));
    const otherUser = userDoc.data();

    return {
      id: docSnap.id,
      lastMessage: data.lastMessage,
      updatedAt: data.updatedAt,
      username: otherUser?.username || "Unknown",
    };
  });

  const chatList = await Promise.all(chatPromises);
  setChats(chatList);
});

    return unsubscribe;
  }, [user]);

  const handlePress = (chatId: string) => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: chatId },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

       <Button title="Logout" onPress={logout} />

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatCard}
            onPress={() => handlePress(item.id)}
          >
            <Text style={styles.chatTitle}>
               {item.username}
             </Text>
            <Text style={styles.lastMessage}>
              {item.lastMessage}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatCard: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 13,
    color: "gray",
    marginTop: 4,
  },
});