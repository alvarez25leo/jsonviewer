const sampleJson = Object.freeze({
	provider: {
		name: "Netflix",
		type: "Streaming",
		established: 1997,
		headquarters: "Los Gatos, California",
		popular: true,
	},
	categories: [
		{
			genre: "Drama",
			films: [
				{
					title: "The Irishman",
					releaseYear: 2019,
					director: {
						name: "Martin Scorsese",
						awards: ["Academy Award", "Golden Globe"],
					},
					cast: [
						{
							actorName: "Robert De Niro",
							role: "Frank Sheeran",
							nominated: true,
						},
						{
							actorName: "Al Pacino",
							role: "Jimmy Hoffa",
							nominated: true,
						},
					],
				},
				{
					title: "Marriage Story",
					releaseYear: 2019,
					director: {
						name: "Noah Baumbach",
						awards: ["Academy Nominee"],
					},
					cast: [
						{
							actorName: "Scarlett Johansson",
							role: "Nicole Barber",
							nominated: true,
						},
						{
							actorName: "Adam Driver",
							role: "Charlie Barber",
							nominated: true,
						},
					],
				},
			],
		},
		{
			genre: "Action",
			films: [
				{
					title: "Extraction",
					releaseYear: 2020,
					director: {
						name: "Sam Hargrave",
						awards: [],
					},
					cast: [
						{
							actorName: "Chris Hemsworth",
							role: "Tyler Rake",
							nominated: false,
						},
					],
				},
				{
					title: "6 Underground",
					releaseYear: 2019,
					director: {
						name: "Michael Bay",
						awards: [],
					},
					cast: [
						{
							actorName: "Ryan Reynolds",
							role: "One",
							nominated: false,
						},
					],
				},
			],
		},
	],
})

export const defaultJson = JSON.stringify(sampleJson, null, 2)
