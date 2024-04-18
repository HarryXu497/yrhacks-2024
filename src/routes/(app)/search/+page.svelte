<script lang="ts">
  import { goto } from "$app/navigation";
	import { firestore } from "$lib/firebase";
	import { authStore } from "$lib/stores/authStore";
	import { getDoc, setDoc, addDoc, getDocs, doc, query, where, collection, updateDoc } from "firebase/firestore";

	let text: string = "";

	async function onSubmit() {
		if (!text.trim()) {
			return;
		}

		if (!$authStore.currentUser) {
			return;
		}

		const classRef = collection(firestore, "classes");
		const search = text.toLowerCase();

		const q = query(
			classRef,
			where("course", "==", search),
		);

		const classes = (await getDocs(q)).docs;

		let roomId;

		if (classes.length === 0) {
			const classes = collection(firestore, "classes");
			const roomDoc = await addDoc(classes, {
				course: search,
				members: [
					$authStore.currentUser.uid,
				]
			})

			const uid = $authStore.currentUser!.uid;

			const userDoc = doc(firestore, "users", uid);

			await updateDoc(userDoc, {
				classId: roomDoc.id,
			})

			roomId = roomDoc.id;
		}

		for (const room of classes) {
			if (!room.exists()) {
				continue;
			}

			const data = room.data();

			if (data?.members?.length >= 8) {
				continue;
			}

			const uid = $authStore.currentUser!.uid;

			const userDoc = doc(firestore, "users", uid);

			await updateDoc(userDoc, {
				classId: room.id,
			})

			const classDocRef = room.ref;
			const classDoc = (await getDoc(classDocRef)).data()!;
			const members = classDoc.members as string[];
			if (!members.includes(uid)) {
				members.push(uid);
			}

			await updateDoc(classDocRef, {
				members,
			});

			roomId = room.id;
			break;
		}

		goto(`/room/${roomId}`);
	}
</script>

<form on:submit|preventDefault={onSubmit} class="search-bar">
	<input type="text" bind:value={text}>
	<button type="submit">
		<i class="ri-search-line"></i>
	</button>
</form>

<style lang="scss">
	.search-bar {
		width: clamp(32rem, 40%, 42rem);
		margin: 0 auto;

		display: flex;
		flex-direction: row;

		margin-top: 2rem;

		border: 2px solid black;
		border-radius: 8px;

	}
	
	.search-bar input {
		all: unset;
		
		padding: 0.5rem 0.25rem;
		flex-grow: 1;
		font-size: 1.25rem;
	}

	.search-bar button {
		all: unset;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0.25rem 0.75rem;
		font-size: 1.25rem;
	}
</style>