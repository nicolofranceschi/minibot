import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import JSZip from 'jszip';


export default async function createQr(req: NextApiRequest, res: NextApiResponse) {
  try {

    const files = req.body

    const zip = new JSZip();

    console.log(req.body)

    files.map((file : any, i: number) => zip.file(`${i}.pdf`, file));
    const stream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
    res.writeHead(200, {
      'Content-Type': 'application/zip',
    });
    stream.pipe(res);
  } catch (error: any) {
    if (error) {
      return res.status(error.code || 500).json({ error: error.message });
    }
  }
}

