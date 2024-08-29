<script>
	import FullDetail from '../items/FullDetail.svelte';
	export let details;
</script>
<style>
	.ok {
		/* box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2); */
		padding: 15px;
	}
</style>
<div class="ok">
	{#each details as { title, subtitle, link, dates, location,icon, description, list }}
		<FullDetail {title} {subtitle} {link} {icon} {dates} {location} {description} {list} />
	{/each}
</div>
