import { Request, Response } from 'express'
import { prisma } from '../../db/db.js'

const getAdminSocialAccounts = async (req: Request, res: Response) => {
    try {
        const socialDetails = await prisma.influencerSocialDetails.findMany({})
        res.success(socialDetails)
        return
    } catch (error) {
        if (error instanceof Error) {
            res.error(error.message)
        } else {
            res.error('An unknown error occurred')
        }
    }
}

export default getAdminSocialAccounts
