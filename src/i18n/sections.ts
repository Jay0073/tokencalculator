import type { Locale } from './config';

/**
 * Copy for the home-page sections, in every supported language.
 *
 * These sections used to render only in English, which left the localised home pages at
 * three sections and 574 words against fifteen sections and 2,436 words. Everything a
 * provider publishes stays in English on purpose: model names, rates, tokenizer names,
 * file extensions and the "BPE" and "UTF-8" terms of art.
 */
export interface SectionCopy {
  measures: { eyebrow: string; title: string; lead: (models: number, providers: number, names: string) => string; body: string };
  pricing: { eyebrow: string; title: string; verified: string; intro: string; columns: { model: string; scale: string; context: string; input: string; cached: string; output: string }; footnote: string };
  pipeline: { eyebrow: string; title: string; deck: string; steps: { label: string; title: string; note: string; short: string; shortNote: string }[]; caption: string; svgTitle: string; svgDesc: string };
  files: { eyebrow: string; title: string; body: string[]; privacyLabel: string; privacy: string };
  images: { eyebrow: string; title: string; body: string[] };
  accuracy: { eyebrow: string; title: string; reviewed: string; columns: { provider: string; text: string; image: string; label: string }; methods: { localBpe: string; projection: string; tiles: string; patches: string; media: string; unavailable: string; exact: string; deterministic: string } };
  terms: { eyebrow: string; title: string; items: { term: string; definition: string }[] };
  links: { eyebrow: string; title: string; counters: { name: string; detail: string }[]; comparisonsEyebrow: string; comparisonsTitle: string; guidesEyebrow: string; guidesTitle: string };
  reviews: { eyebrow: string; title: string; intro: string; workflows: { label: string; inputs: string; title: string; detail: string }[]; cardFooter: string; workflowLabel: string; ctaStatus: string; ctaTitle: string; ctaTitleWithReviews: string; ctaBody: string; ctaButton: string; carouselLabel: string };
  stats: { models: string; providers: string; uploaded: string; verified: string };
  faq: { question: string; answer: string }[];
}

const en: SectionCopy = {
  measures: {
    eyebrow: 'What it measures',
    title: 'One input, every major provider',
    lead: (models, providers, names) => `This token calculator measures text prompts, code, structured data, readable documents, and supported images against ${models} current models from ${providers} providers: ${names}.`,
    body: 'It reports input tokens, context-window fit, and estimated input cost. Text and files stay in the browser; only public model metadata may be refreshed from Models.dev.',
  },
  pricing: {
    eyebrow: 'LLM API pricing',
    title: 'Token prices for every supported model',
    verified: 'Rates verified',
    intro: 'Cost per 1,000,000 tokens in USD, for input and output separately. Cached input is the discounted rate providers charge when a prompt prefix is reused. Paste a real prompt into the calculator above to turn these rates into a cost for your own workload.',
    columns: { model: 'Model', scale: 'Cost scale', context: 'Context window', input: 'Input / 1M', cached: 'Cached input / 1M', output: 'Output / 1M' },
    footnote: 'Rates come from the public model catalogue and refresh from the same live source the calculator uses. Long-context tiers, batch discounts, and provider-side overheads can change a real invoice. Provider documentation remains authoritative.',
  },
  pipeline: {
    eyebrow: 'Calculation pipeline',
    title: 'From input payload to token projection',
    deck: 'Computation provenance remains visible, distinguishing exact BPE tokenization from deterministic provider-calibrated projection.',
    steps: [
      { label: 'Input', title: 'Text · file · image', note: 'Read locally', short: 'Text · file · image', shortNote: 'Read locally' },
      { label: 'Method', title: 'Tokenize or estimate', note: 'Method stays visible', short: 'Tokenize', shortNote: 'or estimate' },
      { label: 'Limit', title: 'Check context fit', note: 'Warn before overflow', short: 'Context fit', shortNote: 'overflow alert' },
      { label: 'Result', title: 'Calculate input cost', note: 'Apply current rates', short: 'Input cost', shortNote: 'at current rates' },
    ],
    caption: 'Input cost = input tokens ÷ 1,000,000 × model input price.',
    svgTitle: 'Token calculation process',
    svgDesc: 'Text, documents, and images pass through a provider counting method, then context and cost calculations.',
  },
  files: {
    eyebrow: 'Document token counter',
    title: 'Calculate tokens from a PDF, Word file, codebase excerpt, or data file',
    body: [
      'Upload a text-based PDF or DOCX document instead of copying its contents page by page. TokenCalculator.dev extracts readable text inside the browser, combines it with anything in the prompt editor, and immediately recalculates every provider result.',
      'Plain text, Markdown, CSV, JSON, JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, HTML, CSS, XML, YAML, TOML, SQL, and shell files are also supported up to 12 MB per file. Scanned PDFs need OCR and are intentionally rejected rather than returning a misleading zero-token result.',
    ],
    privacyLabel: 'Privacy:',
    privacy: 'document contents never leave the device. No prompt or uploaded file is sent to a token-counting server.',
  },
  images: {
    eyebrow: 'Image token calculator',
    title: 'Estimate image tokens before sending a vision request',
    body: [
      'Add a PNG, JPEG, WebP, or GIF to compare its visual-token footprint across supported OpenAI, Claude, and Gemini models. The calculator reads width and height locally and applies the selected provider’s documented tile, patch, or media-token rule.',
      'Image tokens are added to extracted document text and pasted prompt text, so a multimodal request can be planned as one workload. If a selected model has no documented vision rule, the result says image unavailable instead of presenting a fabricated estimate.',
      'This is an image-token and cost estimate, not OCR. Pixel data is not uploaded, retained, or used to extract words from an image.',
    ],
  },
  accuracy: {
    eyebrow: 'Accuracy contract',
    title: 'Exact where possible. Labeled where estimated.',
    reviewed: 'Registry reviewed',
    columns: { provider: 'Provider', text: 'Text method', image: 'Image method', label: 'Result label' },
    methods: { localBpe: 'Local model BPE', projection: 'Provider-Calibrated UTF-8 Projection', tiles: 'Published tile rules', patches: 'Published patch rules', media: 'Published media rules', unavailable: 'Unavailable when undocumented', exact: 'Exact BPE / provider formula', deterministic: 'Deterministic projection' },
  },
  terms: {
    eyebrow: 'Useful definitions',
    title: 'The numbers behind an LLM request',
    items: [
      { term: 'Token', definition: 'A small unit of text processed by a language model. A token may be a word, part of a word, punctuation, or whitespace.' },
      { term: 'Input token', definition: 'Content sent to the model, including prompts, context, instructions, and API message structure.' },
      { term: 'Output token', definition: 'Content generated by the model. Providers normally price output separately from input.' },
      { term: 'Cached token', definition: 'Previously processed prompt content eligible for a reduced provider rate when caching rules are satisfied.' },
      { term: 'Context window', definition: 'The maximum combined input and output capacity available to a model for one request.' },
      { term: 'Price per million', definition: 'The standard API rate multiplied by token usage. Actual billing may include tiers, caching, tools, or provider-side tokens.' },
    ],
  },
  links: {
    eyebrow: 'Focused counters',
    title: 'Measure against the model you use',
    counters: [
      { name: 'OpenAI token counter', detail: 'Exact local o200k_base BPE' },
      { name: 'Claude token counter', detail: 'Provider-Calibrated UTF-8 Projection' },
      { name: 'Gemini token counter', detail: 'Text and image rules' },
      { name: 'DeepSeek token counter', detail: 'Current API pricing' },
    ],
    comparisonsEyebrow: 'Current model comparisons',
    comparisonsTitle: 'Compare cost with the same real workload',
    guidesEyebrow: 'Cost guides',
    guidesTitle: 'Compare approaches, not just models',
  },
  reviews: {
    eyebrow: 'Workload field notes',
    title: 'See what you can measure before the API call',
    intro: 'Representative planning workflows now; attributable developer reviews are added only after their wording and permission are verified.',
    cardFooter: 'Supported today in the browser-based calculator',
    workflowLabel: 'REPRESENTATIVE WORKFLOW · NOT A CUSTOMER REVIEW',
    ctaStatus: 'COMMUNITY WORKFLOW LOG',
    ctaTitle: 'Be one of the first featured developers',
    ctaTitleWithReviews: 'Add your workload to the field notes',
    ctaBody: 'Tell us what you measured, which providers you compared, and what decision the result helped you make. Published reviews include attribution and require explicit permission.',
    ctaButton: 'Share your workflow',
    carouselLabel: 'Representative TokenCalculator workflows',
    workflows: [
      { label: 'Document ingestion', inputs: 'PDF + prompt', title: 'Price a knowledge-base ingestion run', detail: 'Extract a text-based PDF locally, measure its complete payload, and compare context fit and input cost across OpenAI, Claude, Gemini, and DeepSeek.' },
      { label: 'Multimodal request', inputs: 'Image + text', title: 'Budget a vision-model request', detail: 'Combine image dimensions with prompt text, then apply documented tile, patch, or media-token rules for each supported vision model.' },
      { label: 'Code analysis', inputs: 'TS + JSON + MD', title: 'Measure a repository review payload', detail: 'Attach code, configuration, and documentation files as one workload before selecting a model with enough context capacity.' },
      { label: 'Data pipeline', inputs: 'CSV + instructions', title: 'Compare batch-processing economics', detail: 'Measure structured data and instructions together to compare provider input rates before committing a recurring workload.' },
    ],
  },
  stats: { models: 'Models priced', providers: 'Providers', uploaded: 'Content uploaded', verified: 'Rates verified' },
  faq: [
    { question: 'What is a token in an AI model?', answer: 'A token is a small unit of content processed by a language model. It may be a whole word, part of a word, punctuation, whitespace, or—in multimodal models—a unit assigned to an image. Different providers can split the same input differently.' },
    { question: 'How is LLM API input cost calculated?', answer: 'Input cost is calculated as input tokens divided by one million, multiplied by the selected model’s input price per million tokens. Provider tiers, cached input, tools, and message wrappers can affect final billing.' },
    { question: 'Does this tool upload my prompt, document, or image?', answer: 'No. Text, PDF and DOCX extraction, image-dimension reading, and token calculations run in your browser. Zero prompts, document contents, or uploaded images are sent to TokenCalculator.dev or another calculation server.' },
    { question: 'Are the token counts exact?', answer: 'OpenAI text counts use the matching local BPE encoding. Other providers are clearly labeled estimates unless they publish a deterministic local formula. Image counts use provider-published rules.' },
    { question: 'How do I count tokens in a PDF or Word document?', answer: 'Attach a text-based PDF or DOCX file and the browser extracts its readable text locally, then counts it with every selected provider model. Scanned or encrypted PDFs require OCR and are not supported.' },
    { question: 'Can I calculate image tokens and vision-model cost?', answer: 'Yes. Add a PNG, JPEG, WebP, or GIF. For supported vision models, the calculator reads its pixel dimensions locally and applies the provider-published image token formula. It reports unavailable instead of inventing a value when a provider has no documented rule.' },
    { question: 'Why can the API report a slightly different count?', answer: 'Providers can add message wrappers, system instructions, tools, or model-specific processing. The accuracy badge and methodology explain what this calculator includes.' },
  ],
};

