<script lang="ts">
	import type { PageServerData } from './$types';
	import { firestore } from "$lib/firebase";
	import { doc, collection, getDoc, query, onSnapshot, getDocs, orderBy, addDoc, Firestore, serverTimestamp } from "firebase/firestore";
	import { authStore } from '$lib/stores/authStore';
  	import { goto } from '$app/navigation';
  	import Chat from '$lib/components/Chat.svelte';
  	import type IMessage from '$lib/models/Message.model';
  	import Card from '$lib/components/Card.svelte';
	
	export let data: PageServerData;
	let messages: (IMessage | null)[] = [];
	let userId: string;
	let course: string;

	let text: string;
	let latex: boolean = false;

	$: filteredMessages = <IMessage[]> messages.filter(message => !!message); 

	async function onSubmit() {
		if (!$authStore.currentUser?.uid) {
			return;
		}

		if (!text.trim()) {
			return;
		}

		const messagesRef = collection(firestore, "classes", data.classId, "messages");

		await addDoc(messagesRef, {
			senderId: $authStore.currentUser?.uid,
			senderName: $authStore.currentUser?.displayName,
			text,
			sentAt: serverTimestamp(),
			latex: latex,
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

				if (!data.sentAt) {
					return null;
				}
				
				return ({
					senderId: data.senderId,
					senderName: data.senderName,
					text: data.text,
					sentAt: data.sentAt.toDate(),
					latex: data?.latex || false,
				}) as IMessage;
			});
		})
	});

	let hover = false;

	function refresh() {
		location.reload();

		window.location.href = `/room/${data.classId}/call`;
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.css" integrity="sha384-K1E1xaIzoWihlXfiT5fcmLNabsnrl+dqc0errnRwtMX14tKRA9cCYNDGnXiHEZMs" crossorigin="anonymous">
	<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.js" integrity="sha384-IolEJdmwZJpJkyCvXBnmGt8wXcP3nvRjxBjPv7/PWW7oODJhZ+qiY1sDpwgjcKLT" crossorigin="anonymous"></script>
</svelte:head>

<main class="chat">
	<Card>
		<div class="chat__content">
			{#if $authStore}
				<div class="topbar">
					<h1>{course?.toUpperCase()}</h1>
					<button on:click={refresh} on:mouseenter={() => hover = true} on:mouseleave={() => hover = false}>
						{#if hover}
							<i class="ri-phone-fill"></i>
						{:else}
							<i class="ri-phone-line"></i>
						{/if}
					</button>
				</div>
				<Chat
					messages={filteredMessages}
					{userId}
					bind:text={text}
					bind:latex={latex}
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

	.topbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;

		h1 {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
	}
	
	.topbar button {
		all: unset;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 1.75rem;

		&:hover {
			cursor: pointer
		}
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
	}

	.chat__content {
		aspect-ratio: 1/1;
	}
</style>