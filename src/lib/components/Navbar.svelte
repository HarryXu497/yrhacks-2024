<script lang="ts">
  	import { authStore, logOut } from "$lib/stores/authStore";

	export let search = false
</script>

<nav class="navbar">
	<div class="navbar__logo">
		<a href="/">StudyLine</a>
	</div>
	<div class="navbar__links">
		{#if search}
			<a href="/search" class="outline">Search Subjects</a>
		{/if}
		{#if $authStore.currentUser}
			{#if $authStore.currentUser.displayName}
				<em>{$authStore.currentUser.displayName}</em>
			{/if}
			<button on:click={logOut}>Log out</button>
		{:else}
			<a href="/login">Log in</a>
			<a href="/signup">Sign up</a>
		{/if}
	</div>
</nav>

<style lang="scss">
	a, button {
		all: unset;

		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	}

	em {
		font-weight: bold;
	}
	
	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 2rem 4rem;
	}

	.navbar__logo {
		font-weight: bold;
	}

	.navbar__links {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 2rem;
	}

	a.outline {
		outline: 2px solid black;
		outline-offset: 8px;
		border-radius: 5px;
	}
</style>