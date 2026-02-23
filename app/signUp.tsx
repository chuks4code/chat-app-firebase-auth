import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable, Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import {Octicons } from "@expo/vector-icons"
import MyButton from '@/components/MyButton';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { useAuth } from "../context/authContext"; 





export default function SignUp() {

    const emailRef = useRef("");
    const passwordRef = useRef("");
     const profilRef = useRef("");
    const usernameRef = useRef("");
    const [loading, setLoading] = useState(false);



                      const { register } = useAuth();

                                  const handleLogin = async () => {
                                            if (loading) return;

                                            if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
                                              Alert.alert("Sign up", "Please enter all fields");
                                              return;
                                            }

                                            try {
                                              setLoading(true);

                                              const result = await register(
                                                emailRef.current.trim(),
                                                passwordRef.current,
                                                usernameRef.current
                                              );

                                              if (!result.success) {
                                                Alert.alert("Signup failed", result.message);
                                              }

                                            } finally {
                                              setLoading(false);
                                            }
                                          };



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
                                                      Sign Up
                                                    </Text>

                                                    {/* inputs */}
                                                    <View className="gap-4">

                                                      <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                                                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                                                        <TextInput
                                                      
                                                          onChangeText={(text) => (usernameRef.current = text)}
                                                          style={{ fontSize: hp(2) }}
                                                          className="flex-1 font-semibold text-neutral-700"
                                                          placeholder="User name"
                                                          placeholderTextColor="gray"
                                                        />
                                                      </View>

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
                                                          secureTextEntry
                                                          onChangeText={(text) => (passwordRef.current = text)}
                                                          style={{ fontSize: hp(2) }}
                                                          className="flex-1 font-semibold text-neutral-700"
                                                          placeholder="Password"
                                                          placeholderTextColor="gray"
                                                        />
                                                      </View>

                                                      {/* <Text style={{ fontSize: hp(1.8) }} className="text-center font-semibold text-neutral-500">
                                                        Forgot Password
                                                      </Text> */}

                                                      {/* SignUp BUTTON */}
                                                    <View className="w-full" >
                                                        <MyButton
                                                          title="Sign Up"
                                                          onPress={handleLogin}
                                                          loading={loading}
                                                        />
                                                      </View>

                                                      {/* SIGN UP */}
                                                      <View className="flex-row justify-center gap-2 mt-2">
                                                        <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                                                          Already have an accout?
                                                        </Text>
                                                        <Pressable onPress={() => router.push("/signIn")}>
                                                          <Text style={{ fontSize: hp(1.8), color: "#3478f6", fontWeight: "600" }}>
                                                            Login
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





