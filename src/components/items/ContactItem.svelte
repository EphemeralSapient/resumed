<script>
	export let detail;
	let { isLink, type, text, url, icon } = detail;
	let defaultIcon = 'fa fa-link';
	const fontAwesomeIconMap = {
		location: 'fa fa-map-marker-alt',
		email: 'fa fa-envelope',
		phone: 'fa fa-phone-alt',
		github: 'fab fa-github',
		linkedin: 'fab fa-linkedin-in',
		blog: 'fa fa-pencil-alt',
	};
	let linkIcon = fontAwesomeIconMap[icon] || defaultIcon;
</script>

<style>
	.contact-item i {
		width: 20px;
		padding-right: 5px;
		font-size: 0.9rem;
		text-align: center;
		padding-bottom: 11px;
	}

	.full-detail .contact-item i {
		padding-right: 2px; /*	less padding for experience map marker */
	}

	.simple-detail .contact-item {
		margin-top: 5px;
	}
</style>

<div class="contact-item">
	<i class={linkIcon} />
	{#if isLink}
		{#if type === 'email'}
			<a href="mailto:{text}">{text}</a> 
		{:else if type === 'phone'}
			<a href="tel:{text}">{text}</a>
		{:else if url}
			<a href="http://{url}">{text}</a>
		{:else}
			<a href="http://{text}">{text}</a>
		{/if}
	<!-- svelte-ignore a11y-missing-attribute -->
	{:else}<a>{text}</a>{/if}
</div>
