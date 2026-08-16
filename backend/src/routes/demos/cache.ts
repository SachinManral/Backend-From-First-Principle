import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

interface CachedResourceState {
  id: string;
  title: string;
  version: number;
  content: string;
  updatedAt: string;
  etag: string;
}

let resourceState: CachedResourceState = {
  id: "res-001",
  title: "Backend First Principles Caching Guide",
  version: 1,
  content: "HTTP caching is the fastest request because it skips bandwidth transfer entirely.",
  updatedAt: new Date().toISOString(),
  etag: 'W/"f9a8b7c6d5e4"'
};

function generateEtag(state: Omit<CachedResourceState, 'etag'>): string {
  const hash = crypto.createHash('md5').update(JSON.stringify(state)).digest('hex').substring(0, 12);
  return `W/"${hash}"`;
}

resourceState.etag = generateEtag(resourceState);

router.get('/cache/resource', (req: Request, res: Response) => {
  const ifNoneMatch = req.get('if-none-match');
  const ifModifiedSince = req.get('if-modified-since');

  res.setHeader('ETag', resourceState.etag);
  res.setHeader('Last-Modified', new Date(resourceState.updatedAt).toUTCString());
  res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');

  if (ifNoneMatch && (ifNoneMatch === resourceState.etag || ifNoneMatch === resourceState.etag.replace(/^W\//, ''))) {
    res.setHeader('X-Cache-Decision', 'HIT-304-NOT-MODIFIED');
    return res.status(304).end();
  }

  if (ifModifiedSince) {
    const clientTime = new Date(ifModifiedSince).getTime();
    const serverTime = new Date(resourceState.updatedAt).getTime();
    if (clientTime >= serverTime) {
      res.setHeader('X-Cache-Decision', 'HIT-304-NOT-MODIFIED-BY-DATE');
      return res.status(304).end();
    }
  }

  res.setHeader('X-Cache-Decision', 'MISS-200-FRESH-FETCH');
  res.status(200).json({
    _note: "200 OK (Fresh Payload): Server generated new response bytes with ETag header. Re-request with header `If-None-Match: " + resourceState.etag + "` to see a 304 response!",
    cacheStatus: "FRESH_TRANSFER_200",
    etagGenerated: resourceState.etag,
    lastModified: resourceState.updatedAt,
    cacheControlRule: "public, max-age=60, must-revalidate",
    data: resourceState,
    instructions: {
      step1: "Observe the ETag header returned in response.",
      step2: "Send GET request again with header: 'If-None-Match: " + resourceState.etag + "' -> expect 304 Not Modified.",
      step3: "Fire a PATCH request to mutate this resource -> observe ETag change and subsequent 200 response."
    }
  });
});

router.patch('/cache/resource', (req: Request, res: Response) => {
  const newContent = req.body.content || `Updated at ${new Date().toLocaleTimeString()} by student testing cache invalidation`;
  const newTitle = req.body.title || resourceState.title;

  resourceState.version += 1;
  resourceState.content = newContent;
  resourceState.title = newTitle;
  resourceState.updatedAt = new Date().toISOString();
  resourceState.etag = generateEtag(resourceState);

  res.setHeader('ETag', resourceState.etag);

  res.json({
    _note: "Resource Mutated (Version " + resourceState.version + "): The server generated a brand-new ETag hash (" + resourceState.etag + "). Older client caches are now invalid!",
    message: "Resource successfully modified.",
    newVersion: resourceState.version,
    newEtag: resourceState.etag,
    data: resourceState
  });
});

router.post('/cache/reset', (_req: Request, res: Response) => {
  resourceState = {
    id: "res-001",
    title: "Backend First Principles Caching Guide",
    version: 1,
    content: "HTTP caching is the fastest request because it skips bandwidth transfer entirely.",
    updatedAt: new Date().toISOString(),
    etag: ""
  };
  resourceState.etag = generateEtag(resourceState);

  res.json({
    _note: "Resource reset to initial state.",
    resource: resourceState
  });
});

export default router;
