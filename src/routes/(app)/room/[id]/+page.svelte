<script lang="ts">
  	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { firestore } from "$lib/firebase";
	import { setDoc, doc, collection, getDoc, query, onSnapshot, getDocs, orderBy, addDoc, Firestore, serverTimestamp } from "firebase/firestore";
	import { authStore } from '$lib/stores/authStore';
	import type { Writable } from 'svelte/store';
  	import { goto } from '$app/navigation';
  	import Chat from '$lib/components/Chat.svelte';
  	import type IMessage from '$lib/models/Message.model';
  	import Card from '$lib/components/Card.svelte';
	
	export let data: PageServerData;
	let messages: IMessage[] = [];
	let userId: string;
	let course: string;

	let text: string;

	async function onSubmit() {
		if (!$authStore.currentUser?.uid) {
			return;
		}

		const messagesRef = collection(firestore, "classes", data.classId, "messages");

		await addDoc(messagesRef, {
			senderId: $authStore.currentUser?.uid,
			senderName: $authStore.currentUser?.displayName,
			text,
			sentAt: serverTimestamp(),
		});

		text = "";
	}

	authStore.subscribe(async (user) => {
		if (!user.currentUser) {
			return;
		}

		userId = user.currentUser.uid;

		const userDoc = doc(firestore, "users", user.currentUser.uid);
		const userData = await getDoc(userDoc);
		const classId = userData.data()?.classId;
		
		if (classId != data.classId) {
			goto("/search");
			return;
		}

		const classRef = doc(firestore, "classes", classId);
		const classData = await getDoc(classRef);
		course = classData.data()?.course;

		const messagesRef = collection(firestore, "classes", classId, "messages");
		const q = query(messagesRef, orderBy("sentAt", "asc"));
		onSnapshot(q, querySnapshot => {
			messages = querySnapshot.docs.map(snap => {
				const data = snap.data();
				
				return ({
					senderId: data.senderId,
					senderName: data.senderName,
					text: data.text,
					sentAt: data.sentAt.toDate(),
				}) as IMessage;
			});
		})
	});

</script>

<main class="chat">
	<Card>
		<div class="chat__content">
			{#if $authStore && messages.length}
				<h1>{course?.toUpperCase()}</h1>
				<Chat
					{messages}
					{userId}
					bind:text={text}
					on:submit={onSubmit}
					/>
			{:else}
				<div class="loading">Loading...</div>
			{/if}
		</div>
	</Card>
</main>

<style lang="scss">
	.chat {
		width: clamp(35%, 32rem, 50%);
		margin: 0 auto;
		margin-top: 2rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: bold;
		font-size: 1.5rem;
	}

	h1 {
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.chat__content {
		aspect-ratio: 1/1;
	}
</style>