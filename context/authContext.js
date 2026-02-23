import {Children,  useContext,  useEffect,  useState} from "react"
import { createContext } from 'react';
import { auth, db } from "../FirebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, serverTimestamp } from "firebase/firestore";



export const AuthContext = createContext();

export const AuthContextProvider = ({children})=> {
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
                const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

                    if (firebaseUser) {
                    // get profile from firestore
                    const docRef = doc(db, "users", firebaseUser.uid);
                    const docSnap = await getDoc(docRef);

                    try {
                        if (docSnap.exists()) {
                            setUser({ uid: firebaseUser.uid, ...docSnap.data() });
                            setIsAuthenticated(true);
                        } else {
                            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
                            setIsAuthenticated(true);
                        }
                        } catch {
                        setUser(null);
                        setIsAuthenticated(false);
                        }


                    } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    }

                });

                return unsubscribe;
            }, []);


    /////////////////////////////////////////////////////////////////////
          const login = async (email, password) => {
                    try {
                        await signInWithEmailAndPassword(auth, email, password);
                        return { success: true };
                    } catch (error) {
                        return { success: false, message: error.message };
                    }
                    };

  

    /////////////////////////////////////////////////////////

                        const logout = async () => {
                         await signOut(auth);
                    };

    ////////////////////////////////////////////////////////////////////////////////////////
                    const register = async (email, password, username, profileUrl) => {
                try {
                    // Create auth account
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const firebaseUser = userCredential.user;

                    // Create Firestore profile
                    await setDoc(doc(db, "users", firebaseUser.uid), {
                    uid: firebaseUser.uid,
                    username,
                    email,
                    photoURL: profileUrl || "",
                    createdAt: serverTimestamp(),
                    });

                    return { success: true };

                } catch (error) {
                    let message = "Something went wrong. Please try again.";

                    if (error.code === "auth/email-already-in-use") {
                    message = "This email is already in use.";
                    }

                    if (error.code === "auth/invalid-email") {
                    message = "Please enter a valid email address.";
                    }

                    if (error.code === "auth/weak-password") {
                    message = "Password must be at least 6 characters.";
                    }

                    return { success: false, message };
                }
                };



      ///////////////////////////////////////////////////////////////////////////////
    return(
        <AuthContext.Provider value= {{user, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = ()=>{
const value = useContext(AuthContext);
if(!value){
throw new Error( 'useAuth must be wrapped inside AuthContextProvider' );
}
return value;

}
