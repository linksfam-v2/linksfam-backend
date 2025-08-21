import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import { prisma } from '../../db/db.js'
import { Session } from 'express-session'

interface CustomSession extends Session {
    accessToken?: string
    pageId?: string
}

export const getInstagramPageData = async (
    req: Request,
    res: Response
): Promise<void> => {
    const session = req.session as CustomSession
    const shortLivedToken = session?.accessToken || req?.cookies?.accessToken

    try {
        const userId = Number(req?.userId)

        const checkResults = await prisma.influencerSocialDetails.findMany({
            where: {
                userId,
                socialMediaType: 'instagram',
            },
        })

        if (checkResults?.length > 0) {
            res.success(checkResults[0])
            return
        }

        if (!shortLivedToken) {
            res.status(401).json({ error: 'Missing access token in session' })
            return
        }

        const exchangeTokenRes = await axios.get(
            'https://graph.instagram.com/access_token',
            {
                params: {
                    grant_type: 'ig_exchange_token',
                    client_secret: "3b8d515c70b8fd0c31abaa17c09a25ef",
                    access_token: shortLivedToken,
                },
            }
        );
       const longLivedToken = exchangeTokenRes.data.access_token;
              
        //  Get instagram account
        const pagesRes = await axios.get(
            'https://graph.instagram.com/v22.0/me',
            {
                params: {
                    access_token: longLivedToken,
                    fields: 'biography,followers_count,name,username,profile_picture_url,website,media_count,follows_count,stories',
                },
            }
        )

        const page = pagesRes.data
        if (!page) {
            res.status(404).json({ error: 'No instagram account found' })
            return
        }
        const igDetails = pagesRes

        //store instagram business account details in db
        await prisma.influencerSocialDetails.create({
            data: {
                isActive: true,
                token: longLivedToken,
                socialMediaType: 'instagram',
                name: igDetails.data.name,
                email: igDetails.data.email ? igDetails.data.email : '',
                provider: 'instagram',
                profile_picture_url: igDetails.data.profile_picture_url,
                username: igDetails.data.username,
                followers_count: igDetails.data.followers_count,
                media_count: igDetails.data.media_count,
                follows_count: igDetails.data.follows_count,
                website: igDetails.data.website,
                biography: igDetails.data.biography,
                stories: igDetails.data.stories,
                userId,
                expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            },
        })

        if (igDetails.data.followers_count >= 2) {
            console.log("updating is_insta_eligible to true")
            await prisma.influencer.update({
                where: { id: userId },
                data: { is_insta_eligible: true },
            })
        }

        // 3. Store instagram account id in session
        session.pageId = igDetails.data.id

        const igData = igDetails.data

        res.success(igData)
    } catch (error: unknown) {
        console.error(
            'Error fetching page info:',
            error instanceof AxiosError ? error.response?.data : error
        )
        res.status(500).json({ error: 'Failed to fetch page info' })
    }
}
