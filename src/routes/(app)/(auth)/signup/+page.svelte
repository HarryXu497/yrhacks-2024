<script lang="ts">
	import Card from "$lib/components/Card.svelte";
	import UserForm from "$lib/components/UserForm.svelte";
	import { signUp } from "$lib/stores/authStore";
	import { goto } from "$app/navigation";
	import { firestore } from "$lib/firebase";
	import { setDoc, doc } from "firebase/firestore";
	import { type UserCredential } from "firebase/auth";

	let email = "";
	let username = "";
	let password = "";
	let school = "";
	let grade: number | null = null;

	let error: string | null = null;
	let page: 'credential' | 'detail' = 'credential';

	function nextPage() {
		page = 'detail';
		console.log(email)
	}

	function prevPage() {
		page = 'credential';
	}

	async function onSignIn() {
		if (!email.trim() || !username.trim() || !password.trim()) {
			error = "Invalid input(s)";
			return;
		}

		if (grade && (grade < 1 || grade > 15)) {
			error = "Invlid grade";
			return;
		}

		let credentials: UserCredential;

		try {
			credentials = await signUp(username, email, password);
		} catch (e) {
			const code = (e as any).code;

			if (code === "auth/email-already-in-use") {
				error = "Email already exists"
				return;
			} 

			if (code === "auth/invalid-email") {
				error = "Invalid email"
				return;
			}

			if (code === "auth/weak-password") {
				error = "Password should be at least 6 characters";
				return;
			}

			error = "Something went wrong";
			return;
		}

		const userRef = doc(firestore, "users", credentials.user.uid);

		await setDoc(userRef, {
			name: username,
			school,
			grade,
		});

		goto("/");
	}

	
</script>

<main class="content">
	<Card>
		<h1>Sign Up</h1>

		<UserForm on:submit={onSignIn} bind:error={error} usernameField={true}>
			{#if page === 'credential'}
				<div class="form-group">
					<label for="email">Email</label>
					<input type="text" name="email" id="email" bind:value={email}>
				</div>
				<div class="form-group">
					<label for="username">Username</label>
					<input type="text" name="username" id="username" bind:value={username}>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" name="password" id="password" bind:value={password}>
				</div>
			{:else}
				<div class="form-group">
					<label for="school">School</label>
					<input type="text" name="school" id="school" bind:value={school}>
				</div>
				<div class="form-group">
					<label for="grade">Grade</label>
					<input type="number" name="grade" id="grade" bind:value={grade}>
				</div>
			{/if}
			<svelte:fragment slot="main-button">
				{#if page === 'credential'}
					<button class="button bold" type="button" on:click={nextPage}>Next</button>
				{:else}
					<button class="button bold" type="submit">Sign Up</button>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="secondary-button">
				{#if page === 'credential'}
					<a class="button" href="/login">Log In instead</a>
				{:else}
					<button class="button" type="button" on:click={prevPage}>Back</button>
				{/if}
			</svelte:fragment>
		</UserForm>
	</Card>
</main>


<style lang="scss">
	@use "../../../../styles/sass/imports" as imports;

	.form-group {
		display: flex;
		flex-direction: column;

		gap: 0.5rem;
	}

	.form-group input {
		all: unset;
		font-size: 1rem;
		padding: 0.25rem;
		border-bottom: 1px solid black;

		&:focus {
			outline: 1px solid black;
		}
	}

	.form-group input {
		all: unset;
		
		padding: 0.5rem;
		border: 1px solid black;
		border-radius: 10px;
	}

	.content {
		padding: 10rem;
		width: clamp(32%, 30rem, 50%);
		margin: 0 auto;
	}

	h1 {
		font-family: "Poppins", sans-serif;

		text-align: center;
		font-weight: bold;
		font-size: 2.5rem;

		margin-bottom: 2rem;
	}
	
	.button {
		@include imports.button;

		width: 50%;
		flex-grow: 1;
		padding: 0.5rem;
		font-family: "Poppins", sans-serif;
		font-size: 1rem;

		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);

		&:hover {
			background-color: hsl(0, 0%, 90%)
		}
	}
	
	.button.bold {
		@include imports.button($color: hsl(0, 0%, 10%), $text-color: hsl(0, 0%, 100%));
		
		&:hover {
			background-color: hsl(0, 0%, 20%)
		}
	}
</style>