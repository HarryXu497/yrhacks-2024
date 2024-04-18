<script lang="ts">
	
	export let usernameField = false;
	export let error: string | null = null;
</script>

<form class="form" on:submit|preventDefault>
	<slot>
	</slot>

	{#if error}
		<div class="form-error">
			{error}
		</div>
	{/if}

	<div class="button-group" class:top-padding={!error}>
		<slot name="main-button"></slot>
		<slot name="secondary-button"></slot>
	</div>
</form>

<style lang="scss">
	.form {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		font-size: 1.25rem;
	}

	.form-error {
		color: hsl(0, 100%, 40%);
		text-align: center;
	}

	.button-group {
		display: flex;
		flex-direction: row;
		gap: 1rem;

		> * {
			flex-grow: 1;
		}
	}

	.top-padding {
		padding-top: 1rem;
	}
</style>