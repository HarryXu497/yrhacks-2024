<script lang="ts">
	import type { PageServerData } from './$types';
	import { authStore } from "$lib/stores/authStore";

	export let data: PageServerData;

	let videoElement: HTMLVideoElement;

	function getMessageFromServer(userId: string) {
		return (message: MessageEvent<any>) => {
			const messageData = JSON.parse(message.data);
			const peerId = messageData.userId;
	
			if (peerId === userId || (messageData.dest !== userId && messageData.dest !== 'all')) {
				return;
			}

			if (messageData.displayName && messageData.dest === 'all') {
				// initConnection(peerId, message.displayName)
			}
		}
	}

	authStore.subscribe(async (user) => {
		if (!user.currentUser) {
			return;
		}

		const userId = user.currentUser.uid;
		const userName = user.currentUser.displayName;

		if (!navigator.mediaDevices.getUserMedia) {
			alert("Your browser does not support video calls"); // TODO replace
			return;
		}

		const constraints = {
			video: {
				width: {max: 320},
				height: {max: 240},
				frameRate: {max: 30},
			},
			audio: true,
		};

		const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
		videoElement.srcObject = mediaStream;

		const serverConnection = new WebSocket(`wss://${window.location.hostname}/rooms/${data.classId}:${8080}`);
		serverConnection.onmessage = getMessageFromServer(userId);
		serverConnection.onopen = event => {
			serverConnection.send(JSON.stringify({
				displayName: userName,
				userId,
				dest: "all",
			}))
		}
	});
</script>


<video bind:this={videoElement}></video>
