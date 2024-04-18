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
			where("course", ">=", search),
			where("course", "<", search.substring(0, search.length - 1) + String.fromCharCode(search.charCodeAt(search.length - 1) + 1)),
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
			members.push(uid);

			await updateDoc(classDocRef, {
				members,
			});

			roomId = room.id;
			break;
		}

		goto(`/room/${roomId}`)
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<input type="text" bind:value={text}>
	<button type="submit">Submit</button>
</form>