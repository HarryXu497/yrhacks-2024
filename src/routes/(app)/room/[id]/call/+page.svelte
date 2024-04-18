<script lang="ts">
	import type { PageServerData } from './$types';
	import { authStore } from "$lib/stores/authStore";
	import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
	import { firestore } from '$lib/firebase';
	import { onMount, onDestroy } from 'svelte';
	import { CalculationInterpolation } from 'sass';


	interface PeerConnection {
		displayName: string;
		conn: RTCPeerConnection;
	}



	let Peer: typeof import("peerjs").Peer;
	export let data: PageServerData;

	let unsubscribe: Unsubscribe;
	let videoElements: HTMLVideoElement[] = [];
	let peerConnections: Record<string, MediaStream> = {};

	onMount(async () => {
		Peer = (await import('peerjs')).Peer;
	})

	authStore.subscribe(async (user) => {
		if (!user.currentUser || !Peer) {
			return;
		}

		const userId = user.currentUser.uid;
		const userName = user.currentUser.displayName;

		const roomRef = doc(firestore, "classes", data.classId);
		unsubscribe = onSnapshot(roomRef, snapshot => {
			const peerIds = snapshot.data()?.members;

			for (const peerId of peerIds) {
				if (peerId === userId) {
					continue;
				}
				
				const call = peer.call(peerId, mediaStream);
				
				console.log(call)
				call.on("stream", stream => {
					peerConnections[call.peer] = stream;
				})
			}
		});

		const mediaStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,

		});

		const peer = new Peer(userId, {
			path: "rtc",
			port: 5174,
			secure: false,
			key: "peerjs",
			host: "127.0.0.1",
		});

		peer.on('call', call => {
			console.log("Answer")
			call.answer(mediaStream);
			
			call.on("stream", stream => {
				peerConnections[call.peer] = stream;
				peerConnections = peerConnections;
			})
		});
	});

	const play = async ([id, stream]: [string, MediaStream], i: number) => {
		try {
			videoElements[i].srcObject = stream;
			await videoElements[i].play();

			
		} catch (e) {
			console.log("error converting streams")
		}
	}

	$: {
		setTimeout(() => {
			Object.entries(peerConnections).forEach(play)	
		}, 500)
	}
</script>

<main class="video">
	{#each Object.entries(peerConnections) as connection, i}
		<video bind:this={videoElements[i]}>
		
		</video>
	{/each}
</main>

<style lang="scss">
	.video {
		width: clamp(40rem, 80%, 84rem);
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;

		margin: 0 auto;
	}

	.video video {
		width: 50%;
	}
</style>