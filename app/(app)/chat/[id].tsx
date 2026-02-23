import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack,useRouter } from "expo-router";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp, doc, setDoc 
} from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from "@/context/authContext";

type Message = {
  id: string;
  text: string;
  senderId: string;
  username: string;
  createdAt: any;
};

   export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user, logout } = useAuth();
  const router = useRouter();

  const chatId = typeof id === "string" ? id : "global";

  const flatListRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [chatId, user]);

//* Track Online user Status*//
  useEffect(() => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  // Mark user online
  setDoc(userRef, { online: true }, { merge: true });

  return () => {
    // Mark user offline when leaving screen
    setDoc(userRef, { online: false }, { merge: true });
  };
}, [user]);


// Count Online Users
useEffect(() => {
  const q = collection(db, "users");

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const onlineUsers = snapshot.docs.filter(
      (doc) => doc.data().online === true
    );
    setOnlineCount(onlineUsers.length);
  });

  return unsubscribe;
}, []);


  ///////////////////////////////////////
  useEffect(() => {
  if (!user) return;
  if (chatId === "global") return;

  const ids = chatId.split("_");

  const otherUserId = ids.find((uid) => uid !== user.uid);

  if (!otherUserId) return;

  const unsubscribe = onSnapshot(
    doc(db, "users", otherUserId),
    (snapshot) => {
      const data = snapshot.data();
      if (data?.username) {
        setOtherUserName(data.username);
      }
    }
  );

  return unsubscribe;
}, [chatId, user]);


//** Listen for Other User Typing*/
useEffect(() => {
  if (!user) return;
  if (chatId === "global") return;

  const ids = chatId.split("_");
  const otherUserId = ids.find((uid) => uid !== user.uid);

  if (!otherUserId) return;

  const unsubscribe = onSnapshot(
    doc(db, "chats", chatId, "typing", otherUserId),
    (snapshot) => {
      const data = snapshot.data();
      setOtherTyping(data?.typing === true);
    }
  );

  return unsubscribe;
}, [chatId, user]);


// *When opening a chat, mark it as "read"*//
useEffect(() => {
  if (!user) return;

  const chatMetaRef = doc(
    db,
    "users",
    user.uid,
    "chatMeta",
    chatId
  );

  setDoc(chatMetaRef, {
    lastRead: serverTimestamp(),
  }, { merge: true });

}, [chatId, user]);

/////////////////////////////
//Sync Typing Status to Firestore
useEffect(() => {
  if (!user) return;
  if (chatId === "global") return;

  const typingRef = doc(
    db,
    "chats",
    chatId,
    "typing",
    user.uid
  );

  setDoc(typingRef, { typing: isTyping }, { merge: true });

}, [isTyping]);


/////////////////////
  const sendMessage = async () => {
         if (!user) return;
         if (!input.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      senderId: user.uid,
      username: user.username,
      createdAt: serverTimestamp(),
    });

    await setDoc(
         doc(db, "chats", chatId),
         {
         lastMessage: input,
        lastMessageAt: serverTimestamp(),
      },
        { merge: true }
    );

    setInput("");
    setIsTyping(false);
  };

        //* Time Formatter*//
    const formatTime = (timestamp: any) => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

        const renderItem = ({ item, index }: { item: Message; index: number }) => {
  const isMe = user ? item.senderId === user.uid : false;

  const previousMessage = messages[index - 1];
  const isSameUser =
    previousMessage && previousMessage.senderId === item.senderId;

  return (
    <View
      style={{

        alignSelf: isMe ? "flex-end" : "flex-start",
        marginLeft: isMe ? 50 : 10,
        marginRight: isMe ? 10 : 50,
        backgroundColor: isMe ? "#3478f6" : "#e5e5ea",
        padding: 10,
        borderRadius: 16,

        // Bigger spacing difference
        marginTop: isSameUser ? 2 : 14,
        marginBottom: 4,

        maxWidth: "75%",

        // Remove top rounding when grouped
        borderTopRightRadius:
          isMe && isSameUser ? 6 : 16,
        borderTopLeftRadius:
          !isMe && isSameUser ? 6 : 16,
      }}
    >
      {!isMe && !isSameUser && item.username && (
        <Text
          style={{
            fontSize: 12,
            color: "#555",
            marginBottom: 4,
            fontWeight: "600",
          }}
        >
          {item.username}
        </Text>
      )}

      <Text style={{ color: isMe ? "white" : "black" }}>
        {item.text}
      </Text>

      <Text
        style={{
          fontSize: 10,
          marginTop: 4,
          alignSelf: "flex-end",
          color: isMe ? "rgba(255,255,255,0.7)" : "#555",
        }}
      >
        {formatTime(item.createdAt)}
      </Text>
    </View>
  );
};


        //  IMPORTANT: Only conditionally render AFTER hooks
  if (!user) {
    return null;
  }
  return (
    <>
            <Stack.Screen
                    options={{
                        headerBackVisible: false,

                        headerTitleAlign: chatId === "global" ? "center" : "left",

                        headerTitle: () => (
                        <Text
                            style={{
                            fontSize: 18,
                            fontWeight: "600",
                            marginLeft: chatId === "global" ? 0 : 8,
                            }}
                        >
                            {chatId === "global"
                            ? "Global Chat"
                            : otherUserName || "Private Chat"}
                        </Text>
                        ),

                        //  LEFT SIDE
                        headerLeft: () => {
                        if (chatId === "global") {
                            return (
                            <Pressable
                                onPress={() => router.push("/users")}
                                style={{ paddingLeft: 16 }}
                            >
                                <Text style={{ color: "#3478f6", fontWeight: "600" }}>
                                Users
                                </Text>
                            </Pressable>
                            );
                        }

                        return null; // no left button in private
                        },

                        // RIGHT SIDE
                        headerRight: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {chatId !== "global" && (
                            <>
                                <Pressable
                                onPress={() => router.push("/chat/global")}
                                style={{ marginRight: 16 }}
                                >
                                <Text style={{ color: "#3478f6", fontWeight: "600" }}>
                                    All Chat
                                </Text>
                                </Pressable>

                                <Pressable
                                onPress={() => router.push("/users")}
                                style={{ marginRight: 16 }}
                                >
                                <Text style={{ color: "#3478f6", fontWeight: "600" }}>
                                    Personal
                                </Text>
                                </Pressable>
                            </>
                            )}

                            <Pressable onPress={logout}>
                            <Text style={{ color: "#3478f6", fontWeight: "600" }}>
                                Logout
                            </Text>
                            </Pressable>
                        </View>
                        ),
                    }}
 
      />

      <KeyboardAvoidingView
        style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 20,   // 👈 ADD THIS
            backgroundColor: "#f5f7fb",
          
            }}
          behavior={Platform.OS === "ios" ? "padding" : "height"} /*keeps chat input field above keyboard*/
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
         

        {/*  Show Typing Indicator In UI* */}
        {otherTyping && (
            <Text style={{ marginBottom: 5, color: "gray" }}>
            {otherUserName || "User"} is typing...
            </Text>
        )}


        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}  // 👈 ADD THIS
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
            }
            />

        <View style={{ flexDirection: "row", padding: 20 }}>
          <TextInput
            value={input}
            onChangeText={(text) => {
                 setInput(text);
            setIsTyping(text.length > 0);
                                 }}
            placeholder="Type message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 8,
            }}
          />

          <Pressable
            onPress={sendMessage}
            style={{
              marginLeft: 10,
              backgroundColor: "#3478f6",
              paddingHorizontal: 20,
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}