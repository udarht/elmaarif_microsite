<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
</svelte:head>

{#if children}
	{@render children()}
{/if}
