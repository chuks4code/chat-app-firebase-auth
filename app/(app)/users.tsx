import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from "@/context/authContext";
import { useRouter , Stack} from "expo-router";

type User = {
  uid: string;
  username: string;
  email: string;
};

export default function UsersScreen() {
  const { user,logout} = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [unreadMap, setUnreadMap] = useState<{[key:string]: number}>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const allUsers = snapshot.docs
          .map((doc) => doc.data() as User)
          .filter((u) => u.uid !== user?.uid); // exclude self

        setUsers(allUsers);
      }
    );

    return unsubscribe;
  }, [user]);

//////////////////////////////////////////////////////////////////



  useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(
    collection(db, "chats"),
    async (snapshot) => {
      const newUnread: { [key: string]: number } = {};

      for (const chatDoc of snapshot.docs) {
        const chatId = chatDoc.id;

        // Only care about chats that include current user
        if (!chatId.includes(user.uid)) continue;

        const chatData = chatDoc.data();

        const metaRef = doc(
          db,
          "users",
          user.uid,
          "chatMeta",
          chatId
        );

        const metaSnap = await getDoc(metaRef);

        const lastRead = metaSnap.data()?.lastRead;
        const lastMessageAt = chatData.lastMessageAt;

        if (
          lastMessageAt &&
          (!lastRead ||
            lastMessageAt.seconds > lastRead.seconds)
        ) {
          newUnread[chatId] = 1;
        }
      }

      setUnreadMap(newUnread);
    }
  );

  return unsubscribe;
}, [user]);



////////////////////////////////////////////////////////////////

  const openPrivateChat = (otherUser: User) => {
    if (!user) return;

    const sortedIds = [user.uid, otherUser.uid].sort();
    const chatId = `${sortedIds[0]}_${sortedIds[1]}`;

    router.push(`/chat/${chatId}`);
  };

  return (
  <>
    <Stack.Screen
      options={{
        title: "Users",
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/chat/global")}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: "#3478f6", fontWeight: "600" }}>
              All Chat
            </Text>
          </Pressable>
        ),
      }}
    />

    <View style={{ flex: 1,  }}>
  <FlatList
     data={users}
  keyExtractor={(item) => item.uid}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  }}                                                    // 👈 space at bottom
    initialNumToRender={10}                       // 👈 performance boost
    windowSize={5}                                // 👈 smooth with many users
    renderItem={({ item }) => {
      if (!user) return null;

      const sortedIds = [user.uid, item.uid].sort();
      const chatId = `${sortedIds[0]}_${sortedIds[1]}`;

      return (
        <Pressable
          onPress={() => openPrivateChat(item)}
          style={{
            backgroundColor: "white",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 14,
            marginBottom: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <View>
            <Text style={{ fontWeight: "600" }}>
              {item.username}
            </Text>
            <Text style={{ color: "gray" }}>
              {item.email}
            </Text>
          </View>

          {unreadMap[chatId] && (
            <View
              style={{
                backgroundColor: "red",
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                {unreadMap[chatId]}
              </Text>
            </View>
          )}
        </Pressable>
      );
    }}
  />
</View>
  </>
);
}