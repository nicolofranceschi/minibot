import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import JSZip from 'jszip';

export default async function createQr(req: NextApiRequest, res: NextApiResponse) {
  try {
    // TODO: mettere i controlli sul tipo
    const promises = req.body.map((file : any) =>
      fetch(file.url)
        .then(r => r.blob())
        .then(async r => ({ file: await r.arrayBuffer(), name: file.name, type: r.type.split('/')[1] })),
    );
    const files = (await Promise.all(promises)) as { file: Blob; name: string; type: string }[];

    const zip = new JSZip();

    files.map(({ file, name, type }, i) => zip.file(`${name ?? i}.${type}`, file, { binary: true }));
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
