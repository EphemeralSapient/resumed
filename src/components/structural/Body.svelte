<script>
	import MainColumn from './MainColumn.svelte';
	import SideColumn from './SideColumn.svelte';

	export const sideColumn = [
		{
			type: 'contact',
			label: 'Contact',
			details: [
				{
					subcategory: '',
					contactDetails: [
						{
							isLink: true,
							type: 'email',
							text: 'ilavarasans@protonmail.com',
							icon: 'email',
						},
						{
							isLink: true,
							type: 'phone',
							text: '9080494637',
							icon: 'phone',
						},
						{
							text: 'Coimbatore, Tamil Nadu',
							icon: 'location',
						},
					],
				},
				{
					subcategory: '',
					contactDetails: [
						{
							isLink: true,
							type: 'web',
							url: 'https://github.com/EphemeralSapient/',
							text: 'EphemeralSapient',
							icon: 'github',
						},
						{
							isLink: true,
							type: 'web',
							url: 'https://www.linkedin.com/in/ilavarasan-sampath-789372269',
							text: 'Ilavarasan Sampath',
							icon: 'linkedin',
						},
					],
				},
			],
		},
		{
			type: 'skills',
			label: 'Skills',
			details: [
				["https://img.icons8.com/color/48/flutter.png","Flutter"],
				["https://img.icons8.com/plasticine/100/react.png","React"],
				["https://img.icons8.com/color/48/python--v1.png", "Python"],
				["https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/external-rust-is-a-multi-paradigm-system-programming-language-logo-bold-tal-revivo.png", "Rust"],
				["https://img.icons8.com/color/48/linux--v1.png","Linux"],
				["https://img.icons8.com/fluency/48/azure-1.png", "Azure"],
				["https://img.icons8.com/external-those-icons-flat-those-icons/24/external-MySQL-programming-and-development-those-icons-flat-those-icons.png", "MySQL"],
				["https://img.icons8.com/color/48/mongo-db.png","MongoDB"]
				
			],
		},
		{
			type: 'simple-details',
			label: 'Certifications',
			details: [
				{
					title: 'Azure Fundamentals',
					url: 'https://learn.microsoft.com/api/credentials/share/en-gb/Ilavarasan-1337/9C12269E726BF964?sharingId=C69126F94A5ADC61',
					link: 'View certification page',
					description:
						'Microsoft AZ-900: Azure Fundamentals certification.',
				},
				{
					title: 'Infosys Springboard',
					url: 'https://drive.google.com/file/d/1FgUJkFb2odlGftiJtFyf7R7YiECGk03w/view?usp=sharing',
					link: 'View certification',
					description:
						'An online course of Data Structures and Algorithms using Java.',
				},
			],
		},
	];
	export const mainColumn = [
		// {
		// 	type: 'full-details',
		// 	label: 'Education',
		// 	details: [
		// 		{
		// 			title: 'Contract Full Stack Developer',
		// 			subtitle: 'The Wally Shop',
		// 			dates: `4/2019 — ongoing`,
		// 			location: 'Remote',
		// 			description: 'Reusable packaging grocery delivery service',
		// 			list: [
		// 				'Update and add new features to customer-facing e-commerce app using React with MobX and Bootstrap.',
		// 				'Implement NodeJS API endpoints using MongoDB queries.',
		// 				'Execute miscellaneous technical projects such as auto-generating unique PDFs from a graphics file.',

		// 				// 'Implement product rating system to handle both numerical reviews and comments',
		// 				// Use React.js to add prompts and visual cues for shoppers to update product and inventory information.
		// 				// Contracted to develop tech stack focused on MongoDB, Express.js, React, Node.js.
		// 			],
		// 		},
		// 		{
		// 			title: 'Front End Developer',
		// 			subtitle: 'Sixcycle',
		// 			dates: '4/2019 — 10/2019',
		// 			location: 'Brooklyn, NY',
		// 			description: 'Endurance coaching software used by Team in Training',
		// 			list: [
		// 				'Maintained primary ownership of the front end of a React / JavaScript SaaS web app used by thousands of coaches and athletes daily.',
		// 				'Implemented new features from InVision prototypes, including message templates and public community groups.',
		// 				'Improved stability through bug fixes and refactoring to reduce tech debt.',
		// 			],
		// 		},
		// 		{
		// 			title: 'Math Fellow, Americorps',
		// 			subtitle: 'Denver Public Schools',
		// 			dates: '2017 — 2018',
		// 			location: 'Denver, CO',
		// 			description: 'Middle school math intervention program',
		// 			list: [
		// 				'Improved academic outcomes for a diverse student population by creating and teaching lesson plans that included original worksheets and activities.',
		// 				'Developed a positive motivation system to encourage on-task behavior, teamwork, and delaying of rewards.',
		// 				'Launched and led HTML coding enrichment class with Galvanize students.',
		// 				// • Taught small-group 6th grade math intervention, writing and delivering original lessons.
		// 				// • Managed behavior and relationships with a positive motivation system, restorative conversations, and supplemental tutoring.
		// 				// • Facilitated an elective with Galvanize where students learned HTML and built websites (deployed and hosted by Galvanize).
		// 			],
		// 		},
		// 		{
		// 			title: 'Technical Writer',
		// 			subtitle: 'KBC Advanced Technologies',
		// 			dates: '2014 — 2015',
		// 			location: 'Denver, CO',
		// 			description: 'Oil refinery operations manuals',
		// 			list: [
		// 				'Produced high quality training manuals that included written content and Visio drawings, synthesizing information from various sources.',
		// 			],
		// 		},

		// 		// Linkedin

		// 			// 'Produced high quality training manuals for oil refinery operations to communicate how materials move through complex systems.',
		// 			// 'Wrote clear, concise content with information compiled from client documents, photos, and detailed flow diagrams.'
		// 			// 'Created Visio drawings of condensed stream and equipment information to assist with visual understanding.',

		// 		// Honeybee Robotics, New York, NY
		// 		// Operations Associate, 2012–2013
		// 		// • Controlled project document streams and managed all incoming bills, serving as the main point of contact for vendors.
		// 		// • Created a macro in Excel VBA to automate entry and processing of expense data.
		// 		// • Updated and expanded company website and blog using Joomla!
		// 	],
		// },
		{
			type: 'full-details',
			label: 'Education',
			details: [
				{
					title: 'B.E. Computer Science and Engineering',
					subtitle: 'Dr. N.G.P. Institute of Technology',
					dates: '2021—2025',
					description: 'CGPA: 8.1 [until 6th semester]',
					location: 'Kalapatti',
				},
				{title:" ",subtitle:" "},
				{
					title: 'Higher Secondary School',
					subtitle: 'Perks Matriculation Higher Secondary School',
					description: 'Percentage: 78%',
					dates: '2020 — 2021',
					location: 'Singanallur',
				},
			],
		},
		{
			type: 'full-details',
			label: 'Projects',
			details: [
				{
					title: 'Project Prism',
					subtitle: '',
					icon: "fab fa-github",
					dates: 'Github',
					description: 'A modular and comprehensive application [Flutter, React]',
					list: [
						"Smart attendance system using face recognition",
						"Education management system for students and teachers",
						"Supports both on-premises and cloud deployment",
						"Intuitive UI/UX design by web and mobile application support",
					]
				},
				{
					title: "Mini Projects",
					subtitle: "",
					icon: "fab fa-github",
					dates: "Github",
					description: "Various mini projects for learning and exploring new technologies",
					list: [
						"Score board controller using UART communication - Flutter",
						"Pastebin alike app with Tonic[Rust] and React - semp.myftp.org/txts",
						"Gemini and ChatGPT API integration on communication platform - Nodejs",
					]
				}
				// {title:" ",subtitle:" "},
				// {
				// 	title: 'UART Scoreboard Controller',
				// 	subtitle: '',
				// 	description: 'It is android specific application made for controlling the scoreboard using UART communication devices such as, HC-05.',
				// 	dates: 'Github',
				// 	list: [
				// 		"Control the scoreboard using bluetooth [HC-05]",
				// 		"Sleek UI/UX design with login menu",
				// 		"Provides set of game mode templates",
				// 		"Supports both rotation and different themes",
				// 		"Easily customizable and add new game modes",
				// 	]
				// },
			],
		},
		{
			type: 'simple-details',
			label: 'Internship',
			details: [
				{
					title: "Zoho Corporation",
					url: "https://drive.google.com/file/d/1Jv26DPK8yOZXYTMeDG_p96y53iPtxlLe/view?usp=sharing",
					link: "Summer Intern [Feb 2024 - April 2024]",
					description : "Worked on the few projects for Zoho Cliq Extension integrations.",
				},	
				// {
				// 	title: 'Teknozura 2k23',
				// 	url: 'https://drive.google.com/file/d/1tneurbWzscqCw3Nf7DvBeooDcSjX_Ehf/view?usp=sharing',
				// 	link: '24 Hour Hackathon',
				// 	description:
				// 		'Secured 1st place in 24 Hour Hackathon event organized by IEEE Student Branch.',
				// },
			],
			},
	];
</script>

<style>
	div {
		display: flex;
		justify-content: space-between;
		flex-direction: var(--column-order);
		margin: 0 var(--horizontal-offset);
	}
</style>

<div class="main-body">
	<MainColumn sections={mainColumn} />
	<SideColumn sections={sideColumn} />
	<!-- <div class="main-body">
		<MainColumn sections={mainColumn} />
	</div> -->
</div>
