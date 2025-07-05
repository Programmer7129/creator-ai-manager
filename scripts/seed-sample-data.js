const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the test user's agency
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { agency: true }
    });

    if (!testUser || !testUser.agency) {
      console.error('❌ Test user or agency not found. Please run seed-test-user.js first.');
      return;
    }

    console.log('👤 Found test user:', testUser.name);
    console.log('🏢 Found test agency:', testUser.agency.name);

    // Create sample creators
    const creators = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        socialHandles: JSON.stringify({
          instagram: { handle: '@sarah_lifestyle', followers: 45000 },
          youtube: { handle: 'SarahLifestyle', subscribers: 15000 },
          tiktok: { handle: '@sarah_life', followers: 85000 }
        }),
        niche: 'Lifestyle & Fashion',
        baseRate: 1200,
        metrics: JSON.stringify({
          engagementRate: 4.2,
          avgViews: 25000,
          avgLikes: 1800
        }),
        audienceData: JSON.stringify({
          ageRange: '18-34',
          topLocations: ['US', 'UK', 'Canada'],
          genderSplit: { female: 75, male: 25 }
        })
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        socialHandles: JSON.stringify({
          instagram: { handle: '@mike_fitness', followers: 32000 },
          youtube: { handle: 'MikeFitness', subscribers: 28000 },
          tiktok: { handle: '@mike_gains', followers: 67000 }
        }),
        niche: 'Fitness & Health',
        baseRate: 950,
        metrics: JSON.stringify({
          engagementRate: 5.8,
          avgViews: 18000,
          avgLikes: 2100
        }),
        audienceData: JSON.stringify({
          ageRange: '22-40',
          topLocations: ['US', 'Australia', 'UK'],
          genderSplit: { female: 40, male: 60 }
        })
      },
      {
        name: 'Emma Rodriguez',
        email: 'emma@example.com',
        socialHandles: JSON.stringify({
          instagram: { handle: '@emma_travels', followers: 78000 },
          youtube: { handle: 'EmmaExplores', subscribers: 12000 },
          tiktok: { handle: '@emma_adventures', followers: 125000 }
        }),
        niche: 'Travel & Adventure',
        baseRate: 1800,
        metrics: JSON.stringify({
          engagementRate: 3.9,
          avgViews: 35000,
          avgLikes: 3200
        }),
        audienceData: JSON.stringify({
          ageRange: '25-45',
          topLocations: ['US', 'Spain', 'France', 'Italy'],
          genderSplit: { female: 65, male: 35 }
        })
      }
    ];

    console.log('🎨 Creating sample creators...');
    
    for (const creatorData of creators) {
      const creator = await prisma.creator.create({
        data: {
          ...creatorData,
          agencyId: testUser.agency.id
        }
      });
      console.log(`✅ Created creator: ${creator.name}`);
    }

    // Get all creators for deals
    const allCreators = await prisma.creator.findMany({
      where: { agencyId: testUser.agency.id }
    });

    // Create sample deals
    const deals = [
      {
        creatorId: allCreators[0].id,
        brand: 'StyleCo Fashion',
        contactEmail: 'partnerships@styleco.com',
        contactName: 'Jessica Park',
        status: 'ACTIVE',
        amount: 2500,
        description: 'Instagram post + Stories campaign for new summer collection',
        deliverables: JSON.stringify([
          '1 Instagram feed post',
          '3 Instagram stories',
          'Product photography'
        ]),
        nextActionAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Campaign performing well, brand happy with engagement'
      },
      {
        creatorId: allCreators[1].id,
        brand: 'FitLife Supplements',
        contactEmail: 'marketing@fitlife.com',
        contactName: 'David Thompson',
        status: 'PENDING',
        amount: 1800,
        description: 'YouTube video review + Instagram promotion',
        deliverables: JSON.stringify([
          '1 YouTube review video (8-10 min)',
          '2 Instagram posts',
          '5 Instagram stories'
        ]),
        nextActionAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        notes: 'Waiting for product samples to arrive'
      },
      {
        creatorId: allCreators[2].id,
        brand: 'TravelGear Pro',
        contactEmail: 'collabs@travelgear.com',
        contactName: 'Amanda Wilson',
        status: 'NEGOTIATING',
        amount: 3200,
        description: 'Multi-platform campaign for new backpack line',
        deliverables: JSON.stringify([
          '1 YouTube unboxing video',
          '3 Instagram feed posts',
          '10 Instagram stories',
          '5 TikTok videos'
        ]),
        nextActionAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        notes: 'Discussing usage rights and exclusivity terms'
      },
      {
        creatorId: allCreators[0].id,
        brand: 'BeautyBliss Cosmetics',
        contactEmail: 'influencer@beautybliss.com',
        contactName: 'Rachel Green',
        status: 'COMPLETED',
        amount: 1500,
        description: 'Get Ready With Me video featuring new makeup line',
        deliverables: JSON.stringify([
          '1 Instagram Reel',
          '1 TikTok video',
          'Product mention in stories'
        ]),
        notes: 'Campaign completed successfully, great engagement metrics'
      }
    ];

    console.log('💼 Creating sample deals...');
    
    for (const dealData of deals) {
      const deal = await prisma.deal.create({
        data: dealData
      });
      console.log(`✅ Created deal: ${deal.brand} x ${allCreators.find(c => c.id === deal.creatorId)?.name}`);
    }

    // Create some AI suggestions
    const suggestions = [
      {
        creatorId: allCreators[0].id,
        type: 'CONTENT_IDEA',
        title: 'Fall Fashion Haul Trending',
        content: 'Fall fashion hauls are trending with 2.5M+ posts. Consider creating a "Affordable Fall Essentials" series to capitalize on this trend.',
        metadata: JSON.stringify({
          trendStrength: 'High',
          estimatedReach: '50K-75K',
          optimalPostTime: '7:00 PM EST'
        }),
        status: 'PENDING'
      },
      {
        creatorId: allCreators[1].id,
        type: 'POSTING_TIME',
        title: 'Optimal Workout Video Time',
        content: 'Your fitness content performs 40% better when posted at 6:00 AM or 6:00 PM. Consider scheduling your next workout video for these times.',
        metadata: JSON.stringify({
          bestTimes: ['6:00 AM', '6:00 PM'],
          performanceBoost: '40%',
          timezone: 'EST'
        }),
        status: 'APPROVED'
      },
      {
        creatorId: allCreators[2].id,
        type: 'BRAND_MATCH',
        title: 'Potential Brand Partnership',
        content: 'Adventure Gear Co. is looking for travel influencers with 50K+ followers. Your audience demographics match their target market perfectly.',
        metadata: JSON.stringify({
          brandName: 'Adventure Gear Co.',
          matchScore: '92%',
          estimatedDeal: '$2000-3000'
        }),
        status: 'PENDING'
      }
    ];

    console.log('🤖 Creating AI suggestions...');
    
    for (const suggestionData of suggestions) {
      const suggestion = await prisma.aISuggestion.create({
        data: suggestionData
      });
      console.log(`✅ Created AI suggestion: ${suggestion.title}`);
    }

    console.log('');
    console.log('🎉 Sample data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${creators.length} creators created`);
    console.log(`   - ${deals.length} deals created`);
    console.log(`   - ${suggestions.length} AI suggestions created`);
    console.log('');
    console.log('🚀 Your dashboard is now ready with sample data!');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 