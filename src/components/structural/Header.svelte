<script>
	export const name = 'Ilavarasan';
	const summaryLines = [
		'Collaborative computer science engineering student with hands-on experience in cloud computing, open-source development, and mobile app development. Enthusiastic about emerging technologies and AI advancements.'
	];
</script>

<style>
	#header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		text-align: center;
		margin-bottom: var(--vertical-space-between-sections);
	}

	#my-name {
		text-transform: uppercase;
		color: #000000ca;
		/* color: var(--accent-color); */
		/* font-family: var(--accent-font); */
		font-size: 3em;
		/* font-family: 'Lora', serif; */
		margin: 0;
	}

	.summary {
		width: 78%;
		margin-top: 5px;
		font-size: 1.05em;
		/* font-weight: 300; */
		font-family: var(--accent-font);
		line-height: 1.5em;
		color: #000;
	}
</style>

<div id="header">
	<h1 id="my-name">{name}</h1>
	<div class="summary">
		{#each summaryLines as line, i}
			<div class="summary-line-{i}">
				{@html line}
			</div>
		{/each}
	</div>
</div>
