import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import axios from "axios";

interface InstagramPost {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    thumbnail_url: string;
    permalink: string;
    timestamp: string;
    like_count: number;
    comments_count: number;
    postId?: string;
}

export const getInstagramPostsController = async (req: Request, res: Response) => {
    try {
        // Extract pagination parameters
        const skip = parseInt(req.query.skip as string) || 0
        const limit = parseInt(req.query.limit as string) || 10

        const userId = Number(req?.userId);

        // Validate userId is a valid number
        if (isNaN(userId)) {
            res.status(400).json({ error: 'Invalid user ID' })
            return
        }

        const igData = await prisma.influencerSocialDetails.findMany({
            where: {
                socialMediaType: 'instagram',
                userId: userId
            },
            include: {
                newestInstagramReels: {
                    skip,
                    take: limit,
                    orderBy: {
                        timestamp: 'desc'
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if(igData?.length <= 0){
            // Check if res.error is a function, otherwise use standard response
            if (typeof res.error === 'function') {
                res.error('Instagram not connected', 403);
                return;
            } else {
                res.status(403).json({ error: 'Instagram not connected' })
                return
            }
        }

        // If we have existing reels and this is the first page (skip === 0), return them
        if(igData[0].newestInstagramReels.length > 0 && skip === 0){
            if (typeof res.success === 'function') {
                res.success(igData[0].newestInstagramReels);
                return;
            } else {
                res.status(200).json({
                    data: igData[0].newestInstagramReels,
                    pagination: {
                        skip,
                        limit,
                        total: igData[0].newestInstagramReels.length
                    }
                })
                return
            }
        }

        // Check if any account has reels
        const existingReels = igData.flatMap(
            (item) => item.newestInstagramReels || []
        )

        if (existingReels.length > 0) {
            // Check if res.success is a function, otherwise use standard response
            if (typeof res.success === 'function') {
                res.success(existingReels)
                return
            } else {
                res.status(200).json({
                    data: existingReels,
                    pagination: {
                        skip,
                        limit,
                        total: igData.reduce((acc, item) => acc + (item.newestInstagramReels?.length || 0), 0)
                    }
                })
                return
            }
        } else {
            try {
                const postsdata = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${igData[0].token}`);

                const last30daysreels = postsdata.data.data.filter((post: InstagramPost) => {
                    const postDate = new Date(post.timestamp);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return postDate >= thirtyDaysAgo;
                });

                let reelsToStore = last30daysreels;

                // If no reels in last 30 days, get all available reels
                if (last30daysreels.length === 0) {
                    reelsToStore = postsdata.data.data;
                }

                if (reelsToStore && reelsToStore.length > 0) {
                    await prisma.newestInstagramReels.createMany({
                        data: reelsToStore.map((post: InstagramPost) => ({
                            caption: post.caption || '',
                            postId: post.id,
                            media_url: post.media_url,
                            media_type: post.media_type,
                            thumbnail_url: post.thumbnail_url || post.media_url,
                            permalink: post.permalink,
                            timestamp: new Date(post.timestamp),
                            like_count: post.like_count || 0,
                            comments_count: post.comments_count || 0,
                            socialId: igData[0].id
                        }))
                    })

                    //check if the most recent post was uploaded in the last 30 days
                    const mostRecentPost = reelsToStore[0];
                    const mostRecentPostDate = new Date(mostRecentPost.timestamp);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    if (mostRecentPostDate > thirtyDaysAgo) {
                        // Uploaded within last 30 days
                        await prisma.influencer.update({
                            where: { id: userId },
                            data: { is_insta_eligible: true },
                        });
                    } 

                    // Apply pagination to newly fetched reels
                    const paginatedReels = reelsToStore.slice(skip, skip + limit);
                    //change id to postId
                    paginatedReels.forEach((post: InstagramPost) => {
                        post.postId = post.id;
                    })

                    if (typeof res.success === 'function') {
                        res.success(paginatedReels)
                        return
                    } else {
                        res.status(200).json({
                            data: paginatedReels,
                            pagination: {
                                skip,
                                limit,
                                total: reelsToStore.length
                            }
                        })
                        return
                    }
                } else {
                    if (typeof res.success === 'function') {
                        res.success([])
                        return
                    } else {
                        res.status(200).json({
                            data: [],
                            pagination: {
                                skip,
                                limit,
                                total: 0
                            }
                        })
                        return
                    }
                }
            } catch (fetchError) {
                console.error(
                    'Error fetching Instagram posts:',
                    fetchError instanceof Error
                        ? fetchError.message
                        : 'Unknown error'
                )
                res.status(500).json({
                    error: 'Failed to fetch Instagram posts',
                })
                return
            }
        }
    } catch (error) {
        console.error('Error in Instagram Posts Controller:', error);
        // Check if res.error is a function, otherwise use standard response
        if (typeof res.error === 'function') {
            res.error('Something went wrong!', 500, error);
        } else {
            res.status(500).json({ error: 'Something went wrong!' })
        }
    }
}