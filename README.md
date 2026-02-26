# 📱 Real-Time Chat App (React Native Expo  + Firebase)

A modern real-time chat application built with **React Native (Expo Router)** and **Firebase**, supporting global chat, private messaging, typing indicators, unread badges, and real-time presence tracking.
---

##  Features

###  Authentication
- Email & Password authentication (Firebase Auth)
- Password reset functionality
- Secure login & logout flow
- Route protection using custom AuthContext

###  Real-Time Messaging
- Global chat room
- Private 1-on-1 chat
- Real-time message updates using Firestore
- Message timestamps
- Auto-scroll to latest message

###  Presence & Status
- Online user tracking
- Real-time online count in global chat
- Typing indicators in private chat
- Read tracking (lastRead timestamps)

###  Unread Notifications
- Unread message badge per private conversation
- Automatically clears when chat is opened

###  Mobile UX Improvements
- Keyboard-aware chat input (no overlap)
- Custom navigation headers
- Smooth layout handling across iOS & Android
- Clean UI with grouped message bubbles

---

##  Tech Stack

- **React Native (Expo)**
- **Expo Router**
- **Firebase Authentication**
- **Cloud Firestore**
- **React Context API**
- **TypeScript**
- **NativeWind / Tailwind styling**

---

## 📂 Project Structure
app/
├── (app)/
│ ├── chat/[id].tsx
│ ├── users.tsx
├── signIn.tsx
├── signUp.tsx
context/
├── authContext.tsx
FirebaseConfig.js
components/
├── MyButton.tsx

---

## 📈 Future Improvements

- Push notifications
- Message delivery status (sent / delivered / read)
- Profile pictures
- Chat list screen with previews
- Media attachments
- Production build deployment

---
**Screenshots** 
<img width="250"  src="https://github.com/user-attachments/assets/7aed3f42-174a-47ee-a906-8fb2dd6e8fb2" />
<img width="250"  src="https://github.com/user-attachments/assets/0deabb8a-17ee-4b77-b741-f0f43ce538bc" />
<img width="250"  src="https://github.com/user-attachments/assets/83619b1e-d81b-44f1-aaff-9c53993e0b78" />
<img width="250"  src="https://github.com/user-attachments/assets/09867da3-8c7a-469a-b3b6-48bf0b1e927a" />


