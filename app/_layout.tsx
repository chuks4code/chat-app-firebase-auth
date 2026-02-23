import '../global.css';
import { useAuth, AuthContextProvider } from '@/context/authContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';


                  /* route guard layout */

            const MainLayout = () => {
            const { isAuthenticated } = useAuth();
            const segments = useSegments();
            const router = useRouter();


                  useEffect(() => {
                        if (isAuthenticated === undefined) return;

                        const segment = segments?.[0];

                        const inAuth =
                        segment === "signIn" ||
                        segment === "signUp";

                        // Not logged in → must be on auth
                        if (!isAuthenticated && !inAuth) {
                        router.replace("/signIn");
                        return;
                        }

                        // ✅ Logged in → block auth pages only
                        if (isAuthenticated && inAuth) {
                        router.replace("/chat/global");
                        return;
                        }

                   }, [isAuthenticated, segments]);


                  // useEffect(() => {
                  //       if (isAuthenticated === undefined) return;

                  //       const segment = segments?.[0];

                  //       const inAuth =
                  //       segment === "signIn" ||
                  //       segment === "signUp";

                  //       const isRoot =
                  //       segment === undefined;

                  //       // 🚫 Not logged in → force to sign in
                  //       if (!isAuthenticated && !inAuth) {
                  //       router.replace("/signIn");
                  //       return;
                  //       }

                  //       // ✅ Logged in but on auth pages → go to global
                  //       if (isAuthenticated && inAuth) {
                  //       router.replace("/chat/global");
                  //       return;
                  //       }

                  //       // ✅ Logged in and at root only → go to global
                  //       if (isAuthenticated && isRoot) {
                  //       router.replace("/chat/global");
                  //       return;
                  //       }

                  // }, [isAuthenticated, segments]);

                        //   useEffect(() => {
                        // if (isAuthenticated === undefined) return;

                        // const segment = segments[0];

                        // const inAuth =
                        // segment === "signIn" || segment === "signUp";

                        // // 🚀 If logged in and at root → go to global chat
                        // if (isAuthenticated && (!segments || segments[0] === undefined)) {
                        // router.replace("/chat/global");
                        // return;
                        // }

                        // // 🚀 If logged in and on auth screen → go to chat
                        // if (isAuthenticated && inAuth) {
                        // router.replace("/chat/global");
                        // return;
                        // }

                        // // 🚀 If NOT logged in and trying to access protected route
                        // if (!isAuthenticated && !inAuth) {
                        // router.replace("/signIn");
                        // return;
                        // }
                        // }, [isAuthenticated, segments]);

                

            /* render nothing while loading */ 
            if (isAuthenticated === undefined) return null;

            /* render the current route */
            return <Slot />;
            };

            

        export default function RootLayout() {
        return (
         <AuthContextProvider>
          <MainLayout/>
         </AuthContextProvider>
        )
}