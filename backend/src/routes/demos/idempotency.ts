import { Router, Request, Response } from 'express';

const router = Router();

interface ServerStore {
  resource: {
    id: string;
    value: string;
    lastUpdated: string;
    exists: boolean;
  };
  totalCallsByMethod: {
    GET: number;
    POST: number;
    PUT: number;
    DELETE: number;
  };
  postCreationHistory: Array<{ id: string; timestamp: string; payload: any }>;
}

let serverStore: ServerStore = {
  resource: {
    id: "item-42",
    value: "Initial First Principles State",
    lastUpdated: new Date().toISOString(),
    exists: true
  },
  totalCallsByMethod: {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0
  },
  postCreationHistory: []
};

router.get('/idempotent-check', (_req: Request, res: Response) => {
  serverStore.totalCallsByMethod.GET += 1;

  res.json({
    _note: "GET is IDEMPOTENT and SAFE: Repeating this call 1,000 times will never modify the server resource state.",
    method: "GET",
    isIdempotent: true,
    isSafe: true,
    currentState: serverStore.resource,
    totalGetInvocations: serverStore.totalCallsByMethod.GET,
    explanation: "GET retrieves data without mutating state. Safe to retry automatically on network failures."
  });
});

router.post('/idempotent-check', (req: Request, res: Response) => {
  serverStore.totalCallsByMethod.POST += 1;
  const newId = `post-record-${Date.now()}-${serverStore.totalCallsByMethod.POST}`;
  const newEntry = {
    id: newId,
    timestamp: new Date().toISOString(),
    payload: req.body && Object.keys(req.body).length > 0 ? req.body : { label: "Auto-generated record" }
  };
  serverStore.postCreationHistory.push(newEntry);

  res.status(201).json({
    _note: "POST is NOT IDEMPOTENT: Each time you fire this POST request, a brand-new record is created in server memory! If you click 5 times, 5 records exist.",
    method: "POST",
    isIdempotent: false,
    isSafe: false,
    createdRecord: newEntry,
    totalRecordsCreatedSoFar: serverStore.postCreationHistory.length,
    postCallCount: serverStore.totalCallsByMethod.POST,
    warning: "Retrying POST requests on network timeout without an idempotency key risks duplicate payments/records!"
  });
});

router.put('/idempotent-check', (req: Request, res: Response) => {
  serverStore.totalCallsByMethod.PUT += 1;
  const newValue = req.body?.value || "Explicitly replaced value via PUT";

  serverStore.resource = {
    id: "item-42",
    value: newValue,
    lastUpdated: new Date().toISOString(),
    exists: true
  };

  res.json({
    _note: "PUT is IDEMPOTENT: Regardless of whether you send this PUT request 1 time or 100 times with the same body, the server resource ends up in the EXACT SAME state.",
    method: "PUT",
    isIdempotent: true,
    isSafe: false,
    targetStateAfterPut: serverStore.resource,
    putCallCount: serverStore.totalCallsByMethod.PUT,
    explanation: "PUT specifies the complete replacement representation of the target resource."
  });
});

router.delete('/idempotent-check', (_req: Request, res: Response) => {
  serverStore.totalCallsByMethod.DELETE += 1;
  const wasAlreadyDeleted = !serverStore.resource.exists;

  serverStore.resource.exists = false;
  serverStore.resource.lastUpdated = new Date().toISOString();

  res.json({
    _note: "DELETE is IDEMPOTENT: Calling DELETE once removes the item. Calling DELETE 10 more times leaves the item still removed—the final system state is unchanged.",
    method: "DELETE",
    isIdempotent: true,
    isSafe: false,
    wasAlreadyDeleted,
    currentState: serverStore.resource,
    deleteCallCount: serverStore.totalCallsByMethod.DELETE
  });
});

router.post('/idempotent-check/reset', (_req: Request, res: Response) => {
  serverStore = {
    resource: {
      id: "item-42",
      value: "Initial First Principles State",
      lastUpdated: new Date().toISOString(),
      exists: true
    },
    totalCallsByMethod: {
      GET: 0,
      POST: 0,
      PUT: 0,
      DELETE: 0
    },
    postCreationHistory: []
  };

  res.json({
    _note: "Idempotency test store reset to default baseline.",
    store: serverStore
  });
});

export default router;
