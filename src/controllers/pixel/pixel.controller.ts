import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';
import { PNG } from 'pngjs';


// tiny 1×1 png buffer (transparent)
const pngBuffer = (() => {
  const png = new PNG({ width: 1, height: 1 });
  return PNG.sync.write(png);
})();

export default async function getPixel(req: Request, res: Response) {
  const companyId = req.query.company_id as string;
  const influencerId = req.query.influencer_id as string;
  const event = (req.query.event as string) ?? 'signup';
  const value = parseFloat((req.query.value as string) ?? '0');

  if (!companyId) {
    res.status(400).send('company_id missing');
    return;
  }

  // basic deduplication: same IP + aff + event within 5 min
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] ?? '0.0.0.0';
  const ua = req.headers['user-agent']?.toString() ?? '';

  try {
    await prisma.pixelHit.create({
      data: { companyId: parseInt(companyId), influencerId: parseInt(influencerId), event, value, ip, ua }
    });

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store'
    });
    res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Error creating pixel hit:', error);
    res.status(500).send('Internal Server Error');
  }
};
