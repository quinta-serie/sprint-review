import { initializeApp } from 'firebase/app';
import { getRemoteConfig } from 'firebase/remote-config';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import Auth from './auth';

// FIREBASE
const app = initializeApp({
    appId: import.meta.env.VITE_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    projectId: import.meta.env.VITE_PROJECT_ID,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
}, 'client');

// AUTH
const firebaseAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const config = getRemoteConfig(app);
const analytics = getAnalytics(app);

export const auth = new Auth({
    googleAuth: () => signInWithPopup(firebaseAuth, googleProvider),
    signout: () => signOut(firebaseAuth),
});
