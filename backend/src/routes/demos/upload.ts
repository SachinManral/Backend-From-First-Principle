import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const contentType = req.get('content-type') || '';
  const boundaryMatch = contentType.match(/boundary=(.+)$/);
  const boundary = boundaryMatch ? boundaryMatch[1] : 'unknown';

  const file = req.file;
  const formFields = req.body;

  if (!file && Object.keys(formFields).length === 0) {
    return res.status(400).json({
      _note: "Validation Error: No multipart file or form fields received. Ensure you are sending `multipart/form-data` with a 'file' field.",
      receivedContentType: contentType,
      expectedUsage: "Send a POST request with form-data containing a 'file' key or text fields."
    });
  }

  res.json({
    _note: "Multipart Upload Processed Successfully: The server parsed the individual multi-part boundaries from the TCP stream.",
    multipartMetadata: {
      detectedBoundary: boundary,
      overallContentType: contentType,
      textFieldsReceived: formFields,
    },
    fileInfo: file ? {
      fieldName: file.fieldname,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      encoding: file.encoding,
      sizeBytes: file.size,
      sizeFormatted: `${(file.size / 1024).toFixed(2)} KB`,
      md5SampleHex: file.buffer ? file.buffer.slice(0, 16).toString('hex') : null,
    } : "(No binary file attached, only text fields)",
    explanation: "Multipart format allows sending binary buffers alongside JSON or text fields in a single HTTP request stream."
  });
});

export default router;
