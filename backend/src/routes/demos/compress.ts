import { Router, Request, Response } from 'express';
import zlib from 'zlib';

const router = Router();

function generateLargeDataset(count: number = 300) {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      uuid: `node-instance-packet-id-00000000000000000000${i}`,
      category: i % 2 === 0 ? "NETWORK_METRICS_TELEMETRY" : "DATABASE_CONNECTION_POOL_LOG",
      status: "HEALTHY_FIRST_PRINCIPLES_NODE",
      latencyMs: (Math.random() * 45 + 5).toFixed(2),
      details: {
        serverRegion: "us-east-1-zone-a",
        proxyType: "nginx-ingress-controller",
        socketDescriptor: `sock-fd-${i * 17}`,
        bufferAllocationBytes: 65536,
        description: "Backend First Principles: Measuring the impact of gzip compression on network payload transfer sizes."
      }
    });
  }
  return items;
}

router.get('/compress', (req: Request, res: Response) => {
  const isGzipRequested = req.query.gzip !== 'false' && req.query.gzip !== '0';
  const count = Math.min(Math.max(parseInt(req.query.count as string, 10) || 300, 10), 1000);

  const dataset = generateLargeDataset(count);
  const rawJsonString = JSON.stringify({
    _note: isGzipRequested
      ? "HTTP Gzip Compression Active: Notice the `Content-Encoding: gzip` response header. The transfer payload is compressed by ~85%."
      : "Uncompressed Payload: Notice NO `Content-Encoding` header. The full raw JSON byte payload was transmitted across the network wire.",
    compressionApplied: isGzipRequested,
    itemCount: dataset.length,
    dataset
  });

  const rawSizeBytes = Buffer.byteLength(rawJsonString, 'utf8');

  if (isGzipRequested) {
    zlib.gzip(Buffer.from(rawJsonString, 'utf8'), (err, compressedBuffer) => {
      if (err) {
        return res.status(500).json({ error: "Compression error" });
      }

      const compressedSizeBytes = compressedBuffer.length;
      const savingsPercent = (((rawSizeBytes - compressedSizeBytes) / rawSizeBytes) * 100).toFixed(1);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('X-Raw-Size-Bytes', rawSizeBytes.toString());
      res.setHeader('X-Compressed-Size-Bytes', compressedSizeBytes.toString());
      res.setHeader('X-Bandwidth-Savings', `${savingsPercent}%`);
      res.send(compressedBuffer);
    });
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Raw-Size-Bytes', rawSizeBytes.toString());
    res.setHeader('X-Compression-Status', 'DISABLED');
    res.send(rawJsonString);
  }
});

router.get('/compress/stats', (req: Request, res: Response) => {
  const count = parseInt(req.query.count as string, 10) || 300;
  const dataset = generateLargeDataset(count);
  const rawJsonString = JSON.stringify(dataset);
  const rawSizeBytes = Buffer.byteLength(rawJsonString, 'utf8');
  const compressedBuffer = zlib.gzipSync(Buffer.from(rawJsonString, 'utf8'));
  const compressedSizeBytes = compressedBuffer.length;

  res.json({
    _note: "Compression metrics comparison",
    itemsGenerated: count,
    uncompressedBytes: rawSizeBytes,
    uncompressedFormatted: `${(rawSizeBytes / 1024).toFixed(2)} KB`,
    gzipCompressedBytes: compressedSizeBytes,
    gzipCompressedFormatted: `${(compressedSizeBytes / 1024).toFixed(2)} KB`,
    bandwidthSavedBytes: rawSizeBytes - compressedSizeBytes,
    percentageShrunk: `${(((rawSizeBytes - compressedSizeBytes) / rawSizeBytes) * 100).toFixed(1)}%`
  });
});

export default router;
