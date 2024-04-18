<script lang="ts">
  import { goto } from "$app/navigation";
	import { firestore } from "$lib/firebase";
	import { authStore } from "$lib/stores/authStore";
	import { getDoc, setDoc, addDoc, getDocs, doc, query, where, collection, updateDoc } from "firebase/firestore";

	const COURSES = {
		Art: [
			"ADA1O", "ADA2O", "ADA3M", "ADA4M", "ADB2O", "ADB3M", "ADB4M", "ADD3M", "ADD3O", "ADD4M", "AEA4O", "AMG3O", "AMI1O", "AMI2O", "AMI3M", "AMI4M", "AMR1O", "AMR2O", "AMR3M", "AMR4M", "AMU4E", "AMV1O", "AMV2O", "AMV3M", "AMV4M", "ATC1O", "ATC2O", "ATC3M", "ATC4M", "AVI1O", "AVI2O", "AVI3M", "AVI4M", "AWC2O", "AWC3M", "AWC3O", "AWC4M", "AWD3M", "AWD4M", "AWJ2O", "AWL3M", "AWQ3M", "AWQ3O", "AWQ4M", "AWS4M",
		],
		Business: [
			"BAF3M", "BAT4M", "BBB4M", "BEM1O", "BEP2O", "BMI3C", "BOH4M",
		],
		Geography: [
			"BAF3M", "BAT4M", "BBB4M", "BEM1O", "BEP2O", "BMI3C", "BOH4M",
		],
		"Civics And Careers": [
			"CIVCAR",
		],
		"Computer Studies": [
			"ICD2O", "ICS3C", "ICS3U", "ICS4C", "ICS4U", 
		],
		English: [
			"ENG1L", "ENG2D", "ENG2L", "ENG2P", "ENG4C", "ENG4E", "ENG4U", "ENL1W", "EWC4U", "NBE3C", "NBE3E", "NBE3U", "OLC4O", 
		],
		ESL: [
			"EPS3O", "ESLAO", "ESLBO", "ESLCO", "ESLDO", "ESLEO", 
		],
		"International Languages": [
			"FSF1D", "FSF1O", "FSF2D", "FSF2P", "FSF3U", "FSF4U", "LWSBD", 
		],
		"Special Education": [
			"GLE1O", "GLE2O", "GLE3O", "GLE4O", "GLS1O", "GPP3O", 
		],
		"Physical Education": [
			"PAF2O", "PAF3O", "PAF4O", "PAI3O", "PAI4M", "PAI4O", "PPL1O", "PPL2O", "PPL3O", "PPL4O", "PSK4U", 
		],
		"Interdisciplinary Studies": [
			"IDC3O", "IDC4U", 
		],
		Math: [
			"MAP4C", "MAT1L", "MAT2L", "MBF3C", "MC43U", "MCF3M", "MCR3U", "MCT4C", "MCV4U", "MDM4U", "MEL3E", "MEL4E", "MFM2P", "MHF4U", "MPM2D", "MTH1W", 
		],
		Science: [
			"SBI3C", "SBI3U", "SBI4U", "SCH3U", "SCH4C", "SCH4U", "SCHU6", "SNC1W", "SNC2D", "SNC2L", "SNC2P", "SPH3U", "SPH4C", "SPH4U", 
		],
		"Social Sciences": [
			"HFA4C", "HFA4U", "HFC3M", "HFN2O", "HHG4M", "HIF1O", "HPW3C", "HSB4U", "HSG3M", "HSP3U", "HZT4U", 
		],
		"Technological Education": [
			"TAS1O", "TCJ2O", "TDJ2O", "TDJ3M", "TDJ4M", "TEJ2O", "TEJ3M", "TEJ4M", "TGJ2O", "TGV3M", "TGV4M", "TWJ3E", "TWJ4E", 
		]
	}

	let text: string = "";

	async function onSubmit() {
		if (!text.trim()) {
			return;
		}

		if (!$authStore.currentUser) {
			return;
		}

		if (!filteredCourses.some(([subject, courses]) => courses.some(course => course.toLowerCase() === text.toLowerCase()))) {
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

	$: filteredCourses = Object.entries(COURSES)
		.map(([subject, courseCodes]) => [
			subject,
			courseCodes
			.filter(courseCode => courseCode.toLowerCase().startsWith(text.toLowerCase()))] as [string, string[]]
		)
		.filter(([subject, courseCodes]) => courseCodes.length)
</script>

<form on:submit|preventDefault={onSubmit} class="search-bar" class:error-outline={!filteredCourses.length}>
	<input type="text" bind:value={text}>
	<button type="submit">
		<i class="ri-search-line"></i>
	</button>
</form>
<section class="select">
	{#if !filteredCourses.length}
		<p>No courses found.</p>
	{/if}
	{#each filteredCourses as [subject, courseCodes]}
		<h2>{subject}</h2>
		<div class="courses">
			{#each courseCodes as courseCode}
					<button class="course-badge" on:click={() => text = courseCode}>{courseCode}</button>
			{/each}
		</div>
	{/each}
</section>

<style lang="scss">
	@use "../../../styles/sass/imports" as imports;

	.search-bar {
		width: clamp(32rem, 40%, 42rem);
		margin: 0 auto;

		display: flex;
		flex-direction: row;

		margin-top: 2rem;

		border: 2px solid black;
		border-radius: 8px;

	}
	
	.error-outline {
		outline: 2px solid hsl(0, 90%, 60%);
	}

	.search-bar input {
		all: unset;
		
		padding: 0.5rem 0.25rem;
		flex-grow: 1;
		font-size: 1.25rem;
		padding-left: 0.75rem;
	}

	.search-bar button {
		all: unset;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0.25rem 0.75rem;
		font-size: 1.25rem;

		&:hover {
			cursor: pointer;
		}
	}

	.select {
		width: clamp(42rem, 60%, 60rem);
		margin: 0 auto;

		display: flex;
		flex-direction: column;

		margin-top: 2rem;

		border: 2px solid black;
		border-radius: 8px;

		padding: 1rem;

		gap: 1rem;
	}

	.select h2 {
		font-weight: bold;
		font-family: "Poppins", sans-serif;
	}

	.courses {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		flex-wrap: wrap;

	}

	.courses button {
		all: unset;
		@include imports.button;

		padding: 0.5rem;
		font-family: "Poppins", sans-serif;

		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);

		transition: all 100ms ease-out;

		&:hover {
			background-color: hsl(0, 0%, 5%);
			color: white;
		}
	}
</style>