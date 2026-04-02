const Admin = require('./models/Admin');
const Product = require('./models/Product');

const seedProducts = [
    {
        title: 'Jungle To-Do Colouring Book',
        description: 'Explore the wild jungle! 48 pages of animals, trees and jungle scenes to colour. Perfect for young explorers aged 4–8.',
        price: 299,
        image_url: 'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/10666c02c5ff6dc3e38051b2a564e4775eaac646994a1ec8b6255159114be80b.png',
        category: 'colouring-book',
        age_range: '4-8 years',
        pages_count: 48,
        is_active: true
    },
    {
        title: 'Space Adventures To-Do Book',
        description: 'Blast off with astronauts, rockets and planets! 64 pages combining colouring with fun space tasks for young astronomers.',
        price: 349,
        image_url: 'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/7d777bedd0731939b82fa71f254874306cff1316dab1376bf10242b89d45bc94.png',
        category: 'colouring-book',
        age_range: '5-10 years',
        pages_count: 64,
        is_active: true
    },
    {
        title: 'Dinosaur Friends To-Do Book',
        description: 'Travel back in time with T-Rex and friends! 48 pages of dino scenes and activities. A must-have for every dino lover!',
        price: 299,
        image_url: 'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/ec0440a7a1c265d030e2b55a3b179e45314ee80b5efd702bd9cab1209f3ddc87.png',
        category: 'colouring-book',
        age_range: '3-7 years',
        pages_count: 48,
        is_active: true
    },
    {
        title: 'Magical Forest To-Do Book',
        description: 'Enter a world of fairies and unicorns! 64 pages of whimsical illustrations with creative tasks to spark imagination.',
        price: 349,
        image_url: 'https://images.unsplash.com/photo-1612539466809-8be5e4e01256?w=400&q=80',
        category: 'colouring-book',
        age_range: '4-9 years',
        pages_count: 64,
        is_active: true
    },
    {
        title: 'Ocean Wonders To-Do Book',
        description: 'Dive deep with colourful fish, dolphins and coral reefs! 48 pages of underwater adventures with sea-themed activities.',
        price: 299,
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
        category: 'colouring-book',
        age_range: '3-8 years',
        pages_count: 48,
        is_active: true
    },
    {
        title: 'Animals & Nature To-Do Book',
        description: 'From lions to butterflies — 96 pages of detailed animals and nature scenes. Perfect for curious young minds who love the natural world.',
        price: 399,
        image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80',
        category: 'colouring-book',
        age_range: '6-12 years',
        pages_count: 96,
        is_active: true
    }
];

async function seed() {
    try {
        // Seed admin
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const admin = new Admin({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });
            await admin.save();
            console.log('✅ Admin account created');
        } else {
            console.log('ℹ️  Admin account already exists');
        }

        // Seed products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany(seedProducts);
            console.log('✅ Seeded 6 products');
        } else {
            console.log(`ℹ️  ${productCount} products already exist`);
        }
    } catch (err) {
        console.error('Seed error:', err);
    }
}

module.exports = seed;
