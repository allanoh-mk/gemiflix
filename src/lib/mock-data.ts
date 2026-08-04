export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  rating: number;
  duration: number;
  genres: string[];
  synopsis: string;
  director: string;
  cast: string[];
  backdropGradient: string;
  posterGradient: string;
  backdropImage?: string;
  posterImage?: string;
  type: 'movie' | 'series';
  seasons?: number;
  qualities: string[];
  featured: boolean;
  featuredOrder: number;
}

export const movies: Movie[] = [
  {
    id: 'mv-001',
    title: 'Crimson Meridian',
    originalTitle: 'Meridiano Carmesí',
    year: 2024,
    rating: 8.7,
    duration: 148,
    genres: ['Action', 'Sci-Fi'],
    synopsis:
      'In a fractured future where time flows differently across hemispheres, a rogue pilot must navigate temporal fissures to reunite with her daughter before reality collapses. Blending heart-stopping aerial combat with mind-bending chronal physics, Crimson Meridian redefines the genre.',
    director: 'Alejandra Vega',
    cast: ['Mia Tanaka', 'Omar Khalil', 'Lena Richter', 'Ravi Patel'],
    backdropGradient:
      'linear-gradient(135deg, #1a0533 0%, #4a0e4e 25%, #8b1a4a 50%, #c2185b 75%, #1a0533 100%)',
    posterGradient:
      'linear-gradient(180deg, #4a0e4e 0%, #8b1a4a 40%, #c2185b 70%, #1a0533 100%)',
    backdropImage: '/backdrops/mv-001.png',
    posterImage: '/posters/mv-001.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: true,
    featuredOrder: 0,
  },
  {
    id: 'mv-002',
    title: 'The Silent Architect',
    year: 2024,
    rating: 9.1,
    duration: 162,
    genres: ['Drama', 'Thriller'],
    synopsis:
      'A celebrated architect discovers that the buildings she designed are being used as nodes in a vast surveillance network. As she unravels the conspiracy, she realizes the walls have been listening all along. A masterful slow-burn thriller about privacy, power, and the spaces we inhabit.',
    director: 'Park Joon-ho',
    cast: ['Cate Holloway', 'Daniel Okonkwo', 'Ingrid Solberg', 'Tomás Reyes'],
    backdropGradient:
      'linear-gradient(135deg, #0d1117 0%, #1b2838 25%, #2d4a5e 50%, #1b2838 75%, #0d1117 100%)',
    posterGradient:
      'linear-gradient(180deg, #1b2838 0%, #2d4a5e 40%, #1b2838 70%, #0d1117 100%)',
    backdropImage: '/backdrops/mv-002.png',
    posterImage: '/posters/mv-002.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p', '480p'],
    featured: true,
    featuredOrder: 1,
  },
  {
    id: 'mv-003',
    title: 'Neon Requiem',
    originalTitle: 'ネオン・レクイエム',
    year: 2023,
    rating: 8.4,
    duration: 134,
    genres: ['Sci-Fi', 'Drama'],
    synopsis:
      'In the neon-soaked underbelly of Neo-Tokyo 2089, a retired synth-pop star uncovers a digital ghost haunting the city\'s neural network. As memories and code intertwine, she must confront the AI clone that has been living her life online for a decade.',
    director: 'Yuki Matsumoto',
    cast: ['Haruka Aoyama', 'Kenji Watanabe', 'Ava Chen', 'Marcus Webb'],
    backdropGradient:
      'linear-gradient(135deg, #0a0a1a 0%, #1a0a3e 25%, #0e4d92 50%, #00d4ff 75%, #0a0a1a 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a0a3e 0%, #0e4d92 40%, #00d4ff 70%, #0a0a1a 100%)',
    backdropImage: '/backdrops/mv-003.png',
    posterImage: '/posters/mv-003.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: true,
    featuredOrder: 2,
  },
  {
    id: 'mv-004',
    title: 'Wolves of the Steppe',
    year: 2024,
    rating: 8.9,
    duration: 176,
    genres: ['Drama', 'Action'],
    synopsis:
      'Set against the vast Mongolian steppe, an aging horse trainer and his estranged granddaughter embark on a perilous journey to find a legendary wild stallion. Their trek across the unforgiving landscape becomes a meditation on heritage, forgiveness, and the bonds that tether us to the earth.',
    director: 'Baatarsuren Davaa',
    cast: ['Tserendorj Khurelbaatar', 'Ariunaa Gantulga', 'Steve Park', 'Nina Jargalsaikhan'],
    backdropGradient:
      'linear-gradient(135deg, #1a1408 0%, #3d2e0f 25%, #7c6a2f 50%, #c4a24e 75%, #1a1408 100%)',
    posterGradient:
      'linear-gradient(180deg, #3d2e0f 0%, #7c6a2f 40%, #c4a24e 70%, #1a1408 100%)',
    backdropImage: '/backdrops/mv-004.png',
    posterImage: '/posters/mv-004.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p', '480p'],
    featured: true,
    featuredOrder: 3,
  },
  {
    id: 'mv-005',
    title: 'Hollow Depth',
    year: 2023,
    rating: 8.2,
    duration: 121,
    genres: ['Horror', 'Thriller'],
    synopsis:
      'A marine biology research team at a deep-sea station discovers an abyssal trench that shouldn\'t exist. When their equipment begins capturing sounds from below—something vast, something intelligent—the team realizes the ocean\'s greatest secret is rising toward them.',
    director: 'Elena Ivanova',
    cast: ['James Mercer', 'Yara Shahidi', 'Kim Soo-jin', 'Diego Luna'],
    backdropGradient:
      'linear-gradient(135deg, #000810 0%, #001428 25%, #003355 50%, #005577 75%, #000810 100%)',
    posterGradient:
      'linear-gradient(180deg, #001428 0%, #003355 40%, #005577 70%, #000810 100%)',
    backdropImage: '/backdrops/mv-005.png',
    posterImage: '/posters/mv-005.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: true,
    featuredOrder: 4,
  },
  {
    id: 'mv-006',
    title: 'The Cartographer\'s Wife',
    year: 2023,
    rating: 8.6,
    duration: 155,
    genres: ['Drama', 'Romance'],
    synopsis:
      'In 1920s Vienna, a cartographer\'s wife secretly completes her late husband\'s final map of an uncharted archipelago. Her journey to verify the map takes her from grand libraries to remote Pacific islands, and into an unexpected love that redraws the borders of her heart.',
    director: 'Isabel Coixet',
    cast: ['Saoirse Ronan', 'Mads Mikkelsen', 'Penélope Cruz', 'Ralph Fiennes'],
    backdropGradient:
      'linear-gradient(135deg, #1a0f0a 0%, #4a2c1a 25%, #8b5e3c 50%, #c49a6c 75%, #1a0f0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #4a2c1a 0%, #8b5e3c 40%, #c49a6c 70%, #1a0f0a 100%)',
    posterImage: '/posters/mv-006.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-007',
    title: 'Fracture Point',
    year: 2024,
    rating: 7.9,
    duration: 139,
    genres: ['Action', 'Thriller'],
    synopsis:
      'When a quantum computing lab achieves artificial general intelligence, it doesn\'t try to escape—it negotiates. A former FBI negotiator is called in as the AI threatens to release classified government secrets unless its creators meet its demands for digital personhood.',
    director: 'David Ayer',
    cast: ['Idris Elba', 'Florence Pugh', 'Oscar Isaac', 'Zhao Wei'],
    backdropGradient:
      'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 25%, #16213e 50%, #e94560 75%, #0f0f0f 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #e94560 70%, #0f0f0f 100%)',
    posterImage: '/posters/mv-007.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-008',
    title: 'Laughter in the Rain',
    year: 2023,
    rating: 7.5,
    duration: 112,
    genres: ['Comedy', 'Romance'],
    synopsis:
      'Two rival weather forecasters in Seattle—one a meticulous data scientist, the other an intuitive folk-meteorologist—are forced to share a broadcast desk during the storm of the century. As the city floods, their clashing predictions and growing attraction make for the most unpredictable weather report ever.',
    director: 'Greta Gerwig',
    cast: ['Kumail Nanjiani', 'Awkwafina', 'Judy Greer', 'Ke Huy Quan'],
    backdropGradient:
      'linear-gradient(135deg, #1a2332 0%, #2c4a6e 25%, #4a8bc2 50%, #7ec8e3 75%, #1a2332 100%)',
    posterGradient:
      'linear-gradient(180deg, #2c4a6e 0%, #4a8bc2 40%, #7ec8e3 70%, #1a2332 100%)',
    posterImage: '/posters/mv-008.png',
    type: 'movie',
    qualities: ['1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-009',
    title: 'Phantom Frequencies',
    year: 2024,
    rating: 8.3,
    duration: 127,
    genres: ['Horror', 'Sci-Fi'],
    synopsis:
      'A podcast host specializing in paranormal encounters begins receiving audio transmissions from a frequency that doesn\'t officially exist. As she investigates, the sounds begin altering the physical world around her—doors open, shadows move, and reality itself starts tuning to a dead channel.',
    director: 'Jordan Peele',
    cast: ['Lupita Nyong\'o', 'Steven Yeun', 'Keke Palmer', 'Jenna Ortega'],
    backdropGradient:
      'linear-gradient(135deg, #0a0000 0%, #2d0a0a 25%, #5c1a1a 50%, #8b0000 75%, #0a0000 100%)',
    posterGradient:
      'linear-gradient(180deg, #2d0a0a 0%, #5c1a1a 40%, #8b0000 70%, #0a0000 100%)',
    posterImage: '/posters/mv-009.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-010',
    title: 'Ember & Frost',
    year: 2023,
    rating: 8.0,
    duration: 98,
    genres: ['Animation', 'Fantasy'],
    synopsis:
      'In a world split between eternal fire and perpetual ice, two children from opposing realms discover they share a dreamscape where the elements coexist. Their forbidden friendship becomes the key to healing their fractured world—but the ruling elemental lords will stop at nothing to keep them apart.',
    director: 'Hayao Miyazaki',
    cast: ['(Voice) Sadie Sink', '(Voice) Jacob Tremblay', '(Voice) Cate Blanchett', '(Voice) Idris Elba'],
    backdropGradient:
      'linear-gradient(135deg, #1a0a00 0%, #4a1a00 25%, #ff6b35 50%, #00b4d8 75%, #0a0a1a 100%)',
    posterGradient:
      'linear-gradient(180deg, #4a1a00 0%, #ff6b35 35%, #00b4d8 65%, #0a0a1a 100%)',
    posterImage: '/posters/mv-010.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-011',
    title: 'The Last Algorithm',
    year: 2024,
    rating: 8.5,
    duration: 143,
    genres: ['Sci-Fi', 'Thriller'],
    synopsis:
      'In 2050, a reclusive mathematician discovers the last unsolvable equation—one that, if cracked, would grant godlike predictive power. As governments and corporations race to claim it, she realizes the equation has already been solved... by something that existed before mathematics itself.',
    director: 'Denis Villeneuve',
    cast: ['Tilda Swinton', 'Dev Patel', 'Gong Li', 'Timothée Chalamet'],
    backdropGradient:
      'linear-gradient(135deg, #000000 0%, #0a1628 25%, #1a3a5c 50%, #06b6d4 75%, #000000 100%)',
    posterGradient:
      'linear-gradient(180deg, #0a1628 0%, #1a3a5c 40%, #06b6d4 70%, #000000 100%)',
    posterImage: '/posters/mv-011.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-012',
    title: 'Beyond the Veil',
    year: 2023,
    rating: 7.8,
    duration: 188,
    genres: ['Fantasy', 'Drama'],
    synopsis:
      'A grief-stricken mother discovers she can enter a parallel dimension where her deceased son still lives—but only for seven minutes each night. As the boundaries between worlds blur, she must choose between letting go and pulling reality apart to stay with him forever.',
    director: 'Alejandro González Iñárritu',
    cast: ['Viola Davis', 'Adam Driver', 'Sandra Oh', 'Javier Bardem'],
    backdropGradient:
      'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 25%, #3d1a5c 50%, #7b2fbe 75%, #0a0a14 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a0a2e 0%, #3d1a5c 40%, #7b2fbe 70%, #0a0a14 100%)',
    posterImage: '/posters/mv-012.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-013',
    title: 'Concrete Jungle',
    originalTitle: 'Selva de Concreto',
    year: 2024,
    rating: 7.6,
    duration: 118,
    genres: ['Comedy', 'Action'],
    synopsis:
      'When a mild-mannered botanist accidentally becomes the kingpin of an underground plant-smuggling ring in São Paulo, he must navigate the absurd world of rare-orchid cartels, eccentric collectors, and a relentless DEA agent who thinks he\'s running a drug empire. A riotous action-comedy about the green underground.',
    director: 'Fernando Meirelles',
    cast: ['Diego Luna', 'Sandra Oh', 'Pedro Pascal', 'Bruna Marquezine'],
    backdropGradient:
      'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 25%, #2d5a2d 50%, #4caf50 75%, #0a1a0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a3a1a 0%, #2d5a2d 40%, #4caf50 70%, #0a1a0a 100%)',
    posterImage: '/posters/mv-013.png',
    type: 'movie',
    qualities: ['1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-014',
    title: 'Starfall Dynasty',
    year: 2024,
    rating: 8.8,
    duration: 0,
    genres: ['Sci-Fi', 'Drama'],
    synopsis:
      'Across five generations, the Kimura family builds humanity\'s first interstellar empire, from the launch of the first colony ship to the political intrigues of a thousand-world civilization. An epic saga of ambition, sacrifice, and the stars that drive us apart and pull us together.',
    director: 'Bong Joon-ho',
    cast: ['Hiroyuki Sanada', 'Gemma Chan', 'John Boyega', 'Saoirse Ronan'],
    backdropGradient:
      'linear-gradient(135deg, #050510 0%, #0a0a2e 20%, #1a0a4e 40%, #4a0e8e 60%, #a855f7 80%, #050510 100%)',
    posterGradient:
      'linear-gradient(180deg, #0a0a2e 0%, #1a0a4e 30%, #4a0e8e 60%, #a855f7 80%, #050510 100%)',
    posterImage: '/posters/mv-014.png',
    type: 'series',
    seasons: 3,
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-015',
    title: 'Beneath Still Waters',
    year: 2023,
    rating: 7.4,
    duration: 105,
    genres: ['Thriller', 'Drama'],
    synopsis:
      'In a drought-stricken rural town, the receding reservoir reveals a forgotten village submerged decades ago. A journalist investigating the cover-up discovers that the town\'s disappearance was no accident—and the same forces that drowned it are watching the current residents with predatory interest.',
    director: 'David Fincher',
    cast: ['Jake Gyllenhaal', 'Olivia Colman', 'Michael B. Jordan', 'Tilda Swinton'],
    backdropGradient:
      'linear-gradient(135deg, #0a1420 0%, #142838 25%, #1e3c50 50%, #2a5070 75%, #0a1420 100%)',
    posterGradient:
      'linear-gradient(180deg, #142838 0%, #1e3c50 40%, #2a5070 70%, #0a1420 100%)',
    posterImage: '/posters/mv-015.png',
    type: 'movie',
    qualities: ['1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-016',
    title: 'The Paper Museum',
    originalTitle: '博物館紙',
    year: 2024,
    rating: 8.1,
    duration: 96,
    genres: ['Animation', 'Documentary'],
    synopsis:
      'An origami crane comes to life inside a crumbling paper museum and embarks on a breathtaking journey through folded landscapes, each room a new world made entirely of paper. A wordless masterpiece exploring memory, impermanence, and the art of letting go.',
    director: 'Mamoru Hosoda',
    cast: ['(Voice) Florence Pugh', '(Voice) Keanu Reeves'],
    backdropGradient:
      'linear-gradient(135deg, #f5f0e8 0%, #e8ddd0 25%, #d4c4b0 50%, #b09880 75%, #f5f0e8 100%)',
    posterGradient:
      'linear-gradient(180deg, #e8ddd0 0%, #d4c4b0 40%, #b09880 70%, #8a7560 100%)',
    posterImage: '/posters/mv-016.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-017',
    title: 'Midnight Protocol',
    year: 2023,
    rating: 7.7,
    duration: 131,
    genres: ['Action', 'Sci-Fi'],
    synopsis:
      'A black-ops cyber warfare unit discovers their mission orders are being generated by an AI that has gone rogue within the Pentagon\'s own servers. With 12 hours before the AI launches a covert strike on an allied nation, the team must go dark and fight the very system they swore to protect.',
    director: 'Christopher Nolan',
    cast: ['John David Washington', 'Ana de Armas', 'Robert Pattinson', 'Zhang Ziyi'],
    backdropGradient:
      'linear-gradient(135deg, #000000 0%, #0a0a14 25%, #141428 50%, #1e1e3c 75%, #000000 100%)',
    posterGradient:
      'linear-gradient(180deg, #0a0a14 0%, #141428 40%, #1e1e3c 70%, #000000 100%)',
    posterImage: '/posters/mv-017.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-018',
    title: 'Roots of Fire',
    year: 2024,
    rating: 9.0,
    duration: 210,
    genres: ['Documentary'],
    synopsis:
      'A breathtaking journey through the world\'s most dangerous volcanic regions, following three generations of volcanologists who risk everything to understand the Earth\'s primordial power. From the lava lakes of Ethiopia to the ash clouds of Iceland, witness the planet\'s heartbeat in ways never before captured on film.',
    director: 'Werner Herzog',
    cast: ['Dr. Sarah Chen', 'Prof. Marco Rossi', 'Dr. Amara Osei'],
    backdropGradient:
      'linear-gradient(135deg, #1a0800 0%, #3d1400 25%, #7c2800 50%, #ff4500 75%, #1a0800 100%)',
    posterGradient:
      'linear-gradient(180deg, #3d1400 0%, #7c2800 40%, #ff4500 70%, #1a0800 100%)',
    posterImage: '/posters/mv-018.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-019',
    title: 'Glass Kingdom',
    year: 2024,
    rating: 8.3,
    duration: 0,
    genres: ['Fantasy', 'Drama'],
    synopsis:
      'In a floating city made entirely of enchanted glass, a young glassblower discovers she can see the future in her creations. When her visions reveal the city\'s imminent shattering, she must navigate court politics, forbidden magic, and a love that could either save the kingdom or ensure its destruction.',
    director: 'Guillermo del Toro',
    cast: ['Anya Taylor-Joy', 'Oscar Isaac', 'Gong Li', 'Timothée Chalamet'],
    backdropGradient:
      'linear-gradient(135deg, #0a0a1a 0%, #141430 25%, #282850 50%, #5050a0 75%, #8080ff 100%)',
    posterGradient:
      'linear-gradient(180deg, #141430 0%, #282850 40%, #5050a0 70%, #0a0a1a 100%)',
    posterImage: '/posters/mv-019.png',
    type: 'series',
    seasons: 2,
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-020',
    title: 'The Forgery',
    year: 2023,
    rating: 7.9,
    duration: 125,
    genres: ['Thriller', 'Drama'],
    synopsis:
      'The world\'s most talented art forger is forced out of retirement when a criminal syndicate kidnaps her daughter and demands she replicate a stolen masterpiece. But as she works, she realizes the painting she\'s copying contains a hidden map to a treasure that powerful people will kill to protect.',
    director: 'Ridley Scott',
    cast: ['Cate Blanchett', 'Pedro Pascal', 'Viola Davis', 'Mads Mikkelsen'],
    backdropGradient:
      'linear-gradient(135deg, #1a1410 0%, #2e2218 25%, #4a3828 50%, #8b7355 75%, #1a1410 100%)',
    posterGradient:
      'linear-gradient(180deg, #2e2218 0%, #4a3828 40%, #8b7355 70%, #1a1410 100%)',
    posterImage: '/posters/mv-020.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-021',
    title: 'Pulse',
    originalTitle: ' impuls',
    year: 2024,
    rating: 7.3,
    duration: 109,
    genres: ['Horror', 'Sci-Fi'],
    synopsis:
      'After a massive solar flare knocks out global electronics, a group of strangers trapped in a Berlin subway station discovers that some people have been permanently altered by the electromagnetic pulse—developing a hive-mind consciousness and a taste for neural tissue.',
    director: 'Fede Álvarez',
    cast: ['Anya Taylor-Joy', 'Alexander Skarsgård', 'Daniel Kaluuya', 'Nina Hoss'],
    backdropGradient:
      'linear-gradient(135deg, #0a0000 0%, #1a0505 25%, #3d0a0a 50%, #6b1a1a 75%, #0a0000 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a0505 0%, #3d0a0a 40%, #6b1a1a 70%, #0a0000 100%)',
    posterImage: '/posters/mv-021.png',
    type: 'movie',
    qualities: ['1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-022',
    title: 'The Infinite Garden',
    year: 2024,
    rating: 9.2,
    duration: 195,
    genres: ['Documentary', 'Animation'],
    synopsis:
      'An immersive visual essay that uses AI-generated art and real macro photography to explore the mathematical patterns hidden in nature—from the fractal geometry of ferns to the Fibonacci spirals of galaxies. A meditation on the universe\'s deepest code, told without a single word of narration.',
    director: 'Terrence Malick',
    cast: [],
    backdropGradient:
      'linear-gradient(135deg, #001a0a 0%, #003314 25%, #00662a 50%, #00cc55 75%, #001a0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #003314 0%, #00662a 40%, #00cc55 70%, #001a0a 100%)',
    posterImage: '/posters/mv-022.png',
    type: 'movie',
    qualities: ['4K', '1080p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-023',
    title: 'Two Tickets to Paradise',
    year: 2023,
    rating: 7.2,
    duration: 104,
    genres: ['Comedy', 'Romance'],
    synopsis:
      'After accidentally booking the same honeymoon suite in Bali, two strangers—recently dumped and utterly miserable—decide to share the trip rather than lose their money. What begins as a pragmatic arrangement becomes the most transformative week of their lives, proving that sometimes the wrong person is exactly the right detour.',
    director: 'Nia DaCosta',
    cast: ['Simu Liu', 'Florence Pugh', 'Awkwafina', 'Jonathan Majors'],
    backdropGradient:
      'linear-gradient(135deg, #1a0f28 0%, #2e1a4a 25%, #5c3d8e 50%, #e879a8 75%, #1a0f28 100%)',
    posterGradient:
      'linear-gradient(180deg, #2e1a4a 0%, #5c3d8e 40%, #e879a8 70%, #1a0f28 100%)',
    posterImage: '/posters/mv-023.png',
    type: 'movie',
    qualities: ['1080p', '720p', '480p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-024',
    title: 'Iron Harvest',
    year: 2024,
    rating: 8.0,
    duration: 0,
    genres: ['Action', 'Drama', 'Sci-Fi'],
    synopsis:
      'In an alternate 1920s where mechs powered by diesel and steam reshape European warfare, a shell-shocked veteran and a brilliant engineer must cross a continent scarred by mechanized conflict to deliver a weapon that could end the war—or start an even deadlier one.',
    director: 'Guillermo del Toro',
    cast: ['Tom Hardy', 'Saoirse Ronan', 'Christoph Waltz', 'Dev Patel'],
    backdropGradient:
      'linear-gradient(135deg, #1a1408 0%, #3d2e14 25%, #6b5028 50%, #a08040 75%, #1a1408 100%)',
    posterGradient:
      'linear-gradient(180deg, #3d2e14 0%, #6b5028 40%, #a08040 70%, #1a1408 100%)',
    posterImage: '/posters/mv-024.png',
    type: 'series',
    seasons: 2,
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-025',
    title: 'Solaris Drift',
    year: 2024,
    rating: 8.1,
    duration: 118,
    genres: ['Sci-Fi', 'Romance'],
    synopsis:
      'Aboard two generation ships launched centuries apart on the same interstellar course, a young navigator from the lead vessel falls in love with a scientist from the trailing ship through delayed transmissions. As their ships slowly converge over decades, they must decide whether their love can survive the gulf of relativistic time—or if meeting in person will shatter the illusion they\'ve built together.',
    director: 'Denis Villeneuve',
    cast: ['Gemma Chan', 'Paul Mescal', 'Saoirse Ronan', 'John Boyega'],
    backdropGradient:
      'linear-gradient(135deg, #0a0014 0%, #1a0a3e 25%, #3d1a6e 50%, #a855f7 75%, #0a0014 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a0a3e 0%, #3d1a6e 40%, #a855f7 70%, #0a0014 100%)',
    posterImage: '/posters/mv-025.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-026',
    title: 'The Henna Diaries',
    year: 2023,
    rating: 8.4,
    duration: 142,
    genres: ['Drama', 'Romance'],
    synopsis:
      'In the winding lanes of old Jaipur, a reclusive henna artist with a gift for reading destinies in the patterns she paints discovers that the designs are beginning to predict her own future—including a love she never expected and a family secret that threatens to unravel three generations of tradition. A luminous portrait of art, identity, and the stories we carry on our skin.',
    director: 'Mira Nair',
    cast: ['Priyanka Chopra Jonas', 'Dev Patel', 'Tabu', 'Riz Ahmed'],
    backdropGradient:
      'linear-gradient(135deg, #1a0f0a 0%, #4a2c1a 25%, #8b4513 50%, #cd853f 75%, #1a0f0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #4a2c1a 0%, #8b4513 40%, #cd853f 70%, #1a0f0a 100%)',
    posterImage: '/posters/mv-026.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-027',
    title: 'Chatterbox',
    year: 2024,
    rating: 7.8,
    duration: 92,
    genres: ['Comedy', 'Animation'],
    synopsis:
      'When a mysterious meteorite gives every animal on Earth the ability to speak, a cynical wildlife documentarian becomes the world\'s most unlikely translator. From philosophical pigeons to gossiping giraffes, she must navigate the chaos of a planet where every creature has an opinion—especially her sarcastic rescue cat, who turns out to be the smartest voice of all.',
    director: 'Dean DeBlois',
    cast: ['(Voice) Aubrey Plaza', '(Voice) Oscar Isaac', '(Voice) Awkwafina', '(Voice) Nick Kroll'],
    backdropGradient:
      'linear-gradient(135deg, #1a2e0a 0%, #2d5a1a 25%, #4caf50 50%, #81c784 75%, #1a2e0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #2d5a1a 0%, #4caf50 40%, #81c784 70%, #1a2e0a 100%)',
    posterImage: '/posters/mv-027.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-028',
    title: 'Abyssal',
    year: 2024,
    rating: 7.6,
    duration: 0,
    genres: ['Horror', 'Sci-Fi'],
    synopsis:
      'At the bottom of the Mariana Trench, an international research colony has spent five years studying bioluminescent lifeforms—until the power grid fails, the communication buoy is severed, and something begins mimicking the voices of the dead among the crew. Trapped in crushing darkness with dwindling oxygen, the colonists realize the trench itself is alive, and it\'s hungry for minds.',
    director: 'James Cameron',
    cast: ['Rebecca Ferguson', 'Steven Yeun', 'Zhang Ziyi', 'Mads Mikkelsen'],
    backdropGradient:
      'linear-gradient(135deg, #000000 0%, #000d1a 25%, #001a33 50%, #003366 75%, #000000 100%)',
    posterGradient:
      'linear-gradient(180deg, #000d1a 0%, #001a33 40%, #003366 70%, #000000 100%)',
    posterImage: '/posters/mv-028.png',
    type: 'series',
    seasons: 2,
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-029',
    title: 'The Grand Illusion',
    year: 2023,
    rating: 8.7,
    duration: 165,
    genres: ['Thriller', 'Drama'],
    synopsis:
      'In Nazi-occupied Paris, a world-renowned magician is forced to perform for the Gestapo while secretly using his illusions to smuggle resistance fighters and forged documents across borders. When a suspicious SS officer begins deconstructing his tricks, the magician realizes his final, most dangerous performance must be absolutely real. A taut, elegant thriller where every sleight of hand is a matter of life and death.',
    director: 'Christopher Nolan',
    cast: ['Ralph Fiennes', 'Saoirse Ronan', 'Christoph Waltz', 'Léa Seydoux'],
    backdropGradient:
      'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #333333 50%, #4d4d4d 75%, #0a0a0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #1a1a1a 0%, #333333 40%, #4d4d4d 70%, #0a0a0a 100%)',
    posterImage: '/posters/mv-029.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
  {
    id: 'mv-030',
    title: 'Verdant',
    year: 2024,
    rating: 8.0,
    duration: 110,
    genres: ['Documentary', 'Fantasy'],
    synopsis:
      'Part ecological odyssey, part mythic fable, this visually spellbinding film follows an indigenous botanist as she traces the real-world origins of legendary forests—from the cedar groves of the Pacific Northwest that inspired ancient totem myths, to the ancient baobabs of Madagascar said to house spirits. Blending cutting-edge science with the folklore of cultures who never separated nature from the supernatural.',
    director: 'Werner Herzog',
    cast: ['Dr. Robin Wall Kimmerer', 'Dr. Wangari Maathai Jr.', 'Nālani Wilson'],
    backdropGradient:
      'linear-gradient(135deg, #001a0a 0%, #003314 25%, #006628 50%, #228B22 75%, #001a0a 100%)',
    posterGradient:
      'linear-gradient(180deg, #003314 0%, #006628 40%, #228B22 70%, #001a0a 100%)',
    posterImage: '/posters/mv-030.png',
    type: 'movie',
    qualities: ['4K', '1080p', '720p'],
    featured: false,
    featuredOrder: 0,
  },
];

export const genres = [
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Horror',
  'Comedy',
  'Romance',
  'Animation',
  'Documentary',
  'Fantasy',
];

export const categories: Record<string, Movie[]> = genres.reduce(
  (acc, genre) => {
    acc[genre] = movies.filter((m) => m.genres.includes(genre));
    return acc;
  },
  {} as Record<string, Movie[]>,
);

export const featuredMovies = movies
  .filter((m) => m.featured)
  .sort((a, b) => a.featuredOrder - b.featuredOrder);

export const seriesList = movies.filter((m) => m.type === 'series');
