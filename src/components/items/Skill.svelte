<script>
	export let skillName;
    export let skillImage;
</script>

<style>
.skill {
    width: fit-content;
    padding: 8px 12px;
    border-radius: 5px;
    margin: 1px;
    font-size: 1.1em;
    font-weight: 300;
    font-family: "Roboto", sans-serif;

    /* Center alignment */
    display: flex;
    align-items: center; /* Vertical alignment */
    justify-content: center; /* Horizontal alignment */
}

img { /* Optional: Add some spacing around the image */
    margin-right: 10px; /* Adjust the value as needed */
}

</style>
<div class="skill"><img width="20" height="20" src={skillImage} alt=""/>  {skillName}</div>
