<script lang="ts">
  	import type IMessage from "$lib/models/Message.model";
  	import Katex from "./Katex.svelte";

	export let message: IMessage;
	export let userId: string
	export let collapseName = false;
</script>

<div class="message"
	class:align-left={message.senderId === userId}
	class:align-right={message.senderId !== userId}
>
	{#if !collapseName}
		<h3>{message.senderName}</h3>
	{/if}
	{#if message.latex}
		<p><Katex math={message.text}/></p>
	{:else}
		<p>{message.text}</p>
	{/if}
</div>

<style lang="scss">
	.message {
		display: flex;
		flex-direction: column;
	}

	.message h3 {
		font-weight: bold;
		margin-top: 0.5rem;
	}

	.align-left {
		align-items: self-end;
	}

	.align-right {
		align-items: self-start;
	}
</style>