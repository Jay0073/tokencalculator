import type { Locale } from './config';

export interface HomeCopy {
  title: string; description: string; eyebrow: string; heading: string; intro: string; methodology: string;
  localProcessing: string; localShort: string; theme: string; language: string;
  footerPrivacy: string; methodologyNav: string; about: string; privacy: string; terms: string; contact: string;
  howItWorks: string; measurementHeading: string; pricingNote: string; methodologyLink: string;
  faq: { question: string; answer: string }[];
}

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    title: 'Text, File & Image LLM Token Calculator | TokenCalculator.dev',
    description: 'Count LLM tokens and estimate API cost from text, PDF, DOCX, code, data files, and images with privacy-first browser-based processing.',
    eyebrow: 'Privacy-first · browser-based token calculator', heading: 'Count tokens in text, files, and images.',
    intro: 'Paste a prompt or attach PDF, DOCX, code, data files, and images. Provider results and costs update live without uploading your content.',
    methodology: 'OpenAI text uses exact local o200k_base BPE tokenization. Claude, Gemini, and DeepSeek use deterministic Provider-Calibrated UTF-8 Token Projections. Supported images follow each provider’s published visual-token formulas, including patch, tile, detail, and model-cap rules.',
    localProcessing: 'Local processing', localShort: 'Local', theme: 'Toggle color theme', language: 'Choose language', footerPrivacy: 'Zero text, prompts, or uploaded files are sent to any external server.',
    methodologyNav: 'Methodology', about: 'About', privacy: 'Privacy', terms: 'Terms', contact: 'Contact', howItWorks: 'How it works', measurementHeading: 'A measurement, not a guess disguised as fact.', pricingNote: 'Every result identifies its method and accuracy level. Pricing is refreshed from Models.dev with the bundled registry available as an offline fallback.', methodologyLink: 'Read the complete methodology →',
    faq: [
      { question: 'Can I calculate tokens from files and images?', answer: 'Yes. Attach PDF, DOCX, code, data, PNG, JPEG, WebP, or GIF files. Text extraction, image-dimension reading, and token measurement run locally in your browser.' },
      { question: 'Does this tool upload my content?', answer: 'No. Your text, documents, code, and images stay in your browser and are not sent to TokenCalculator.dev or another calculation server.' },
    ],
  },
  es: {
    title: 'Calculadora de tokens LLM para texto, archivos e imágenes', description: 'Cuenta tokens LLM y calcula costes de API para texto, PDF, DOCX, código, datos e imágenes con procesamiento privado en el navegador.',
    eyebrow: 'Privacidad primero · funciona en el navegador', heading: 'Cuenta tokens en texto, archivos e imágenes.', intro: 'Pega un prompt o añade PDF, DOCX, código, archivos de datos e imágenes. Los resultados y costes se actualizan sin subir tu contenido.',
    methodology: 'El texto de OpenAI usa tokenización BPE o200k_base local y exacta. Claude, Gemini y DeepSeek usan proyecciones deterministas de tokens UTF-8 calibradas por proveedor. Las imágenes compatibles aplican las fórmulas visuales publicadas por cada proveedor.',
    localProcessing: 'Procesamiento local', localShort: 'Local', theme: 'Cambiar tema de color', language: 'Elegir idioma', footerPrivacy: 'Ningún texto, prompt o archivo subido se envía a servidores externos.', methodologyNav: 'Metodología', about: 'Acerca de', privacy: 'Privacidad', terms: 'Términos', contact: 'Contacto', howItWorks: 'Cómo funciona', measurementHeading: 'Una medición técnica, no una suposición presentada como un hecho.', pricingNote: 'Cada resultado identifica su método y nivel de precisión. Los precios se actualizan desde Models.dev y el registro integrado funciona como respaldo sin conexión.', methodologyLink: 'Leer la metodología completa →',
    faq: [{ question: '¿Puedo calcular tokens de archivos e imágenes?', answer: 'Sí. Añade PDF, DOCX, código, datos, PNG, JPEG, WebP o GIF. La extracción y la medición se ejecutan localmente en el navegador.' }, { question: '¿La herramienta sube mi contenido?', answer: 'No. Tus textos, documentos, código e imágenes permanecen en el navegador.' }],
  },
  ja: {
    title: 'テキスト・ファイル・画像対応 LLMトークン計算ツール', description: 'テキスト、PDF、DOCX、コード、データファイル、画像のLLMトークン数とAPI料金をブラウザ内で安全に計算します。',
    eyebrow: 'プライバシー優先 · ブラウザ内で処理', heading: 'テキスト、ファイル、画像のトークンを計算。', intro: 'プロンプトを貼り付けるか、PDF、DOCX、コード、データファイル、画像を追加してください。コンテンツをアップロードせず、結果と料金をリアルタイムで更新します。',
    methodology: 'OpenAIのテキストにはローカルのo200k_base BPEによる正確なトークン化を使用します。Claude、Gemini、DeepSeekにはプロバイダー別に調整した決定論的UTF-8トークン投影を使用し、画像には各社が公開する視覚トークン式を適用します。',
    localProcessing: 'ローカル処理', localShort: 'ローカル', theme: 'カラーテーマを切り替える', language: '言語を選択', footerPrivacy: 'テキスト、プロンプト、アップロードしたファイルを外部サーバーへ送信しません。', methodologyNav: '計算方法', about: '概要', privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ', howItWorks: '仕組み', measurementHeading: '推測ではなく、技術的根拠に基づく測定です。', pricingNote: '各結果には計算方式と精度レベルを表示します。料金はModels.devから更新され、内蔵レジストリがオフライン時の代替になります。', methodologyLink: '計算方法の詳細 →',
    faq: [{ question: 'ファイルや画像のトークンも計算できますか？', answer: 'はい。PDF、DOCX、コード、データ、PNG、JPEG、WebP、GIFに対応し、抽出と測定はブラウザ内で実行されます。' }, { question: 'コンテンツはアップロードされますか？', answer: 'いいえ。テキスト、文書、コード、画像はブラウザ内に留まります。' }],
  },
  de: {
    title: 'LLM-Token-Rechner für Text, Dateien & Bilder', description: 'LLM-Tokens und API-Kosten für Text, PDF, DOCX, Code, Datendateien und Bilder datenschutzorientiert direkt im Browser berechnen.',
    eyebrow: 'Datenschutz zuerst · browserbasierter Token-Rechner', heading: 'Tokens in Text, Dateien und Bildern berechnen.', intro: 'Füge einen Prompt ein oder lade PDF, DOCX, Code, Datendateien und Bilder hinzu. Ergebnisse und Kosten werden aktualisiert, ohne deine Inhalte hochzuladen.',
    methodology: 'OpenAI-Text verwendet exakte lokale o200k_base-BPE-Tokenisierung. Claude, Gemini und DeepSeek verwenden deterministische, anbieterkalibrierte UTF-8-Token-Projektionen. Unterstützte Bilder folgen den veröffentlichten visuellen Tokenformeln der Anbieter.',
    localProcessing: 'Lokale Verarbeitung', localShort: 'Lokal', theme: 'Farbschema wechseln', language: 'Sprache auswählen', footerPrivacy: 'Texte, Prompts und hochgeladene Dateien werden an keinen externen Server gesendet.', methodologyNav: 'Methodik', about: 'Über uns', privacy: 'Datenschutz', terms: 'Bedingungen', contact: 'Kontakt', howItWorks: 'Funktionsweise', measurementHeading: 'Eine technische Messung, keine als Tatsache getarnte Vermutung.', pricingNote: 'Jedes Ergebnis nennt Methode und Genauigkeitsstufe. Preise werden über Models.dev aktualisiert; das integrierte Register dient als Offline-Rückfall.', methodologyLink: 'Vollständige Methodik lesen →',
    faq: [{ question: 'Kann ich Tokens aus Dateien und Bildern berechnen?', answer: 'Ja. PDF, DOCX, Code, Daten, PNG, JPEG, WebP und GIF werden unterstützt. Extraktion und Messung laufen lokal im Browser.' }, { question: 'Werden meine Inhalte hochgeladen?', answer: 'Nein. Texte, Dokumente, Code und Bilder bleiben in deinem Browser.' }],
  },
  'pt-BR': {
    title: 'Calculadora de tokens LLM para texto, arquivos e imagens', description: 'Conte tokens LLM e estime custos de API para texto, PDF, DOCX, código, dados e imagens com processamento privado no navegador.',
    eyebrow: 'Privacidade em primeiro lugar · funciona no navegador', heading: 'Conte tokens em texto, arquivos e imagens.', intro: 'Cole um prompt ou adicione PDF, DOCX, código, arquivos de dados e imagens. Resultados e custos são atualizados sem enviar seu conteúdo.',
    methodology: 'O texto da OpenAI usa tokenização BPE o200k_base local e exata. Claude, Gemini e DeepSeek usam projeções determinísticas de tokens UTF-8 calibradas por provedor. Imagens compatíveis seguem as fórmulas visuais publicadas por cada provedor.',
    localProcessing: 'Processamento local', localShort: 'Local', theme: 'Alternar tema de cores', language: 'Escolher idioma', footerPrivacy: 'Nenhum texto, prompt ou arquivo enviado é transmitido para servidores externos.', methodologyNav: 'Metodologia', about: 'Sobre', privacy: 'Privacidade', terms: 'Termos', contact: 'Contato', howItWorks: 'Como funciona', measurementHeading: 'Uma medição técnica, não uma suposição apresentada como fato.', pricingNote: 'Cada resultado identifica seu método e nível de precisão. Os preços são atualizados pelo Models.dev e o registro integrado funciona como alternativa offline.', methodologyLink: 'Ler a metodologia completa →',
    faq: [{ question: 'Posso calcular tokens de arquivos e imagens?', answer: 'Sim. Adicione PDF, DOCX, código, dados, PNG, JPEG, WebP ou GIF. A extração e a medição são executadas localmente no navegador.' }, { question: 'A ferramenta envia meu conteúdo?', answer: 'Não. Seus textos, documentos, códigos e imagens permanecem no navegador.' }],
  },
};
