import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'Anime',
    slug: 'anime',
    description: 'Latest anime releases, reviews, and discussions',
    icon: '🎬',
    color: '#00FFFF',
  },
  {
    name: 'Movies',
    slug: 'movies',
    description: 'Movie reviews, recommendations, and analysis',
    icon: '🎥',
    color: '#FF00FF',
  },
  {
    name: 'Reviews',
    slug: 'reviews',
    description: 'In-depth reviews of anime and movies',
    icon: '⭐',
    color: '#00FF00',
  },
  {
    name: 'News',
    slug: 'news',
    description: 'Latest news from the anime and movie industry',
    icon: '📰',
    color: '#FFFF00',
  },
];

async function seedCategories() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('🌱 Starting categories seed...');
    
    // Insert categories
    for (const category of categories) {
      try {
        const query = `
          INSERT INTO categories (name, slug, description, icon, color, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        const values = [
          category.name,
          category.slug,
          category.description,
          category.icon,
          category.color,
        ];
        
        await connection.execute(query, values);
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Category already exists: ${category.name}`);
        } else {
          console.error(`❌ Failed to create category ${category.name}:`, error.message);
        }
      }
    }
    
    await connection.end();
    console.log('✨ Categories seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedCategories();
