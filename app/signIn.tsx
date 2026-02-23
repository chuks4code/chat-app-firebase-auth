import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable, Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import {Octicons } from "@expo/vector-icons"
import MyButton from '@/components/MyButton';
import { router } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/FirebaseConfig"


export default function SignIn() {
      const { login } = useAuth();


    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

                  const handleLogin = async () => {
                if (loading) return;

                if (!emailRef.current || !passwordRef.current) {
                  Alert.alert("Sign in", "Please enter all fields");
                  return;
                }

                try {
                  setLoading(true);

                  const result = await login(
                    emailRef.current.trim(),
                    passwordRef.current
                  );

                  if (!result.success) {
                    Alert.alert("Login failed", result.message);
                  }

                } finally {
                  setLoading(false);
                }
              };
        ////////////////////////////////////////////////////////////////////
              const handleForgotPassword = async () => {
                  if (!emailRef.current) {
                    Alert.alert("Reset Password", "Please enter your email first.");
                    return;
                  }

                  try {
                    await sendPasswordResetEmail(auth, emailRef.current.trim());
                    Alert.alert(
                      "Reset Email Sent",
                      "If this email exists, a password reset link has been sent."
                    );
                  } catch (error: any) {
                    Alert.alert("Error", error.message);
                  }
                };

         ////////////////////////////////////////////////////////////////////////
                    return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View >
        <StatusBar style="dark" />

        <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}>

          {/* image */}
          <View className="items-center">
            <Image
              style={{ height: hp(18) }}
              resizeMode="contain"
              source={require('../assets/images/loginImage.jpg')}
            />
          </View>

          <View className="gap-10">
            <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wide text-center text-neutral-800">
              Sign In
            </Text>

            {/* inputs */}
            <View className="gap-4">

              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={(text) => (emailRef.current = text)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Email address"
                  placeholderTextColor="gray"
                />
              </View>

              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  secureTextEntry = {secureText}
                  onChangeText={(text) => (passwordRef.current = text)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  placeholderTextColor="gray"
                />
                <Pressable onPress={() => setSecureText(!secureText)}>
                <Octicons
                  name={secureText ? "eye" : "eye-closed"}
                  size={hp(2.5)}
                  color="gray"
                />
              </Pressable>
              </View>

              <Pressable onPress={handleForgotPassword}>
                  <Text
                    style={{ fontSize: hp(1.8), color: "#3478f6" }}
                    className="text-center font-semibold text-neutral-500"
                  >
                    Forgot Password?
                  </Text>
                </Pressable>

              {/* LOGIN BUTTON */}
             <View className="w-full" >
                <MyButton
                  title="Login"
                  onPress={handleLogin}
                  loading={loading}
                />
              </View>

              {/* SIGN UP */}
              <View className="flex-row justify-center gap-2 mt-2">
                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                  Don't have an account?
                </Text>
                <Pressable onPress={() => router.push("/signUp")}>
                  <Text style={{ fontSize: hp(1.8), color: "#3478f6", fontWeight: "600" }}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>

            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

        
};





