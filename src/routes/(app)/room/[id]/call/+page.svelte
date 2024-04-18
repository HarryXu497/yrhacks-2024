<script lang="ts">
	import type { PageServerData } from './$types';
	import { authStore } from "$lib/stores/authStore";
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
	import { firestore } from '$lib/firebase';
	import { onMount, onDestroy } from 'svelte';
	import { navigating } from '$app/stores';

	let Peer: typeof import("peerjs").Peer;
	export let data: PageServerData;

	let numPeriods = 1;
	const intervalId = setInterval(incPeriods, 300);

	function incPeriods() {
		numPeriods = (numPeriods + 1) % 3;
	}

	let closeConnection: () => void;
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

		const roomRef = doc(firestore, "classes", data.classId);
		onSnapshot(roomRef, snapshot => {
			const peerIds = snapshot.data()?.members;

			for (const peerId of peerIds) {
				if (peerId === userId) {
					continue;
				}
				
				const call = peer.call(peerId, mediaStream);
				
				call.on("stream", stream => {
					peerConnections[call.peer] = stream;
				})

				call.on("close", () => {
					delete peerConnections[call.peer];
					peerConnections = peerConnections;
				})
				
				closeConnection = () => {
					call.close();
					peerConnections = peerConnections
				}
			}
		});

		peer.on('call', call => {
			call.answer(mediaStream);
			
			call.on("stream", stream => {
				peerConnections[call.peer] = stream;
				peerConnections = peerConnections;
			})

			call.on("close", () => {
				delete peerConnections[call.peer];
				peerConnections = peerConnections;
			})
		});
	});

	onDestroy(() => {
		clearInterval(intervalId)

		if (closeConnection) {
			closeConnection();
		}
	})

	$: if ($navigating && closeConnection) closeConnection();

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

	function cols(size: number) {
		if (size <= 1) {
			return 1;
		}

		if (size >= 2 && size <= 4) {
			return 2;
		}

		return 3;
	}

	$: columns =  cols(Object.entries(peerConnections).length)

</script>

<main class="video" style="--columns: {columns};">
	{#if !Object.entries(peerConnections).length }
		<div>
			Waiting for other users {".".repeat(numPeriods + 1)}
		</div>
	{/if}
	{#each Object.entries(peerConnections) as connection, i}
		<video bind:this={videoElements[i]}>
			
		</video>
	{/each}
</main>

<style lang="scss">
	.video {
		width: clamp(40rem, 80%, 84rem);
		display: grid;
		
		grid-template-columns: repeat(var(--columns), 1fr);

		margin: 0 auto;
		margin-top: 2rem;
		gap: 1rem;
	}

	.video video {
		width: 100%;
		border: 2px solid black;
		border-radius: 8px;
		margin: 0 auto;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
	}

	.video div {
		text-align: center;
		margin-top: 8rem;
	}
</style>