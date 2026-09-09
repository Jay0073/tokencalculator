import type { Locale } from './config';

/**
 * Navigation copy. The header and footer previously hardcoded every label in
 * English, so a visitor on /ja/ or /de/ met an English menu before any translated
 * content. Product names (OpenAI, Claude, Gemini, DeepSeek) stay untranslated.
 */
export interface NavCopy {
  calculators: string;
  inputAndPlanning: string;
  tokenCalculator: string;
  tokenCalculatorDetail: string;
  tokensToWords: string;
  tokensToWordsDetail: string;
  costLab: string;
  costLabDetail: string;
  providerCalculators: string;
  providerCalculatorsDetail: string;
  explore: string;
  learnAndVerify: string;
  documentation: string;
  documentationDetail: string;
  privacyArchitecture: string;
  privacyArchitectureDetail: string;
  methodology: string;
  methodologyDetail: string;
  resources: string;
  engineeringBlog: string;
  apiReference: string;
  apiReferenceDetail: string;
  integrations: string;
  developers: string;
  freeApi: string;
  tokenCounterSuffix: string;
  openMenu: string;
  stayInEnglish: string;
  switchLanguage: string;
  footerApi: string;
  footerBlog: string;
  footerDocs: string;
}

export const navCopy: Record<Locale, NavCopy> = {
  en: {
    calculators: 'Calculators',
    inputAndPlanning: 'Input and planning',
    tokenCalculator: 'Token calculator',
    tokenCalculatorDetail: 'Count text, PDF, DOCX, source code, data files, and image tokens locally.',
    tokensToWords: 'Tokens ↔ words',
    tokensToWordsDetail: 'Translate context-window sizes into content-aware planning ranges.',
    costLab: 'Cost Lab',
    costLabDetail: 'Model pricing, batch projections, cache effects, and request economics.',
    providerCalculators: 'Provider calculators',
    providerCalculatorsDetail: 'Open all model and workload cost calculators',
    explore: 'Explore',
    learnAndVerify: 'Learn and verify',
    documentation: 'Documentation',
    documentationDetail: 'Technical guides for text, files, images, APIs, and workflow nodes.',
    privacyArchitecture: 'Privacy architecture',
    privacyArchitectureDetail: 'Inspect the browser-local processing boundary and network behavior.',
    methodology: 'Methodology',
    methodologyDetail: 'Tokenizer provenance, provider formulas, accuracy levels, and limits.',
    resources: 'Resources',
    engineeringBlog: 'Engineering blog',
    apiReference: 'API reference',
    apiReferenceDetail: 'Request contracts, batch counting, response fields, errors, and SDK usage.',
    integrations: 'Integrations',
    developers: 'Developers',
    freeApi: 'Free API',
    tokenCounterSuffix: 'token counter',
    openMenu: 'Open navigation menu',
    stayInEnglish: 'Stay in English',
    switchLanguage: 'Switch language',
    footerApi: 'API',
    footerBlog: 'Blog',
    footerDocs: 'Docs',
  },
  es: {
    calculators: 'Calculadoras',
    inputAndPlanning: 'Entrada y planificación',
    tokenCalculator: 'Calculadora de tokens',
    tokenCalculatorDetail: 'Cuenta tokens de texto, PDF, DOCX, código fuente, archivos de datos e imágenes localmente.',
    tokensToWords: 'Tokens ↔ palabras',
    tokensToWordsDetail: 'Convierte tamaños de ventana de contexto en rangos de planificación según el contenido.',
    costLab: 'Laboratorio de costes',
    costLabDetail: 'Precios de modelos, proyecciones por lotes, efectos de caché y economía de solicitudes.',
    providerCalculators: 'Calculadoras por proveedor',
    providerCalculatorsDetail: 'Abrir todas las calculadoras de coste por modelo y carga de trabajo',
    explore: 'Explorar',
    learnAndVerify: 'Aprender y verificar',
    documentation: 'Documentación',
    documentationDetail: 'Guías técnicas para texto, archivos, imágenes, API y nodos de flujo de trabajo.',
    privacyArchitecture: 'Arquitectura de privacidad',
    privacyArchitectureDetail: 'Revisa el límite de procesamiento local en el navegador y el comportamiento de red.',
    methodology: 'Metodología',
    methodologyDetail: 'Origen del tokenizador, fórmulas del proveedor, niveles de precisión y límites.',
    resources: 'Recursos',
    engineeringBlog: 'Blog de ingeniería',
    apiReference: 'Referencia de la API',
    apiReferenceDetail: 'Contratos de solicitud, conteo por lotes, campos de respuesta, errores y uso del SDK.',
    integrations: 'Integraciones',
    developers: 'Desarrolladores',
    freeApi: 'API gratuita',
    tokenCounterSuffix: 'contador de tokens',
    openMenu: 'Abrir menú de navegación',
    stayInEnglish: 'Seguir en inglés',
    switchLanguage: 'Cambiar idioma',
    footerApi: 'API',
    footerBlog: 'Blog',
    footerDocs: 'Documentación',
  },
  ja: {
    calculators: '計算ツール',
    inputAndPlanning: '入力と計画',
    tokenCalculator: 'トークン計算ツール',
    tokenCalculatorDetail: 'テキスト、PDF、DOCX、ソースコード、データファイル、画像のトークンをローカルで数えます。',
    tokensToWords: 'トークン ↔ 単語',
    tokensToWordsDetail: 'コンテキストウィンドウのサイズを、内容に応じた計画レンジに変換します。',
    costLab: 'コストラボ',
    costLabDetail: 'モデル料金、バッチ試算、キャッシュ効果、リクエストのコスト構造。',
    providerCalculators: 'プロバイダー別の計算ツール',
    providerCalculatorsDetail: 'すべてのモデル・ワークロード別コスト計算ツールを開く',
    explore: '見る',
    learnAndVerify: '学ぶ・検証する',
    documentation: 'ドキュメント',
    documentationDetail: 'テキスト、ファイル、画像、API、ワークフローノードの技術ガイド。',
    privacyArchitecture: 'プライバシー設計',
    privacyArchitectureDetail: 'ブラウザ内処理の境界とネットワーク動作を確認できます。',
    methodology: '算出方法',
    methodologyDetail: 'トークナイザーの出所、プロバイダーの計算式、精度レベル、制限。',
    resources: 'リソース',
    engineeringBlog: 'エンジニアリングブログ',
    apiReference: 'APIリファレンス',
    apiReferenceDetail: 'リクエスト仕様、バッチ計算、レスポンス項目、エラー、SDKの使い方。',
    integrations: '連携',
    developers: '開発者向け',
    freeApi: '無料API',
    tokenCounterSuffix: 'トークンカウンター',
    openMenu: 'ナビゲーションメニューを開く',
    stayInEnglish: '英語のままにする',
    switchLanguage: '言語を切り替える',
    footerApi: 'API',
    footerBlog: 'ブログ',
    footerDocs: 'ドキュメント',
  },
  de: {
    calculators: 'Rechner',
    inputAndPlanning: 'Eingabe und Planung',
    tokenCalculator: 'Token-Rechner',
    tokenCalculatorDetail: 'Zählt Tokens aus Text, PDF, DOCX, Quellcode, Datendateien und Bildern lokal.',
    tokensToWords: 'Tokens ↔ Wörter',
    tokensToWordsDetail: 'Übersetzt Kontextfenstergrößen in inhaltsbezogene Planungsbereiche.',
    costLab: 'Kostenlabor',
    costLabDetail: 'Modellpreise, Batch-Prognosen, Cache-Effekte und Kostenstruktur von Anfragen.',
    providerCalculators: 'Anbieter-Rechner',
    providerCalculatorsDetail: 'Alle Modell- und Workload-Kostenrechner öffnen',
    explore: 'Entdecken',
    learnAndVerify: 'Lernen und prüfen',
    documentation: 'Dokumentation',
    documentationDetail: 'Technische Anleitungen für Text, Dateien, Bilder, APIs und Workflow-Nodes.',
    privacyArchitecture: 'Datenschutzarchitektur',
    privacyArchitectureDetail: 'Prüfen Sie die lokale Verarbeitungsgrenze im Browser und das Netzwerkverhalten.',
    methodology: 'Methodik',
    methodologyDetail: 'Herkunft des Tokenizers, Anbieterformeln, Genauigkeitsstufen und Grenzen.',
    resources: 'Ressourcen',
    engineeringBlog: 'Engineering-Blog',
    apiReference: 'API-Referenz',
    apiReferenceDetail: 'Anfrageverträge, Batch-Zählung, Antwortfelder, Fehler und SDK-Nutzung.',
    integrations: 'Integrationen',
    developers: 'Entwickler',
    freeApi: 'Kostenlose API',
    tokenCounterSuffix: 'Token-Zähler',
    openMenu: 'Navigationsmenü öffnen',
    stayInEnglish: 'Auf Englisch bleiben',
    switchLanguage: 'Sprache wechseln',
    footerApi: 'API',
    footerBlog: 'Blog',
    footerDocs: 'Dokumentation',
  },
  'pt-BR': {
    calculators: 'Calculadoras',
    inputAndPlanning: 'Entrada e planejamento',
    tokenCalculator: 'Calculadora de tokens',
    tokenCalculatorDetail: 'Conta tokens de texto, PDF, DOCX, código-fonte, arquivos de dados e imagens localmente.',
    tokensToWords: 'Tokens ↔ palavras',
    tokensToWordsDetail: 'Converte tamanhos de janela de contexto em faixas de planejamento conforme o conteúdo.',
    costLab: 'Laboratório de custos',
    costLabDetail: 'Preços de modelos, projeções em lote, efeitos de cache e economia das requisições.',
    providerCalculators: 'Calculadoras por provedor',
    providerCalculatorsDetail: 'Abrir todas as calculadoras de custo por modelo e carga de trabalho',
    explore: 'Explorar',
    learnAndVerify: 'Aprender e verificar',
    documentation: 'Documentação',
    documentationDetail: 'Guias técnicos para texto, arquivos, imagens, APIs e nós de fluxo de trabalho.',
    privacyArchitecture: 'Arquitetura de privacidade',
    privacyArchitectureDetail: 'Inspecione o limite de processamento local no navegador e o comportamento de rede.',
    methodology: 'Metodologia',
    methodologyDetail: 'Origem do tokenizador, fórmulas do provedor, níveis de precisão e limites.',
    resources: 'Recursos',
    engineeringBlog: 'Blog de engenharia',
    apiReference: 'Referência da API',
    apiReferenceDetail: 'Contratos de requisição, contagem em lote, campos de resposta, erros e uso do SDK.',
    integrations: 'Integrações',
    developers: 'Desenvolvedores',
    freeApi: 'API gratuita',
    tokenCounterSuffix: 'contador de tokens',
    openMenu: 'Abrir menu de navegação',
    stayInEnglish: 'Continuar em inglês',
    switchLanguage: 'Mudar idioma',
    footerApi: 'API',
    footerBlog: 'Blog',
    footerDocs: 'Documentação',
  },
};
