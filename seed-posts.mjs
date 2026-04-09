import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const seedPosts = [
  {
    title: 'Attack on Titan: The Final Season Breakdown',
    slug: 'attack-on-titan-final-season',
    content: `# Attack on Titan: The Final Season - A Complete Breakdown

Attack on Titan's final season has delivered some of the most intense and emotionally charged episodes in anime history. The series has masterfully woven together complex themes of freedom, morality, and the cost of war.

## Key Highlights

- **Stunning Animation**: The fight choreography and CGI integration have reached new heights
- **Character Development**: Eren's transformation and the moral ambiguity of his actions
- **World-Building**: The revelation of the outside world and Marley's perspective
- **Emotional Impact**: The relationships between characters tested to their limits

## Final Thoughts

This season proves why Attack on Titan remains one of the greatest anime series of all time. The ending may be controversial, but it's undeniably impactful.

**Rating: 9.2/10**

*Data sourced from IMDb and community reviews*`,
    excerpt: 'Attack on Titan\'s final season delivers intense action and emotional storytelling that redefines the anime landscape.',
    categoryId: 1,
    authorId: 1,
    status: 'published',
    featuredImage: 'https://m.media-amazon.com/images/M/MV5BNjk3MzYxODctOTliYS00YzE2LWE2YzAtYTJmZTEwMjE1NDg0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    thumbnail: 'https://m.media-amazon.com/images/M/MV5BNjk3MzYxODctOTliYS00YzE2LWE2YzAtYTJmZTEwMjE1NDg0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    imdbReference: 'tt2488496',
    metaDescription: 'Attack on Titan Final Season review and breakdown - IMDb rating 9.2/10',
    metaKeywords: 'Attack on Titan, anime, final season, review',
    views: 0,
    publishedAt: new Date(),
  },
  {
    title: 'Dune: Part Two - Sci-Fi Masterpiece',
    slug: 'dune-part-two-review',
    content: `# Dune: Part Two - A Sci-Fi Masterpiece

Denis Villeneuve's Dune: Part Two is a stunning continuation of the epic saga. With breathtaking cinematography, an incredible score, and powerful performances, this film sets a new standard for science fiction cinema.

## What Makes It Great

- **Visual Spectacle**: The desert sequences are absolutely mesmerizing
- **Sound Design**: Hans Zimmer's score elevates every scene
- **Character Arcs**: Paul's transformation is compelling and tragic
- **World-Building**: The intricate political dynamics are expertly portrayed

## Technical Excellence

The film's use of practical effects combined with CGI creates an immersive experience that few films can match. The sandworm sequences alone are worth the price of admission.

**IMDb Rating: 8.5/10**

*A must-watch for sci-fi enthusiasts*`,
    excerpt: 'Dune: Part Two is a visual and auditory masterpiece that delivers on every front.',
    categoryId: 2,
    authorId: 1,
    status: 'published',
    featuredImage: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEtNzM0NC00MDExLWFhMjAtNDJjODcyZDVjYTc4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg',
    thumbnail: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEtNzM0NC00MDExLWFhMjAtNDJjODcyZDVjYTc4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg',
    imdbReference: 'tt13156000',
    metaDescription: 'Dune Part Two review - IMDb rating 8.5/10, sci-fi masterpiece',
    metaKeywords: 'Dune, Part Two, movie, review, sci-fi',
    views: 0,
    publishedAt: new Date(),
  },
  {
    title: 'Demon Slayer: Swordsmith Village Arc Review',
    slug: 'demon-slayer-swordsmith-village',
    content: `# Demon Slayer: Swordsmith Village Arc - A Visual Feast

The Swordsmith Village Arc continues Demon Slayer's tradition of delivering exceptional action sequences and character development. This arc introduces new characters while deepening our understanding of the main cast.

## Arc Highlights

- **Animation Quality**: ufotable continues to push the boundaries of anime animation
- **New Characters**: The introduction of Mitsuri and Obanai adds fresh dynamics
- **Action Sequences**: The battles are choreographed with precision and creativity
- **Emotional Depth**: Character backstories are explored with sensitivity

## Story Progression

This arc serves as a crucial turning point in the series, introducing new plot elements that will shape the story's direction. The pacing is excellent, balancing intense action with quieter character moments.

**Rating: 9.1/10**

*A testament to ufotable's dedication to quality*`,
    excerpt: 'The Swordsmith Village Arc showcases Demon Slayer at its finest with stunning animation and compelling storytelling.',
    categoryId: 1,
    authorId: 1,
    status: 'published',
    featuredImage: 'https://m.media-amazon.com/images/M/MV5BNGJhMjk3ZDItNzAxMC00ZjhhLTk0NDAtZDhhMzY5YzhhOWU0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    thumbnail: 'https://m.media-amazon.com/images/M/MV5BNGJhMjk3ZDItNzAxMC00ZjhhLTk0NDAtZDhhMzY5YzhhOWU0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    imdbReference: 'tt16426674',
    metaDescription: 'Demon Slayer Swordsmith Village Arc review - IMDb rating 9.1/10',
    metaKeywords: 'Demon Slayer, anime, Swordsmith Village, review',
    views: 0,
    publishedAt: new Date(),
  },
  {
    title: 'Oppenheimer: Christopher Nolan\'s Triumph',
    slug: 'oppenheimer-nolan-review',
    content: `# Oppenheimer: Christopher Nolan's Triumph

Christopher Nolan's Oppenheimer is a bold, ambitious film that tackles one of history's most complex figures. With stellar performances and masterful direction, this film is a cinematic achievement.

## Why It Works

- **Cillian Murphy's Performance**: A career-defining role that captures Oppenheimer's complexity
- **Narrative Structure**: Nolan's non-linear storytelling keeps the audience engaged
- **Cinematography**: Hoyte van Hoytema's work is absolutely stunning
- **Historical Significance**: The film raises important questions about scientific responsibility

## Technical Mastery

The film's use of IMAX cinematography and practical effects creates an immersive experience. The sound design is particularly impressive, with Ludwig Göransson's score perfectly complementing the visuals.

**IMDb Rating: 8.4/10**

*A must-watch for film enthusiasts and history buffs*`,
    excerpt: 'Oppenheimer is Christopher Nolan\'s most ambitious film yet, delivering a powerful exploration of ambition and responsibility.',
    categoryId: 2,
    authorId: 1,
    status: 'published',
    featuredImage: 'https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00OWE3LWIzMGYtZDBlYTMxODMyMzA1XkEyXkFqcGdeQXVyMTAxNzYzMDEz._V1_SX300.jpg',
    thumbnail: 'https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00OWE3LWIzMGYtZDBlYTMxODMyMzA1XkEyXkFqcGdeQXVyMTAxNzYzMDEz._V1_SX300.jpg',
    imdbReference: 'tt15398776',
    metaDescription: 'Oppenheimer review - Christopher Nolan\'s masterpiece, IMDb rating 8.4/10',
    metaKeywords: 'Oppenheimer, movie, review, Christopher Nolan',
    views: 0,
    publishedAt: new Date(),
  },
  {
    title: 'Jujutsu Kaisen Season 2: Shibuya Incident Arc',
    slug: 'jujutsu-kaisen-season-2-shibuya',
    content: `# Jujutsu Kaisen Season 2: Shibuya Incident Arc - Peak Anime

Jujutsu Kaisen Season 2's Shibuya Incident Arc is nothing short of phenomenal. With incredible action sequences, character development, and plot twists, this arc cements Jujutsu Kaisen as one of the greatest anime series.

## Arc Excellence

- **Action Choreography**: Some of the best fight sequences in anime
- **Character Moments**: Emotional depth mixed with intense action
- **Plot Twists**: Shocking revelations that redefine the story
- **Animation Quality**: MAPPA delivers consistently excellent visuals

## Story Impact

The Shibuya Incident Arc serves as a major turning point in the series. The consequences of this arc will shape the entire trajectory of the story moving forward. Every character is tested, and the stakes have never been higher.

**Rating: 9.3/10**

*An absolute must-watch for anime fans*`,
    excerpt: 'The Shibuya Incident Arc is Jujutsu Kaisen at its absolute best, delivering unforgettable action and storytelling.',
    categoryId: 1,
    authorId: 1,
    status: 'published',
    featuredImage: 'https://m.media-amazon.com/images/M/MV5BZTk2OWQwOTItMDRkNS00YzMwLWI3NTItYTI5NTMxMzExMGZhXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    thumbnail: 'https://m.media-amazon.com/images/M/MV5BZTk2OWQwOTItMDRkNS00YzMwLWI3NTItYTI5NTMxMzExMGZhXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    imdbReference: 'tt14410538',
    metaDescription: 'Jujutsu Kaisen Season 2 Shibuya Incident Arc review - IMDb rating 9.3/10',
    metaKeywords: 'Jujutsu Kaisen, anime, Season 2, Shibuya Incident',
    views: 0,
    publishedAt: new Date(),
  },
];

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🌱 Starting database seed...');
    
    // Insert posts
    for (const post of seedPosts) {
      try {
        const query = `
          INSERT INTO posts (
            title, slug, content, excerpt, categoryId, authorId, status,
            featuredImage, thumbnail, imdbReference, metaDescription,
            metaKeywords, views, publishedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        const values = [
          post.title,
          post.slug,
          post.content,
          post.excerpt,
          post.categoryId,
          post.authorId,
          post.status,
          post.featuredImage,
          post.thumbnail,
          post.imdbReference,
          post.metaDescription,
          post.metaKeywords,
          post.views,
          post.publishedAt,
        ];
        
        await connection.execute(query, values);
        console.log(`✅ Created post: ${post.title}`);
      } catch (error) {
        console.error(`❌ Failed to create post ${post.title}:`, error.message);
      }
    }
    
    await connection.end();
    console.log('✨ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
