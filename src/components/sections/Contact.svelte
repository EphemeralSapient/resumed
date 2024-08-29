<script>
	import ContactItem from '../items/ContactItem.svelte';
	export let details;
</script>

<style>
	#contact-section {
		padding: 16px;
		border: 0px solid #ccc;
		border-radius: 8px;
		/* box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2); */
	}

	.contact-subsection {
		margin-bottom: 20px;
	}

	.contact-subhead {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1em;
		/* font-weight: 600; */
		text-transform: uppercase;
		color: #2c3e50;
		margin-bottom: 8px;
	}

	.contact-items {
		margin: 8px 0 0 12px;
	}

	/* Style the ContactItem component */
	.contact-item {
		margin-bottom: 8px;
		
	}


</style>

<div id="contact-section">
	{#each details as { subcategory, contactDetails }}
		<div class="contact-subsection">
			{#if subcategory}
				<div class="contact-subhead">{subcategory}</div>
			{/if}
			<div class="contact-items">
				{#each contactDetails as detail}
					<ContactItem {detail} class="contact-item" />
				{/each}
			</div>
		</div>
	{/each}
</div>