const es: SectionCopy = {
  measures: {
    eyebrow: 'Qué mide',
    title: 'Una entrada, todos los proveedores principales',
    lead: (models, providers, names) => `Esta calculadora de tokens mide prompts de texto, código, datos estructurados, documentos legibles e imágenes compatibles frente a ${models} modelos actuales de ${providers} proveedores: ${names}.`,
    body: 'Informa los tokens de entrada, el ajuste a la ventana de contexto y el coste estimado de entrada. El texto y los archivos permanecen en el navegador; solo los metadatos públicos de los modelos pueden actualizarse desde Models.dev.',
  },
  pricing: {
    eyebrow: 'Precios de API de LLM',
    title: 'Precios por token de cada modelo compatible',
    verified: 'Tarifas verificadas el',
    intro: 'Coste por 1.000.000 de tokens en USD, para entrada y salida por separado. La entrada en caché es la tarifa reducida que cobran los proveedores cuando se reutiliza un prefijo del prompt. Pega un prompt real en la calculadora de arriba para convertir estas tarifas en el coste de tu propia carga de trabajo.',
    columns: { model: 'Modelo', scale: 'Escala de coste', context: 'Ventana de contexto', input: 'Entrada / 1M', cached: 'Entrada en caché / 1M', output: 'Salida / 1M' },
    footnote: 'Las tarifas proceden del catálogo público de modelos y se actualizan desde la misma fuente en vivo que usa la calculadora. Los tramos de contexto largo, los descuentos por lotes y los costes adicionales del proveedor pueden cambiar una factura real. La documentación del proveedor sigue siendo la referencia.',
  },
  pipeline: {
    eyebrow: 'Flujo de cálculo',
    title: 'De la carga de entrada a la proyección de tokens',
    deck: 'El origen del cálculo permanece visible y distingue la tokenización BPE exacta de la proyección determinista calibrada por proveedor.',
    steps: [
      { label: 'Entrada', title: 'Texto · archivo · imagen', note: 'Leído localmente', short: 'Texto · imagen', shortNote: 'leído en local' },
      { label: 'Método', title: 'Tokenizar o estimar', note: 'El método queda visible', short: 'Tokenizar', shortNote: 'o estimar' },
      { label: 'Límite', title: 'Comprobar el contexto', note: 'Avisa antes de desbordar', short: 'Contexto', shortNote: 'aviso de exceso' },
      { label: 'Resultado', title: 'Calcular el coste de entrada', note: 'Con las tarifas actuales', short: 'Coste de entrada', shortNote: 'tarifas actuales' },
    ],
    caption: 'Coste de entrada = tokens de entrada ÷ 1.000.000 × precio de entrada del modelo.',
    svgTitle: 'Proceso de cálculo de tokens',
    svgDesc: 'El texto, los documentos y las imágenes pasan por el método de conteo del proveedor y después por los cálculos de contexto y coste.',
  },
  files: {
    eyebrow: 'Contador de tokens de documentos',
    title: 'Calcula los tokens de un PDF, un archivo de Word, un fragmento de código o un archivo de datos',
    body: [
      'Sube un PDF o DOCX con texto en lugar de copiar su contenido página por página. TokenCalculator.dev extrae el texto legible dentro del navegador, lo combina con lo que haya en el editor de prompts y recalcula al instante el resultado de cada proveedor.',
      'También admite texto plano, Markdown, CSV, JSON, JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, HTML, CSS, XML, YAML, TOML, SQL y archivos de shell, hasta 12 MB por archivo. Los PDF escaneados necesitan OCR y se rechazan a propósito en lugar de devolver un engañoso resultado de cero tokens.',
    ],
    privacyLabel: 'Privacidad:',
    privacy: 'el contenido de los documentos nunca sale del dispositivo. Ningún prompt ni archivo subido se envía a un servidor de conteo de tokens.',
  },
  images: {
    eyebrow: 'Calculadora de tokens de imagen',
    title: 'Estima los tokens de imagen antes de enviar una petición de visión',
    body: [
      'Añade un PNG, JPEG, WebP o GIF para comparar su consumo de tokens visuales entre los modelos compatibles de OpenAI, Claude y Gemini. La calculadora lee el ancho y el alto localmente y aplica la regla documentada de mosaicos, parches o tokens de medios del proveedor seleccionado.',
      'Los tokens de imagen se suman al texto extraído de los documentos y al texto del prompt, de modo que una petición multimodal puede planificarse como una sola carga de trabajo. Si el modelo seleccionado no tiene una regla de visión documentada, el resultado indica que la imagen no está disponible en lugar de presentar una estimación inventada.',
      'Esto es una estimación de tokens y coste de imagen, no OCR. Los píxeles no se suben, no se conservan ni se usan para extraer palabras de una imagen.',
    ],
  },
  accuracy: {
    eyebrow: 'Compromiso de precisión',
    title: 'Exacto cuando se puede. Etiquetado cuando es una estimación.',
    reviewed: 'Registro revisado el',
    columns: { provider: 'Proveedor', text: 'Método de texto', image: 'Método de imagen', label: 'Etiqueta del resultado' },
    methods: { localBpe: 'BPE local del modelo', projection: 'Proyección UTF-8 calibrada por proveedor', tiles: 'Reglas de mosaico publicadas', patches: 'Reglas de parches publicadas', media: 'Reglas de medios publicadas', unavailable: 'No disponible si no está documentado', exact: 'BPE exacto / fórmula del proveedor', deterministic: 'Proyección determinista' },
  },
  terms: {
    eyebrow: 'Definiciones útiles',
    title: 'Las cifras detrás de una petición a un LLM',
    items: [
      { term: 'Token', definition: 'Una unidad pequeña de texto que procesa un modelo de lenguaje. Un token puede ser una palabra, parte de una palabra, un signo de puntuación o un espacio.' },
      { term: 'Token de entrada', definition: 'Contenido enviado al modelo, incluidos prompts, contexto, instrucciones y la estructura del mensaje de la API.' },
      { term: 'Token de salida', definition: 'Contenido generado por el modelo. Los proveedores suelen cobrar la salida por separado de la entrada.' },
      { term: 'Token en caché', definition: 'Contenido del prompt ya procesado que puede acogerse a una tarifa reducida cuando se cumplen las reglas de caché.' },
      { term: 'Ventana de contexto', definition: 'La capacidad máxima combinada de entrada y salida que un modelo admite en una sola petición.' },
      { term: 'Precio por millón', definition: 'La tarifa estándar de la API multiplicada por el uso de tokens. La factura real puede incluir tramos, caché, herramientas o tokens añadidos por el proveedor.' },
    ],
  },
  links: {
    eyebrow: 'Contadores específicos',
    title: 'Mide con el modelo que realmente usas',
    counters: [
      { name: 'Contador de tokens de OpenAI', detail: 'BPE o200k_base local y exacto' },
      { name: 'Contador de tokens de Claude', detail: 'Proyección UTF-8 calibrada por proveedor' },
      { name: 'Contador de tokens de Gemini', detail: 'Reglas de texto e imagen' },
      { name: 'Contador de tokens de DeepSeek', detail: 'Precios actuales de la API' },
    ],
    comparisonsEyebrow: 'Comparativas de modelos actuales',
    comparisonsTitle: 'Compara el coste con la misma carga de trabajo real',
    guidesEyebrow: 'Guías de coste',
    guidesTitle: 'Compara enfoques, no solo modelos',
  },
  reviews: {
    eyebrow: 'Notas de campo',
    title: 'Comprueba qué puedes medir antes de la llamada a la API',
    intro: 'Por ahora, flujos de planificación representativos; las reseñas atribuibles de desarrolladores se añaden solo tras verificar su redacción y su permiso.',
    cardFooter: 'Disponible hoy en la calculadora del navegador',
    workflowLabel: 'FLUJO REPRESENTATIVO · NO ES UNA RESEÑA DE CLIENTE',
    ctaStatus: 'REGISTRO DE FLUJOS DE LA COMUNIDAD',
    ctaTitle: 'Sé uno de los primeros desarrolladores destacados',
    ctaTitleWithReviews: 'Añade tu carga de trabajo a las notas de campo',
    ctaBody: 'Cuéntanos qué mediste, qué proveedores comparaste y qué decisión te ayudó a tomar el resultado. Las reseñas publicadas incluyen atribución y requieren permiso explícito.',
    ctaButton: 'Comparte tu flujo de trabajo',
    carouselLabel: 'Flujos de trabajo representativos de TokenCalculator',
    workflows: [
      { label: 'Ingesta de documentos', inputs: 'PDF + prompt', title: 'Calcula el precio de una ingesta de base de conocimiento', detail: 'Extrae un PDF con texto localmente, mide su carga completa y compara el ajuste de contexto y el coste de entrada entre OpenAI, Claude, Gemini y DeepSeek.' },
      { label: 'Petición multimodal', inputs: 'Imagen + texto', title: 'Presupuesta una petición a un modelo de visión', detail: 'Combina las dimensiones de la imagen con el texto del prompt y aplica las reglas documentadas de mosaicos, parches o tokens de medios de cada modelo de visión compatible.' },
      { label: 'Análisis de código', inputs: 'TS + JSON + MD', title: 'Mide la carga de una revisión de repositorio', detail: 'Adjunta archivos de código, configuración y documentación como una sola carga de trabajo antes de elegir un modelo con suficiente capacidad de contexto.' },
      { label: 'Pipeline de datos', inputs: 'CSV + instrucciones', title: 'Compara la economía del procesamiento por lotes', detail: 'Mide juntos los datos estructurados y las instrucciones para comparar las tarifas de entrada de los proveedores antes de comprometerte con una carga recurrente.' },
    ],
  },
  stats: { models: 'Modelos con precio', providers: 'Proveedores', uploaded: 'Contenido subido', verified: 'Tarifas verificadas' },
  faq: [
    { question: '¿Qué es un token en un modelo de IA?', answer: 'Un token es una unidad pequeña de contenido que procesa un modelo de lenguaje. Puede ser una palabra entera, parte de una palabra, un signo de puntuación, un espacio o, en modelos multimodales, una unidad asignada a una imagen. Cada proveedor puede dividir la misma entrada de forma distinta.' },
    { question: '¿Cómo se calcula el coste de entrada de una API de LLM?', answer: 'El coste de entrada se calcula dividiendo los tokens de entrada entre un millón y multiplicando por el precio de entrada por millón del modelo seleccionado. Los tramos del proveedor, la entrada en caché, las herramientas y los envoltorios de mensajes pueden afectar a la factura final.' },
    { question: '¿Esta herramienta sube mi prompt, documento o imagen?', answer: 'No. La extracción de texto, PDF y DOCX, la lectura de las dimensiones de la imagen y el cálculo de tokens se ejecutan en tu navegador. No se envía ningún prompt, contenido de documento ni imagen a TokenCalculator.dev ni a otro servidor de cálculo.' },
    { question: '¿Los recuentos de tokens son exactos?', answer: 'Los recuentos de texto de OpenAI usan la codificación BPE local correspondiente. Los demás proveedores se etiquetan claramente como estimaciones, salvo que publiquen una fórmula local determinista. Los recuentos de imagen usan las reglas publicadas por cada proveedor.' },
    { question: '¿Cómo cuento los tokens de un PDF o un documento de Word?', answer: 'Adjunta un PDF o DOCX con texto y el navegador extrae su texto legible localmente, para después contarlo con cada modelo seleccionado. Los PDF escaneados o cifrados necesitan OCR y no son compatibles.' },
    { question: '¿Puedo calcular tokens de imagen y el coste de un modelo de visión?', answer: 'Sí. Añade un PNG, JPEG, WebP o GIF. Para los modelos de visión compatibles, la calculadora lee sus dimensiones localmente y aplica la fórmula de tokens de imagen publicada por el proveedor. Cuando un proveedor no publica una regla, indica que no está disponible en lugar de inventar un valor.' },
    { question: '¿Por qué la API puede informar un recuento ligeramente distinto?', answer: 'Los proveedores pueden añadir envoltorios de mensajes, instrucciones de sistema, herramientas o procesamiento propio del modelo. La etiqueta de precisión y la metodología explican qué incluye esta calculadora.' },
  ],
};

