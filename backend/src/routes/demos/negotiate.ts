import { Router, Request, Response } from 'express';

const router = Router();

const LOCALIZED_MESSAGES: Record<string, { welcome: string; quote: string; languageName: string }> = {
  en: {
    welcome: "Welcome to Backend First Principles!",
    quote: "A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.",
    languageName: "English"
  },
  es: {
    welcome: "¡Bienvenido a Principios Fundamentales del Backend!",
    quote: "Un sistema distribuido es aquel en el que el fallo de una computadora que ni siquiera sabías que existía puede dejar inutilizable tu propia computadora.",
    languageName: "Español (Spanish)"
  },
  hi: {
    welcome: "बैकएंड फर्स्ट प्रिंसिपल्स में आपका स्वागत है!",
    quote: "एक वितरित प्रणाली वह है जिसमें किसी ऐसे कंप्यूटर की विफलता जिसके बारे में आप जानते भी नहीं थे, आपके अपने कंप्यूटर को अनुपयोगी बना सकती है।",
    languageName: "हिन्दी (Hindi)"
  },
  fr: {
    welcome: "Bienvenue aux Premiers Principes du Backend !",
    quote: "Un système distribué est un système dans lequel la panne d'un ordinateur dont vous ignoriez l'existence peut rendre votre propre ordinateur inutilisable.",
    languageName: "Français (French)"
  }
};

router.get('/negotiate', (req: Request, res: Response) => {
  const acceptHeader = req.get('accept') || 'application/json';
  const acceptLangHeader = req.get('accept-language') || 'en';
  const acceptEncoding = req.get('accept-encoding') || 'none';

  let selectedLang = 'en';
  if (acceptLangHeader.toLowerCase().includes('es')) selectedLang = 'es';
  else if (acceptLangHeader.toLowerCase().includes('hi')) selectedLang = 'hi';
  else if (acceptLangHeader.toLowerCase().includes('fr')) selectedLang = 'fr';

  const localized = LOCALIZED_MESSAGES[selectedLang] || LOCALIZED_MESSAGES.en;

  if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <_note>Content Negotiation: Rendered as XML based on Accept header '${acceptHeader}'</_note>
  <negotiation>
    <matchedLanguage>${localized.languageName}</matchedLanguage>
    <matchedContentType>application/xml</matchedContentType>
    <clientAcceptHeader>${acceptHeader}</clientAcceptHeader>
    <clientAcceptLanguage>${acceptLangHeader}</clientAcceptLanguage>
    <clientAcceptEncoding>${acceptEncoding}</clientAcceptEncoding>
  </negotiation>
  <data>
    <welcome>${localized.welcome}</welcome>
    <quote>${localized.quote}</quote>
  </data>
</response>`;
    return res.send(xmlContent);
  }

  if (acceptHeader.includes('text/plain')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const textContent = [
      `[CONTENT NEGOTIATION DEMO - PLAIN TEXT]`,
      `Note: Server matched 'Accept: text/plain'`,
      `Language: ${localized.languageName}`,
      `Welcome: ${localized.welcome}`,
      `Quote: "${localized.quote}"`,
      `Client Headers: Accept=${acceptHeader}, Lang=${acceptLangHeader}, Encoding=${acceptEncoding}`
    ].join('\n');
    return res.send(textContent);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    _note: `Content Negotiation Success: Server detected 'Accept: ${acceptHeader}' and 'Accept-Language: ${acceptLangHeader}' and tailored the response format accordingly.`,
    negotiationResult: {
      matchedContentType: "application/json",
      matchedLanguage: localized.languageName,
      languageCode: selectedLang,
      clientAccept: acceptHeader,
      clientAcceptLanguage: acceptLangHeader,
      clientAcceptEncoding: acceptEncoding
    },
    payload: {
      welcome: localized.welcome,
      quote: localized.quote,
      course: "Backend Engineering — First Principles"
    },
    tips: [
      "Try setting header 'Accept: application/xml' to receive an XML document.",
      "Try setting header 'Accept: text/plain' for a plain text document.",
      "Try setting header 'Accept-Language: es' or 'Accept-Language: hi' for localized strings."
    ]
  });
});

export default router;
