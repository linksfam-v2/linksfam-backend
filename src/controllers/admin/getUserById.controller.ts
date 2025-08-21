import { Request, Response } from 'express'
import { prisma } from '../../db/db.js'

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        })
        res.success(user)
    } catch (error) {
        res.error('Something went wrong!', 400, error)
    }
}

export default getUserById
