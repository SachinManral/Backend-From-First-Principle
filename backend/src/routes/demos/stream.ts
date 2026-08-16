import { Router, Request, Response } from 'express';

const router = Router();

router.get('/stream', (req: Request, res: Response) => {
  const totalSteps = Math.min(Math.max(parseInt(req.query.steps as string, 10) || 5, 2), 10);
  const intervalMs = Math.min(Math.max(parseInt(req.query.interval as string, 10) || 600, 200), 2000);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const initialPayload = {
    _note: "Streaming initiated: The TCP socket remains open while the server pushes progressive chunked event frames.",
    status: "CONNECTED",
    totalStepsExpected: totalSteps,
    intervalMs,
    startedAt: new Date().toISOString()
  };
  res.write(`event: init\ndata: ${JSON.stringify(initialPayload)}\n\n`);

  const stepDescriptions = [
    "Step 1: TCP Handshake established with client socket.",
    "Step 2: DNS queries completed and reverse proxy authenticated TLS certificate.",
    "Step 3: Database query plan executed across connection pool shards.",
    "Step 4: Real-time telemetry pipeline aggregation calculated.",
    "Step 5: Final output serialized and stream closing cleanly."
  ];

  let currentStep = 1;

  const timer = setInterval(() => {
    if (currentStep <= totalSteps) {
      const chunkData = {
        _note: `Stream Frame ${currentStep}/${totalSteps}: Flushed immediately to client socket without closing connection.`,
        step: currentStep,
        totalSteps,
        percent: Math.round((currentStep / totalSteps) * 100),
        message: stepDescriptions[currentStep - 1] || `Processing background pipeline task #${currentStep}...`,
        timestamp: new Date().toISOString()
      };

      res.write(`event: step\ndata: ${JSON.stringify(chunkData)}\n\n`);
      currentStep++;
    } else {
      clearInterval(timer);
      const donePayload = {
        _note: "Stream Completed: All chunks flushed. Server is now closing the HTTP chunked stream.",
        status: "FINISHED",
        completedAt: new Date().toISOString()
      };
      res.write(`event: done\ndata: ${JSON.stringify(donePayload)}\n\n`);
      res.end();
    }
  }, intervalMs);

  req.on('close', () => {
    clearInterval(timer);
  });
});

export default router;
