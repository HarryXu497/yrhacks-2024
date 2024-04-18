import { auth } from "$lib/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth";
import { writable } from "svelte/store";

interface AuthStore {
	currentUser: User | null;
}

export const authStore = writable<AuthStore>({
	currentUser: null
})

export const signUp = async (username: string, email: string, password: string) => {
	const cred = await createUserWithEmailAndPassword(auth, email, password);

	await updateProfile(cred.user, {
		displayName: username
	})

	return cred;
}

export const logIn = async (email: string, password: string) => {
	await signInWithEmailAndPassword(auth, email, password)
}

export const logOut = async () => {
	await signOut(auth);
}

export const resetPassword = async (email: string) => {
	await sendPasswordResetEmail(auth, email);
}