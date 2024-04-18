<script lang="ts">
  	import type IMessage from "$lib/models/Message.model";
  	import Message from "./Message.svelte";

	export let messages: IMessage[];
	export let userId: string;

	export let text = "";
	let outlined = true;

</script>

<section class="chat">
	<ul class="message-list">
		{#each messages as message, i}
		<li>
			{#if i > 1}
				{@const prev = messages[i - 1].senderId === message.senderId}
				<Message message={message} userId={userId} collapseName={prev}/>
			{:else}
				<Message message={message} userId={userId}/>
			{/if}
		</li>
		{/each}
	</ul>
	<form class="input-form" on:submit|preventDefault>
		<input type="text" bind:value={text}>
		<button type="reset"
			on:mouseenter={() => outlined = false}
			on:mouseleave={() => outlined = true}
		>
			{#if outlined}
				<i class="ri-send-plane-2-line"></i>
			{:else}
				<i class="ri-send-plane-2-fill"></i>
			{/if}
		</button>
	</form>
</section>

<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.message-list {
		flex-grow: 1;
	}

	.input-form {
		display: flex;
		flex-direction: row;
		
		border: 2px solid black;
		border-radius: 8px;
		font-size: 1.125rem;

		&:focus-within {
			outline: 1px solid black;
		}
	}
	
	.input-form input {
		all: unset;
		flex-grow: 1;
		padding: 0.5rem;
	}

	.input-form button {
		all: unset;
		padding: 0 0.75rem;
		font-size: 1.25rem;

		&:hover {
			cursor: pointer;
		}
	}
</style>
