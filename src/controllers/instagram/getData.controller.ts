import axios from 'axios'
import { Request, Response } from 'express';

export async function getInstagramData(req: Request, res: Response): Promise<void> {
    const accessToken = req.query.access_token

    try {
        const response = await axios.get(
            `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        )

        res.json(response.data) // contains id and username
    } catch (error: unknown) {
        console.error('Error fetching user info:', error instanceof Error ? error.message : 'Unknown error')
        res.status(500).json({ error: 'Failed to fetch user info' })
    }
}
