<script lang="ts">
  	import { goto } from "$app/navigation";
	import Card from "$lib/components/Card.svelte";
	import UserForm from "$lib/components/UserForm.svelte";
	import { logIn } from "$lib/stores/authStore";

	let email = "";
	let password = "";

	let error: string | null = null;

	async function onLogIn(e: SubmitEvent) {
		if (!email || !password) {
			error = "Invalid email or password";
			return;
		}

		try {
			await logIn(email, password);
			goto("/")
		} catch (e) {
			const code = (e as any).code;

			if (code === "auth/email-already-in-use") {
				await logIn(email, password);
				await goto("/");
				return;
			} 

			if (code === "auth/invalid-email") {
				error = "Invalid email"
				return;
			}

			error = "Something went wrong";
			return;
		}
	}
</script>

<main class="content">
	<Card>
		<h1>Log In</h1>

		<UserForm on:submit={onLogIn} bind:error={error}>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="text" name="email" id="email" bind:value={email}>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" name="password" id="password" bind:value={password}>
			</div>

			<svelte:fragment slot="main-button">
				<button class="button" type="submit">Log In</button>
			</svelte:fragment>
			<svelte:fragment slot="secondary-button">
				<a class="button" href="/signup">Sign Up instead</a>
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
	
	.button[type="submit"] {
		@include imports.button($color: hsl(0, 0%, 10%), $text-color: hsl(0, 0%, 100%));
		
		&:hover {
			background-color: hsl(0, 0%, 20%)
		}
	}
</style>