const de: SectionCopy = {
  measures: {
    eyebrow: 'Was gemessen wird',
    title: 'Eine Eingabe, alle großen Anbieter',
    lead: (models, providers, names) => `Dieser Token-Rechner misst Text-Prompts, Code, strukturierte Daten, lesbare Dokumente und unterstützte Bilder gegen ${models} aktuelle Modelle von ${providers} Anbietern: ${names}.`,
    body: 'Er zeigt Eingabe-Tokens, die Passung zum Kontextfenster und die geschätzten Eingabekosten. Text und Dateien bleiben im Browser; nur öffentliche Modell-Metadaten können von Models.dev aktualisiert werden.',
  },
  pricing: {
    eyebrow: 'LLM-API-Preise',
    title: 'Token-Preise für jedes unterstützte Modell',
    verified: 'Preise geprüft am',
    intro: 'Kosten pro 1.000.000 Tokens in USD, getrennt nach Eingabe und Ausgabe. Zwischengespeicherte Eingabe ist der ermäßigte Preis, den Anbieter berechnen, wenn ein Prompt-Präfix wiederverwendet wird. Füge oben einen echten Prompt ein, um aus diesen Preisen die Kosten deiner eigenen Arbeitslast zu machen.',
    columns: { model: 'Modell', scale: 'Kostenskala', context: 'Kontextfenster', input: 'Eingabe / 1M', cached: 'Zwischengespeichert / 1M', output: 'Ausgabe / 1M' },
    footnote: 'Die Preise stammen aus dem öffentlichen Modellkatalog und werden aus derselben Live-Quelle aktualisiert, die auch der Rechner nutzt. Stufen für langen Kontext, Batch-Rabatte und anbieterseitige Zusatzkosten können eine echte Rechnung verändern. Maßgeblich bleibt die Dokumentation des Anbieters.',
  },
  pipeline: {
    eyebrow: 'Berechnungsablauf',
    title: 'Von der Eingabe zur Token-Projektion',
    deck: 'Die Herkunft jeder Zahl bleibt sichtbar und unterscheidet exakte BPE-Tokenisierung von deterministischer, anbieterkalibrierter Projektion.',
    steps: [
      { label: 'Eingabe', title: 'Text · Datei · Bild', note: 'Lokal gelesen', short: 'Text · Bild', shortNote: 'lokal gelesen' },
      { label: 'Methode', title: 'Tokenisieren oder schätzen', note: 'Methode bleibt sichtbar', short: 'Tokenisieren', shortNote: 'oder schätzen' },
      { label: 'Grenze', title: 'Kontext prüfen', note: 'Warnung vor Überlauf', short: 'Kontext', shortNote: 'mit Warnung' },
      { label: 'Ergebnis', title: 'Eingabekosten berechnen', note: 'Mit aktuellen Preisen', short: 'Eingabekosten', shortNote: 'aktuelle Preise' },
    ],
    caption: 'Eingabekosten = Eingabe-Tokens ÷ 1.000.000 × Eingabepreis des Modells.',
    svgTitle: 'Ablauf der Token-Berechnung',
    svgDesc: 'Text, Dokumente und Bilder durchlaufen die Zählmethode des Anbieters und danach die Berechnung von Kontext und Kosten.',
  },
  files: {
    eyebrow: 'Token-Zähler für Dokumente',
    title: 'Tokens aus PDF, Word-Datei, Code-Auszug oder Datendatei berechnen',
    body: [
      'Lade ein textbasiertes PDF oder DOCX hoch, statt den Inhalt Seite für Seite zu kopieren. TokenCalculator.dev extrahiert den lesbaren Text im Browser, verbindet ihn mit allem im Prompt-Editor und berechnet sofort jedes Anbieterergebnis neu.',
      'Unterstützt werden außerdem Text, Markdown, CSV, JSON, JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, HTML, CSS, XML, YAML, TOML, SQL und Shell-Dateien bis 12 MB pro Datei. Gescannte PDFs brauchen OCR und werden bewusst abgelehnt, statt ein irreführendes Ergebnis von null Tokens zu liefern.',
    ],
    privacyLabel: 'Datenschutz:',
    privacy: 'Dokumentinhalte verlassen das Gerät nie. Kein Prompt und keine hochgeladene Datei geht an einen Server zum Token-Zählen.',
  },
  images: {
    eyebrow: 'Bild-Token-Rechner',
    title: 'Bild-Tokens schätzen, bevor du eine Vision-Anfrage sendest',
    body: [
      'Füge ein PNG, JPEG, WebP oder GIF hinzu, um seinen Token-Bedarf über die unterstützten Modelle von OpenAI, Claude und Gemini zu vergleichen. Der Rechner liest Breite und Höhe lokal und wendet die dokumentierte Kachel-, Patch- oder Medien-Token-Regel des gewählten Anbieters an.',
      'Bild-Tokens werden zum extrahierten Dokumenttext und zum eingefügten Prompt-Text addiert, sodass sich eine multimodale Anfrage als eine Arbeitslast planen lässt. Fehlt einem Modell die dokumentierte Vision-Regel, meldet das Ergebnis Bild nicht verfügbar, statt eine erfundene Schätzung zu zeigen.',
      'Das ist eine Schätzung von Bild-Tokens und Kosten, kein OCR. Pixeldaten werden nicht hochgeladen, nicht gespeichert und nicht zum Auslesen von Wörtern aus einem Bild verwendet.',
    ],
  },
  accuracy: {
    eyebrow: 'Genauigkeitsversprechen',
    title: 'Exakt, wo es geht. Gekennzeichnet, wo geschätzt wird.',
    reviewed: 'Katalog geprüft am',
    columns: { provider: 'Anbieter', text: 'Textmethode', image: 'Bildmethode', label: 'Ergebnis-Kennzeichnung' },
    methods: { localBpe: 'Lokales Modell-BPE', projection: 'Anbieterkalibrierte UTF-8-Projektion', tiles: 'Veröffentlichte Kachelregeln', patches: 'Veröffentlichte Patch-Regeln', media: 'Veröffentlichte Medienregeln', unavailable: 'Nicht verfügbar, wenn undokumentiert', exact: 'Exaktes BPE / Anbieterformel', deterministic: 'Deterministische Projektion' },
  },
  terms: {
    eyebrow: 'Nützliche Begriffe',
    title: 'Die Zahlen hinter einer LLM-Anfrage',
    items: [
      { term: 'Token', definition: 'Eine kleine Texteinheit, die ein Sprachmodell verarbeitet. Ein Token kann ein Wort, ein Wortteil, ein Satzzeichen oder ein Leerzeichen sein.' },
      { term: 'Eingabe-Token', definition: 'Inhalt, der an das Modell geht: Prompts, Kontext, Anweisungen und die Nachrichtenstruktur der API.' },
      { term: 'Ausgabe-Token', definition: 'Vom Modell erzeugter Inhalt. Anbieter berechnen die Ausgabe in der Regel getrennt von der Eingabe.' },
      { term: 'Zwischengespeichertes Token', definition: 'Bereits verarbeiteter Prompt-Inhalt, für den ein ermäßigter Preis gilt, wenn die Caching-Regeln erfüllt sind.' },
      { term: 'Kontextfenster', definition: 'Die maximale gemeinsame Kapazität für Eingabe und Ausgabe, die ein Modell in einer Anfrage hat.' },
      { term: 'Preis pro Million', definition: 'Der Standardpreis der API multipliziert mit dem Token-Verbrauch. Die echte Rechnung kann Stufen, Caching, Tools oder anbieterseitige Tokens enthalten.' },
    ],
  },
  links: {
    eyebrow: 'Gezielte Zähler',
    title: 'Mit dem Modell messen, das du wirklich nutzt',
    counters: [
      { name: 'OpenAI Token-Zähler', detail: 'Exaktes lokales o200k_base-BPE' },
      { name: 'Claude Token-Zähler', detail: 'Anbieterkalibrierte UTF-8-Projektion' },
      { name: 'Gemini Token-Zähler', detail: 'Text- und Bildregeln' },
      { name: 'DeepSeek Token-Zähler', detail: 'Aktuelle API-Preise' },
    ],
    comparisonsEyebrow: 'Aktuelle Modellvergleiche',
    comparisonsTitle: 'Kosten mit derselben echten Arbeitslast vergleichen',
    guidesEyebrow: 'Kostenratgeber',
    guidesTitle: 'Ansätze vergleichen, nicht nur Modelle',
  },
  reviews: {
    eyebrow: 'Notizen aus der Praxis',
    title: 'Sieh, was sich vor dem API-Aufruf messen lässt',
    intro: 'Vorerst beispielhafte Planungsabläufe; namentliche Entwicklerstimmen kommen erst dazu, wenn Wortlaut und Einverständnis geprüft sind.',
    cardFooter: 'Heute schon im Browser-Rechner möglich',
    workflowLabel: 'BEISPIELHAFTER ABLAUF · KEINE KUNDENSTIMME',
    ctaStatus: 'LOGBUCH DER COMMUNITY',
    ctaTitle: 'Sei eine der ersten vorgestellten Entwicklerstimmen',
    ctaTitleWithReviews: 'Ergänze deine Arbeitslast in den Praxisnotizen',
    ctaBody: 'Schreib uns, was du gemessen hast, welche Anbieter du verglichen hast und welche Entscheidung das Ergebnis möglich gemacht hat. Veröffentlichte Stimmen werden namentlich genannt und brauchen eine ausdrückliche Erlaubnis.',
    ctaButton: 'Deinen Ablauf teilen',
    carouselLabel: 'Beispielhafte TokenCalculator-Abläufe',
    workflows: [
      { label: 'Dokument-Ingest', inputs: 'PDF + Prompt', title: 'Kosten eines Wissensbasis-Ingests bestimmen', detail: 'Ein textbasiertes PDF lokal auslesen, die vollständige Last messen und Kontextpassung und Eingabekosten über OpenAI, Claude, Gemini und DeepSeek vergleichen.' },
      { label: 'Multimodale Anfrage', inputs: 'Bild + Text', title: 'Eine Vision-Anfrage budgetieren', detail: 'Bildmaße mit Prompt-Text verbinden und für jedes unterstützte Vision-Modell die dokumentierten Kachel-, Patch- oder Medien-Token-Regeln anwenden.' },
      { label: 'Code-Analyse', inputs: 'TS + JSON + MD', title: 'Die Last eines Repository-Reviews messen', detail: 'Code, Konfiguration und Dokumentation als eine Arbeitslast anhängen, bevor ein Modell mit ausreichendem Kontext gewählt wird.' },
      { label: 'Datenpipeline', inputs: 'CSV + Anweisungen', title: 'Die Ökonomie der Batch-Verarbeitung vergleichen', detail: 'Strukturierte Daten und Anweisungen gemeinsam messen, um Eingabepreise der Anbieter zu vergleichen, bevor eine wiederkehrende Last festgelegt wird.' },
    ],
  },
  stats: { models: 'Modelle mit Preis', providers: 'Anbieter', uploaded: 'Hochgeladene Inhalte', verified: 'Preise geprüft' },
  faq: [
    { question: 'Was ist ein Token in einem KI-Modell?', answer: 'Ein Token ist eine kleine Inhaltseinheit, die ein Sprachmodell verarbeitet. Es kann ein ganzes Wort sein, ein Wortteil, ein Satzzeichen, ein Leerzeichen oder, in multimodalen Modellen, eine einem Bild zugeordnete Einheit. Verschiedene Anbieter können dieselbe Eingabe unterschiedlich zerlegen.' },
    { question: 'Wie werden die Eingabekosten einer LLM-API berechnet?', answer: 'Die Eingabekosten ergeben sich aus den Eingabe-Tokens geteilt durch eine Million, multipliziert mit dem Eingabepreis des gewählten Modells pro Million Tokens. Anbieterstufen, zwischengespeicherte Eingabe, Tools und Nachrichtenhüllen können die endgültige Rechnung beeinflussen.' },
    { question: 'Lädt dieses Werkzeug meinen Prompt, mein Dokument oder mein Bild hoch?', answer: 'Nein. Text-, PDF- und DOCX-Extraktion, das Lesen der Bildmaße und die Token-Berechnung laufen in deinem Browser. Weder Prompts noch Dokumentinhalte oder hochgeladene Bilder gehen an TokenCalculator.dev oder einen anderen Rechenserver.' },
    { question: 'Sind die Token-Zahlen exakt?', answer: 'Texte für OpenAI werden mit der passenden lokalen BPE-Kodierung gezählt. Andere Anbieter sind klar als Schätzung gekennzeichnet, solange sie keine deterministische lokale Formel veröffentlichen. Bildzahlen folgen den veröffentlichten Regeln der Anbieter.' },
    { question: 'Wie zähle ich Tokens in einem PDF oder Word-Dokument?', answer: 'Hänge ein textbasiertes PDF oder DOCX an; der Browser extrahiert den lesbaren Text lokal und zählt ihn mit jedem gewählten Modell. Gescannte oder verschlüsselte PDFs brauchen OCR und werden nicht unterstützt.' },
    { question: 'Kann ich Bild-Tokens und die Kosten eines Vision-Modells berechnen?', answer: 'Ja. Füge ein PNG, JPEG, WebP oder GIF hinzu. Für unterstützte Vision-Modelle liest der Rechner die Pixelmaße lokal und wendet die vom Anbieter veröffentlichte Formel an. Fehlt eine dokumentierte Regel, meldet er nicht verfügbar, statt einen Wert zu erfinden.' },
    { question: 'Warum meldet die API manchmal eine leicht andere Zahl?', answer: 'Anbieter können Nachrichtenhüllen, Systemanweisungen, Tools oder modellspezifische Verarbeitung hinzufügen. Das Genauigkeits-Label und die Methodik erklären, was dieser Rechner einschließt.' },
  ],
};

