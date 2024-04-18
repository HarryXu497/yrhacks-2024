<script lang="ts">
  	import type IMessage from "$lib/models/Message.model";

	export let message: IMessage;
	export let userId: string
	export let collapseName = false;
</script>

<div class="message"
	class:align-right={message.senderId === userId}
	class:align-left={message.senderId !== userId}
>
	{#if !collapseName}
		<h3>{message.senderName}</h3>
	{/if}
	<p>{message.text}</p>
</div>

<style lang="scss">
	.message {
		display: flex;
		flex-direction: column;
	}

	.message h3 {
		font-weight: bold;
	}

	.align-left {
		align-items: self-end;
	}

	.align-right {
		align-items: self-start;
	}
</style>