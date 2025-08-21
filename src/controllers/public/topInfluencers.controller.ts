import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';

/**
 * Get top 10 influencers by followers count with unique user IDs
 * Route: GET /api/top-influencers
 * Public endpoint - no authentication required
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Top 10 influencer social details sorted by followers_count
 */
const getTopInfluencersController = async (req: Request, res: Response) => {
  try {
    // Get the social media account with highest followers count for each unique user
    // Using raw SQL to ensure we get the max followers_count per user
    const topInfluencers = await prisma.$queryRaw`
      WITH ranked_influencers AS (
        SELECT 
          isd.*,
          ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "followers_count" DESC NULLS LAST) as rn
        FROM "InfluencerSocialDetails" isd
        WHERE isd."isActive" = true 
        AND isd."followers_count" IS NOT NULL
        AND isd."followers_count" > 0
      )
      SELECT 
        ri.id,
        ri."socialMediaType",
        ri.name,
        ri.email,
        ri.provider,
        ri."createdAt",
        ri."updatedAt",
        ri."userId",
        ri."isActive",
        ri.biography,
        ri."followers_count",
        ri."follows_count",
        ri."media_count",
        ri."profile_picture_url",
        ri.stories,
        ri.username,
        ri.website
      FROM ranked_influencers ri
      WHERE ri.rn = 1
      ORDER BY ri."followers_count" DESC
      LIMIT 5
    `;

    // Define the type for the raw query result
    interface TopInfluencerSocialDetail {
      id: number;
      socialMediaType: string;
      name: string | null;
      email: string | null;
      provider: string | null;
      createdAt: Date;
      updatedAt: Date;
      userId: number;
      isActive: boolean;
      biography: string | null;
      followers_count: number;
      follows_count: number | null;
      media_count: number | null;
      profile_picture_url: string | null;
      stories: number | null;
      username: string | null;
      website: string | null;
    }

    // Get additional user and influencer info for the top influencers
    const typedTopInfluencers = topInfluencers as TopInfluencerSocialDetail[];
    const userIds = typedTopInfluencers.map(inf => inf.userId);
    
    const usersWithInfluencerInfo = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        isActive: true
      },
      select: {
        id: true,
        email: true,
        type: true,
        createdAt: true,
        influencer: {
          select: {
            id: true,
            name: true,
            city: true,
            whatsapp: true,
            email: true,
            ig_url: true,
            yt_url: true,
            is_insta_eligible: true,
            is_yt_eligible: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        profile: {
          select: {
            location: true,
            pic: true
          }
        }
      }
    });

    // Combine social details with user/influencer info
    const enrichedInfluencers = typedTopInfluencers.map(socialDetail => {
      const userInfo = usersWithInfluencerInfo.find(user => user.id === socialDetail.userId);
      const influencerInfo = userInfo?.influencer?.[0];
      const profileInfo = userInfo?.profile?.[0];

      return {
        socialDetails: {
          id: socialDetail.id,
          socialMediaType: socialDetail.socialMediaType,
          name: socialDetail.name,
          username: socialDetail.username,
          biography: socialDetail.biography,
          followersCount: socialDetail.followers_count,
          followsCount: socialDetail.follows_count,
          mediaCount: socialDetail.media_count,
          profilePictureUrl: socialDetail.profile_picture_url,
          stories: socialDetail.stories,
          website: socialDetail.website,
          isActive: socialDetail.isActive,
          provider: socialDetail.provider,
          createdAt: socialDetail.createdAt,
          updatedAt: socialDetail.updatedAt
        },
        user: {
          id: userInfo?.id,
          email: userInfo?.email,
          type: userInfo?.type,
          createdAt: userInfo?.createdAt
        },
        influencer: influencerInfo ? {
          id: influencerInfo.id,
          name: influencerInfo.name,
          city: influencerInfo.city,
          whatsapp: influencerInfo.whatsapp,
          email: influencerInfo.email,
          igUrl: influencerInfo.ig_url,
          ytUrl: influencerInfo.yt_url,
          isInstaEligible: influencerInfo.is_insta_eligible,
          isYtEligible: influencerInfo.is_yt_eligible,
          category: influencerInfo.category
        } : null,
        profile: profileInfo ? {
          location: profileInfo.location,
          pic: profileInfo.pic
        } : null
      };
    });

    return res.success({
      topInfluencers: enrichedInfluencers,
      count: enrichedInfluencers.length,
      message: 'Top influencers retrieved successfully'
    });

  } catch (err: unknown) {
    console.error('Error fetching top influencers:', err);
    return res.error('Something went wrong while fetching top influencers!', 500, err);
  }
};

export default getTopInfluencersController; 