const ptBR: SectionCopy = {
  measures: {
    eyebrow: 'O que ela mede',
    title: 'Uma entrada, todos os principais provedores',
    lead: (models, providers, names) => `Esta calculadora de tokens mede prompts de texto, código, dados estruturados, documentos legíveis e imagens compatíveis em ${models} modelos atuais de ${providers} provedores: ${names}.`,
    body: 'Ela informa os tokens de entrada, o encaixe na janela de contexto e o custo estimado de entrada. O texto e os arquivos ficam no navegador; apenas os metadados públicos dos modelos podem ser atualizados a partir do Models.dev.',
  },
  pricing: {
    eyebrow: 'Preços de API de LLM',
    title: 'Preço por token de cada modelo compatível',
    verified: 'Tarifas verificadas em',
    intro: 'Custo por 1.000.000 de tokens em USD, separando entrada e saída. Entrada em cache é a tarifa reduzida que os provedores cobram quando um prefixo do prompt é reaproveitado. Cole um prompt real na calculadora acima para transformar estas tarifas no custo da sua própria carga de trabalho.',
    columns: { model: 'Modelo', scale: 'Escala de custo', context: 'Janela de contexto', input: 'Entrada / 1M', cached: 'Entrada em cache / 1M', output: 'Saída / 1M' },
    footnote: 'As tarifas vêm do catálogo público de modelos e são atualizadas pela mesma fonte ao vivo que a calculadora usa. Faixas de contexto longo, descontos em lote e custos adicionais do provedor podem mudar uma fatura real. A documentação do provedor continua sendo a referência.',
  },
  pipeline: {
    eyebrow: 'Fluxo de cálculo',
    title: 'Da carga de entrada à projeção de tokens',
    deck: 'A origem de cada número continua visível, separando a tokenização BPE exata da projeção determinística calibrada por provedor.',
    steps: [
      { label: 'Entrada', title: 'Texto · arquivo · imagem', note: 'Lido localmente', short: 'Texto · imagem', shortNote: 'lido localmente' },
      { label: 'Método', title: 'Tokenizar ou estimar', note: 'O método fica visível', short: 'Tokenizar', shortNote: 'ou estimar' },
      { label: 'Limite', title: 'Conferir o contexto', note: 'Avisa antes de estourar', short: 'Contexto', shortNote: 'aviso de estouro' },
      { label: 'Resultado', title: 'Calcular o custo de entrada', note: 'Com as tarifas atuais', short: 'Custo de entrada', shortNote: 'tarifas atuais' },
    ],
    caption: 'Custo de entrada = tokens de entrada ÷ 1.000.000 × preço de entrada do modelo.',
    svgTitle: 'Processo de cálculo de tokens',
    svgDesc: 'Texto, documentos e imagens passam pelo método de contagem do provedor e depois pelos cálculos de contexto e custo.',
  },
  files: {
    eyebrow: 'Contador de tokens de documentos',
    title: 'Calcule os tokens de um PDF, arquivo do Word, trecho de código ou arquivo de dados',
    body: [
      'Envie um PDF ou DOCX com texto em vez de copiar o conteúdo página por página. O TokenCalculator.dev extrai o texto legível dentro do navegador, junta com o que estiver no editor de prompt e recalcula na hora o resultado de cada provedor.',
      'Também há suporte para texto, Markdown, CSV, JSON, JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, HTML, CSS, XML, YAML, TOML, SQL e arquivos de shell, até 12 MB por arquivo. PDFs digitalizados precisam de OCR e são recusados de propósito, em vez de devolver um resultado enganoso de zero tokens.',
    ],
    privacyLabel: 'Privacidade:',
    privacy: 'o conteúdo dos documentos nunca sai do dispositivo. Nenhum prompt ou arquivo enviado vai para um servidor de contagem de tokens.',
  },
  images: {
    eyebrow: 'Calculadora de tokens de imagem',
    title: 'Estime os tokens de imagem antes de enviar uma requisição de visão',
    body: [
      'Adicione um PNG, JPEG, WebP ou GIF para comparar o consumo de tokens visuais entre os modelos compatíveis da OpenAI, Claude e Gemini. A calculadora lê a largura e a altura localmente e aplica a regra documentada de blocos, patches ou tokens de mídia do provedor escolhido.',
      'Os tokens de imagem são somados ao texto extraído dos documentos e ao texto do prompt, de modo que uma requisição multimodal pode ser planejada como uma única carga de trabalho. Se o modelo escolhido não tiver uma regra de visão documentada, o resultado informa que a imagem não está disponível, em vez de apresentar uma estimativa inventada.',
      'Isto é uma estimativa de tokens e custo de imagem, não OCR. Os pixels não são enviados, não são guardados e não são usados para extrair palavras de uma imagem.',
    ],
  },
  accuracy: {
    eyebrow: 'Compromisso de precisão',
    title: 'Exato quando dá. Rotulado quando é estimativa.',
    reviewed: 'Catálogo revisado em',
    columns: { provider: 'Provedor', text: 'Método de texto', image: 'Método de imagem', label: 'Rótulo do resultado' },
    methods: { localBpe: 'BPE local do modelo', projection: 'Projeção UTF-8 calibrada por provedor', tiles: 'Regras de bloco publicadas', patches: 'Regras de patch publicadas', media: 'Regras de mídia publicadas', unavailable: 'Indisponível quando não documentado', exact: 'BPE exato / fórmula do provedor', deterministic: 'Projeção determinística' },
  },
  terms: {
    eyebrow: 'Definições úteis',
    title: 'Os números por trás de uma requisição a um LLM',
    items: [
      { term: 'Token', definition: 'Uma unidade pequena de texto processada por um modelo de linguagem. Um token pode ser uma palavra, parte de uma palavra, pontuação ou espaço.' },
      { term: 'Token de entrada', definition: 'Conteúdo enviado ao modelo, incluindo prompts, contexto, instruções e a estrutura de mensagem da API.' },
      { term: 'Token de saída', definition: 'Conteúdo gerado pelo modelo. Os provedores normalmente cobram a saída separadamente da entrada.' },
      { term: 'Token em cache', definition: 'Conteúdo de prompt já processado que pode receber uma tarifa reduzida quando as regras de cache são atendidas.' },
      { term: 'Janela de contexto', definition: 'A capacidade máxima combinada de entrada e saída que um modelo tem em uma requisição.' },
      { term: 'Preço por milhão', definition: 'A tarifa padrão da API multiplicada pelo uso de tokens. A cobrança real pode incluir faixas, cache, ferramentas ou tokens criados pelo provedor.' },
    ],
  },
  links: {
    eyebrow: 'Contadores específicos',
    title: 'Meça com o modelo que você realmente usa',
    counters: [
      { name: 'Contador de tokens da OpenAI', detail: 'BPE o200k_base local e exato' },
      { name: 'Contador de tokens do Claude', detail: 'Projeção UTF-8 calibrada por provedor' },
      { name: 'Contador de tokens do Gemini', detail: 'Regras de texto e imagem' },
      { name: 'Contador de tokens da DeepSeek', detail: 'Preços atuais da API' },
    ],
    comparisonsEyebrow: 'Comparações de modelos atuais',
    comparisonsTitle: 'Compare o custo com a mesma carga de trabalho real',
    guidesEyebrow: 'Guias de custo',
    guidesTitle: 'Compare abordagens, não apenas modelos',
  },
  reviews: {
    eyebrow: 'Notas de campo',
    title: 'Veja o que dá para medir antes da chamada à API',
    intro: 'Por enquanto, fluxos de planejamento representativos; avaliações atribuíveis de desenvolvedores entram apenas depois que o texto e a permissão forem verificados.',
    cardFooter: 'Já disponível na calculadora do navegador',
    workflowLabel: 'FLUXO REPRESENTATIVO · NÃO É AVALIAÇÃO DE CLIENTE',
    ctaStatus: 'REGISTRO DE FLUXOS DA COMUNIDADE',
    ctaTitle: 'Seja um dos primeiros desenvolvedores em destaque',
    ctaTitleWithReviews: 'Acrescente sua carga de trabalho às notas de campo',
    ctaBody: 'Conte o que você mediu, quais provedores comparou e qual decisão o resultado ajudou a tomar. As avaliações publicadas incluem atribuição e exigem permissão explícita.',
    ctaButton: 'Compartilhe seu fluxo',
    carouselLabel: 'Fluxos de trabalho representativos do TokenCalculator',
    workflows: [
      { label: 'Ingestão de documentos', inputs: 'PDF + prompt', title: 'Precifique uma ingestão de base de conhecimento', detail: 'Extraia um PDF com texto localmente, meça a carga completa e compare o encaixe de contexto e o custo de entrada entre OpenAI, Claude, Gemini e DeepSeek.' },
      { label: 'Requisição multimodal', inputs: 'Imagem + texto', title: 'Faça o orçamento de uma requisição de visão', detail: 'Combine as dimensões da imagem com o texto do prompt e aplique as regras documentadas de blocos, patches ou tokens de mídia de cada modelo de visão compatível.' },
      { label: 'Análise de código', inputs: 'TS + JSON + MD', title: 'Meça a carga de uma revisão de repositório', detail: 'Anexe arquivos de código, configuração e documentação como uma única carga de trabalho antes de escolher um modelo com contexto suficiente.' },
      { label: 'Pipeline de dados', inputs: 'CSV + instruções', title: 'Compare a economia do processamento em lote', detail: 'Meça dados estruturados e instruções juntos para comparar as tarifas de entrada dos provedores antes de assumir uma carga recorrente.' },
    ],
  },
  stats: { models: 'Modelos precificados', providers: 'Provedores', uploaded: 'Conteúdo enviado', verified: 'Tarifas verificadas' },
  faq: [
    { question: 'O que é um token em um modelo de IA?', answer: 'Um token é uma unidade pequena de conteúdo processada por um modelo de linguagem. Pode ser uma palavra inteira, parte de uma palavra, pontuação, espaço ou, em modelos multimodais, uma unidade atribuída a uma imagem. Provedores diferentes podem dividir a mesma entrada de formas diferentes.' },
    { question: 'Como se calcula o custo de entrada de uma API de LLM?', answer: 'O custo de entrada é calculado dividindo os tokens de entrada por um milhão e multiplicando pelo preço de entrada por milhão do modelo escolhido. Faixas do provedor, entrada em cache, ferramentas e envelopes de mensagem podem afetar a cobrança final.' },
    { question: 'Esta ferramenta envia meu prompt, documento ou imagem?', answer: 'Não. A extração de texto, PDF e DOCX, a leitura das dimensões da imagem e o cálculo dos tokens acontecem no seu navegador. Nenhum prompt, conteúdo de documento ou imagem é enviado ao TokenCalculator.dev nem a outro servidor de cálculo.' },
    { question: 'As contagens de tokens são exatas?', answer: 'As contagens de texto da OpenAI usam a codificação BPE local correspondente. Os demais provedores são claramente rotulados como estimativa, a não ser que publiquem uma fórmula local determinística. As contagens de imagem seguem as regras publicadas por cada provedor.' },
    { question: 'Como conto os tokens de um PDF ou documento do Word?', answer: 'Anexe um PDF ou DOCX com texto: o navegador extrai o texto legível localmente e conta com cada modelo escolhido. PDFs digitalizados ou criptografados precisam de OCR e não são suportados.' },
    { question: 'Dá para calcular tokens de imagem e o custo de um modelo de visão?', answer: 'Sim. Adicione um PNG, JPEG, WebP ou GIF. Para modelos de visão compatíveis, a calculadora lê as dimensões localmente e aplica a fórmula de tokens de imagem publicada pelo provedor. Quando não existe regra publicada, ela informa indisponível em vez de inventar um valor.' },
    { question: 'Por que a API às vezes relata uma contagem um pouco diferente?', answer: 'Os provedores podem acrescentar envelopes de mensagem, instruções de sistema, ferramentas ou processamento próprio do modelo. O rótulo de precisão e a metodologia explicam o que esta calculadora inclui.' },
  ],
};

