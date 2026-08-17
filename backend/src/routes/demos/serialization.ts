import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ============================================================================
 * FIRST PRINCIPLE: SERIALIZATION & DESERIALIZATION
 * 
 * 1. Serialization (Encoding):
 *    Converting in-memory data structures (objects, structs, maps) into a
 *    standard transfer format (JSON text stream, Protocol Buffers binary).
 * 
 * 2. Deserialization (Decoding):
 *    Converting received wire bytes back into native in-memory objects
 *    so business logic and database drivers can execute type-safe operations.
 * ============================================================================
 */

// 1. Interactive JSON Serialization & Deserialization Flow
router.post('/serialization/json-flow', (req: Request, res: Response) => {
  const body = req.body;
  const rawText = JSON.stringify(body || {});
  const byteLength = Buffer.byteLength(rawText, 'utf8');

  // Simulated server-side in-memory struct parsing
  const serverMemoryStruct = {
    receivedKeys: Object.keys(body || {}),
    keyCount: Object.keys(body || {}).length,
    inferredTypes: Object.fromEntries(
      Object.entries(body || {}).map(([k, v]) => [k, Array.isArray(v) ? 'array' : typeof v])
    ),
    wireSizeBytes: byteLength
  };

  return res.status(200).json({
    _explanation: "The server received JSON wire text, deserialized it into native memory, executed logic, and serialized this JSON response back over the HTTP socket.",
    clientPayloadReceived: body,
    serverMemoryInspection: serverMemoryStruct,
    serializedResponse: {
      status: "success",
      message: "Data successfully deserialized, processed, and re-serialized",
      timestamp: new Date().toISOString()
    }
  });
});

// 2. Format Comparison: JSON vs YAML vs XML vs Binary Protobuf
router.post('/serialization/format-compare', (req: Request, res: Response) => {
  const sampleData = req.body && Object.keys(req.body).length > 0 ? req.body : {
    id: 101,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    inStock: true,
    price: 45.99,
    tags: ["databases", "distributed-systems", "architecture"]
  };

  const jsonString = JSON.stringify(sampleData, null, 2);
  const jsonBytes = Buffer.byteLength(jsonString, 'utf8');

  // Simulated YAML representation
  const yamlString = `id: ${sampleData.id}\ntitle: "${sampleData.title}"\nauthor: "${sampleData.author}"\ninStock: ${sampleData.inStock}\nprice: ${sampleData.price}\ntags:\n  - databases\n  - distributed-systems\n  - architecture`;
  const yamlBytes = Buffer.byteLength(yamlString, 'utf8');

  // Simulated XML representation
  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<Book>\n  <Id>${sampleData.id}</Id>\n  <Title>${sampleData.title}</Title>\n  <Author>${sampleData.author}</Author>\n  <InStock>${sampleData.inStock}</InStock>\n  <Price>${sampleData.price}</Price>\n  <Tags>\n    <Tag>databases</Tag>\n    <Tag>distributed-systems</Tag>\n    <Tag>architecture</Tag>\n  </Tags>\n</Book>`;
  const xmlBytes = Buffer.byteLength(xmlString, 'utf8');

  // Simulated Binary Protobuf representation (compact field tags + varints + length-delimited bytes)
  // Typically 40-60% smaller than JSON
  const binaryEstimatedBytes = Math.round(jsonBytes * 0.48);

  return res.status(200).json({
    data: sampleData,
    comparison: {
      json: {
        category: "Text-Based (Universal Standard ~80% of Web APIs)",
        humanReadable: true,
        sizeBytes: jsonBytes,
        preview: jsonString
      },
      yaml: {
        category: "Text-Based (Human-friendly Configurations / Kubernetes)",
        humanReadable: true,
        sizeBytes: yamlBytes,
        preview: yamlString
      },
      xml: {
        category: "Text-Based (Verbose Legacy Enterprise / SOAP)",
        humanReadable: true,
        sizeBytes: xmlBytes,
        preview: xmlString
      },
      protobuf: {
        category: "Binary Wire Format (High-speed gRPC / Microservices)",
        humanReadable: false,
        sizeBytes: binaryEstimatedBytes,
        bandwidthSavingsVsJson: `${Math.round(((jsonBytes - binaryEstimatedBytes) / jsonBytes) * 100)}% smaller`,
        preview: `[Hex Binary Stream: 08 65 12 28 44 65 73 69 67 6e 69 6e 67... (${binaryEstimatedBytes} bytes)]`
      }
    }
  });
});

export default router;
