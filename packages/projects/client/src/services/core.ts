import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import DB from './db';
import Auth from './auth';
import User from './user';
import Team from './team';
import Board from './board';
import Invite from './invite';
import Template from './template';

// VARIABLES

export const url = {
    origin: window.location.origin
};

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

// FIREBASE SERVICES
const firebaseAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// const config = getRemoteConfig(app);
// const analytics = getAnalytics(app);

export const auth = new Auth({
    googleAuth: () => signInWithPopup(firebaseAuth, googleProvider),
    signout: () => signOut(firebaseAuth),
});

export const db = new DB(getFirestore(app));

// ENTITY SERVICES
export const userServices = new User(db);
export const teamServices = new Team(db);
export const boardServices = new Board(db);
export const inviteServices = new Invite(db);
export const templateServices = new Template(db);