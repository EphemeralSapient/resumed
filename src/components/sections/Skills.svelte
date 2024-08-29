<script>
	import Skill from '../items/Skill.svelte';
	export let details;
</script>

<style>
	#skills-section {
		display: flex;
		justify-content: var(--more-centered);
		flex-wrap: wrap;
		/* border: 0px solid #ccc;
		border-radius: 0px; */
		/* box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2); */
		padding: 16px;
		margin: 0 -5px;
	}
</style>

<div id="skills-section">
	{#each details as skill}
		<Skill skillImage={skill[0]} skillName={skill[1]} />
	{/each}
</div>
