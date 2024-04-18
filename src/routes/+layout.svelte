<script lang="ts">
	import "../styles/app.scss";
	import "remixicon/fonts/remixicon.css";

  	import { onMount } from "svelte";
  	import { auth } from "$lib/firebase";
  	import { authStore } from "$lib/stores/authStore";
  	import { browser } from "$app/environment";
  	import { goto } from "$app/navigation";

	const AUTHENTICATED_ROUTES = [
		"/search",
		"/room"
	]
	
	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.update(curr => ({
				...curr,
				currentUser: user,
			}))
			
			if (browser && AUTHENTICATED_ROUTES.some(route => window.location.pathname.startsWith(route)) && !$authStore.currentUser) {
				goto("/login");
			}
		});
	
		return unsubscribe;
	})
</script>

<slot/>