const ja: SectionCopy = {
  measures: {
    eyebrow: '測定できるもの',
    title: '1つの入力を、主要プロバイダーすべてで',
    lead: (models, providers, names) => `このトークン計算ツールは、テキストのプロンプト、コード、構造化データ、読み取り可能な文書、対応画像を、${providers}社の${models}モデルで測定します: ${names}。`,
    body: '入力トークン数、コンテキストウィンドウへの収まり、推定入力コストを表示します。テキストとファイルはブラウザ内に留まり、Models.devから更新されるのは公開モデル情報のみです。',
  },
  pricing: {
    eyebrow: 'LLM APIの料金',
    title: '対応モデルごとのトークン料金',
    verified: '料金の確認日',
    intro: '入力と出力それぞれについて、100万トークンあたりの米ドル費用です。キャッシュ入力は、プロンプトの先頭部分を再利用したときに適用される割引料金です。上の計算ツールに実際のプロンプトを貼り付けると、この料金が自分の処理内容での費用に変わります。',
    columns: { model: 'モデル', scale: 'コスト目盛り', context: 'コンテキストウィンドウ', input: '入力 / 100万', cached: 'キャッシュ入力 / 100万', output: '出力 / 100万' },
    footnote: '料金は公開モデルカタログから取得し、計算ツールと同じライブソースで更新されます。長文コンテキストの段階料金、バッチ割引、プロバイダー側の追加分により実際の請求額は変わることがあります。最終的な根拠は各プロバイダーの公式ドキュメントです。',
  },
  pipeline: {
    eyebrow: '計算の流れ',
    title: '入力データからトークン予測まで',
    deck: '計算の出どころは常に表示され、正確なBPEトークン化と、プロバイダー別に較正した決定論的な推定を区別します。',
    steps: [
      { label: '入力', title: 'テキスト · ファイル · 画像', note: 'ローカルで読み取り', short: 'テキスト・画像', shortNote: 'ローカルで読み取り' },
      { label: '方式', title: 'トークン化または推定', note: '方式は常に表示', short: 'トークン化', shortNote: 'または推定' },
      { label: '上限', title: 'コンテキストを確認', note: '超過前に警告', short: 'コンテキスト', shortNote: '超過前に警告' },
      { label: '結果', title: '入力コストを計算', note: '現在の料金で', short: '入力コスト', shortNote: '現在の料金で' },
    ],
    caption: '入力コスト = 入力トークン数 ÷ 1,000,000 × モデルの入力単価。',
    svgTitle: 'トークン計算の流れ',
    svgDesc: 'テキスト、文書、画像はプロバイダーごとの計数方式を経て、コンテキストとコストの計算に進みます。',
  },
  files: {
    eyebrow: '文書トークンカウンター',
    title: 'PDF、Wordファイル、コード、データファイルのトークンを計算',
    body: [
      'ページごとに内容をコピーする代わりに、テキストを含むPDFやDOCXをそのまま読み込めます。TokenCalculator.devはブラウザ内で読み取り可能なテキストを抽出し、プロンプト欄の内容と合わせて、各プロバイダーの結果をすぐに再計算します。',
      'テキスト、Markdown、CSV、JSON、JavaScript、TypeScript、Python、Go、Rust、Java、C/C++、HTML、CSS、XML、YAML、TOML、SQL、シェルスクリプトにも対応し、1ファイルあたり12 MBまでです。スキャンしたPDFはOCRが必要なため、0トークンという誤解を招く結果を返さず、意図的に拒否します。',
    ],
    privacyLabel: 'プライバシー:',
    privacy: '文書の内容が端末から出ることはありません。プロンプトもアップロードしたファイルも、トークン集計サーバーには送信されません。',
  },
  images: {
    eyebrow: '画像トークン計算ツール',
    title: '画像リクエストを送る前にトークン数を見積もる',
    body: [
      'PNG、JPEG、WebP、GIFを追加すると、OpenAI、Claude、Geminiの対応モデル間で画像トークンの消費量を比較できます。計算ツールは幅と高さをローカルで読み取り、選択したプロバイダーが公開しているタイル、パッチ、メディアトークンの規則を適用します。',
      '画像トークンは、抽出した文書テキストや貼り付けたプロンプトのトークンに加算されるため、マルチモーダルなリクエストを1つの処理としてまとめて見積もれます。選択したモデルに公開された画像規則がない場合は、推測値を出さずに「画像は利用不可」と表示します。',
      'これは画像トークンとコストの見積もりであり、OCRではありません。画素データがアップロードされたり、保存されたり、画像から文字を読み取るために使われたりすることはありません。',
    ],
  },
  accuracy: {
    eyebrow: '精度の約束',
    title: '可能な限り正確に。推定の場合は明示します。',
    reviewed: 'カタログ確認日',
    columns: { provider: 'プロバイダー', text: 'テキストの方式', image: '画像の方式', label: '結果のラベル' },
    methods: { localBpe: 'ローカルのモデルBPE', projection: 'プロバイダー較正UTF-8推定', tiles: '公開されたタイル規則', patches: '公開されたパッチ規則', media: '公開されたメディア規則', unavailable: '未公開の場合は利用不可', exact: '正確なBPE / プロバイダーの計算式', deterministic: '決定論的な推定' },
  },
  terms: {
    eyebrow: '用語の整理',
    title: 'LLMリクエストを構成する数値',
    items: [
      { term: 'トークン', definition: '言語モデルが処理するテキストの最小単位です。単語全体、単語の一部、記号、空白のいずれかにあたります。' },
      { term: '入力トークン', definition: 'モデルへ送る内容です。プロンプト、文脈、指示、APIのメッセージ構造を含みます。' },
      { term: '出力トークン', definition: 'モデルが生成する内容です。多くのプロバイダーは出力を入力と別の単価で課金します。' },
      { term: 'キャッシュトークン', definition: 'すでに処理済みのプロンプト内容で、キャッシュの条件を満たすと割引料金が適用されます。' },
      { term: 'コンテキストウィンドウ', definition: '1回のリクエストでモデルが扱える入力と出力の合計上限です。' },
      { term: '100万あたりの単価', definition: 'APIの標準料金にトークン使用量を掛けた金額です。実際の請求には段階料金、キャッシュ、ツール、プロバイダー側のトークンが含まれる場合があります。' },
    ],
  },
  links: {
    eyebrow: '専用カウンター',
    title: '実際に使うモデルで測る',
    counters: [
      { name: 'OpenAIトークンカウンター', detail: 'ローカルで正確なo200k_base BPE' },
      { name: 'Claudeトークンカウンター', detail: 'プロバイダー較正UTF-8推定' },
      { name: 'Geminiトークンカウンター', detail: 'テキストと画像の規則' },
      { name: 'DeepSeekトークンカウンター', detail: '最新のAPI料金' },
    ],
    comparisonsEyebrow: '最新モデルの比較',
    comparisonsTitle: '同じ実際の処理内容でコストを比較',
    guidesEyebrow: 'コストガイド',
    guidesTitle: 'モデルだけでなく手法も比較',
  },
  reviews: {
    eyebrow: '実務からのメモ',
    title: 'API呼び出しの前に測れることを確認する',
    intro: '現時点では代表的な計画シナリオを掲載しています。開発者の実名レビューは、文面と掲載許可を確認したうえで追加します。',
    cardFooter: 'ブラウザ内の計算ツールで現在利用できます',
    workflowLabel: '代表的なシナリオ · 顧客レビューではありません',
    ctaStatus: 'コミュニティの実務ログ',
    ctaTitle: '最初に紹介される開発者になりませんか',
    ctaTitleWithReviews: 'あなたの事例を実務メモに追加する',
    ctaBody: '何を測定し、どのプロバイダーを比較し、その結果でどんな判断ができたかをお知らせください。掲載するレビューには名前を明記し、事前の許可をいただきます。',
    ctaButton: 'あなたの事例を共有する',
    carouselLabel: 'TokenCalculatorの代表的な利用シナリオ',
    workflows: [
      { label: '文書の取り込み', inputs: 'PDF + プロンプト', title: 'ナレッジベース取り込みの費用を試算', detail: 'テキストを含むPDFをローカルで抽出して全体量を測り、OpenAI、Claude、Gemini、DeepSeekでコンテキストの収まりと入力コストを比較します。' },
      { label: 'マルチモーダル', inputs: '画像 + テキスト', title: '画像モデルのリクエストを予算化', detail: '画像の寸法とプロンプトのテキストを合わせ、対応する各画像モデルに公開済みのタイル、パッチ、メディアトークン規則を適用します。' },
      { label: 'コード解析', inputs: 'TS + JSON + MD', title: 'リポジトリレビューの入力量を測定', detail: 'コード、設定、ドキュメントを1つの処理としてまとめ、十分なコンテキストを持つモデルを選ぶ前に測ります。' },
      { label: 'データ処理', inputs: 'CSV + 指示', title: 'バッチ処理の採算を比較', detail: '構造化データと指示をまとめて測り、継続的な処理を決める前にプロバイダーの入力料金を比較します。' },
    ],
  },
  stats: { models: '料金掲載モデル', providers: 'プロバイダー', uploaded: 'アップロード量', verified: '料金確認日' },
  faq: [
    { question: 'AIモデルのトークンとは何ですか?', answer: 'トークンは言語モデルが処理する内容の最小単位です。単語全体、単語の一部、記号、空白のほか、マルチモーダルモデルでは画像に割り当てられる単位も含みます。同じ入力でもプロバイダーによって区切り方は異なります。' },
    { question: 'LLM APIの入力コストはどう計算しますか?', answer: '入力トークン数を100万で割り、選択したモデルの100万トークンあたりの入力単価を掛けて算出します。プロバイダーの段階料金、キャッシュ入力、ツール、メッセージの付加情報が最終的な請求額に影響することがあります。' },
    { question: 'プロンプトや文書、画像はアップロードされますか?', answer: 'いいえ。テキスト、PDF、DOCXの抽出、画像サイズの読み取り、トークン計算はすべてブラウザ内で実行されます。プロンプト、文書の内容、画像がTokenCalculator.devや他の計算サーバーへ送られることはありません。' },
    { question: 'トークン数は正確ですか?', answer: 'OpenAIのテキストは対応するローカルのBPEエンコーディングで数えます。他のプロバイダーは、決定論的なローカル計算式が公開されていない限り、推定であることを明示しています。画像は各プロバイダーが公開する規則に従って計算します。' },
    { question: 'PDFやWord文書のトークンはどう数えますか?', answer: 'テキストを含むPDFまたはDOCXを添付すると、ブラウザがローカルで読み取り可能なテキストを抽出し、選択した各モデルで数えます。スキャンされたPDFや暗号化されたPDFはOCRが必要なため対応していません。' },
    { question: '画像トークンと画像モデルのコストも計算できますか?', answer: 'はい。PNG、JPEG、WebP、GIFを追加してください。対応する画像モデルでは、計算ツールがローカルで寸法を読み取り、プロバイダーが公開する画像トークンの計算式を適用します。公開された規則がない場合は、値を作らずに利用不可と表示します。' },
    { question: 'APIの報告値がわずかに異なるのはなぜですか?', answer: 'プロバイダーはメッセージの付加情報、システム指示、ツール、モデル固有の処理を追加することがあります。精度のラベルと方法論のページに、この計算ツールが何を含めているかを記載しています。' },
  ],
};

export const sectionCopy: Record<Locale, SectionCopy> = { en, es, de, 'pt-BR': ptBR, ja };
