import type { Accuracy, MediaKind, ModelConfig } from '../../domain/models';

export interface MediaInput {
  kind: MediaKind;
  /** Duration in seconds. Audio and video only. */
  seconds?: number;
  /** Page count. PDFs only. */
  pages?: number;
  /** Gemini media_resolution. Left unset, each media type uses Google's own default. */
  detail?: 'low' | 'high';
  /** Whether a video carries sound, which is billed on top of the frames. */
  sound?: boolean;
}

export type MediaCount =
  | { supported: true; tokens: number; method: string; accuracy: Accuracy }
  | { supported: false; reason: string };

/**
 * Gemini 3 spends a fixed budget per second of audio, per video frame and per PDF page.
 * Video frames are sampled at 1 FPS. ai.google.dev/gemini-api/docs/media-resolution
 */
const GEMINI_3 = { label: 'Gemini 3', audioPerSecond: 25, videoFrame: { low: 70, high: 280 }, pdfPerPage: { default: 560, low: 280, high: 1_120 } } as const;

/**
 * Gemini 2.x keeps the older 258-token allocations.
 * ai.google.dev/gemini-api/docs/tokens and /video-understanding
 */
const GEMINI_2 = { label: 'Gemini 2.x', audioPerSecond: 32, videoFrame: { low: 66, high: 258 }, pdfPerPage: { default: 258, low: 258, high: 258 } } as const;

const LABELS: Record<MediaKind, string> = { audio: 'audio', video: 'video', pdf: 'PDF' };

/** Seconds are billed whole, and video frames are sampled once per second. */
const wholeSeconds = (seconds: number | undefined) => Math.max(0, Math.ceil(seconds ?? 0));

export function countMedia(input: MediaInput, model: ModelConfig): MediaCount {
  const kind = input.kind;
  if (model.inputModalities && !model.inputModalities.includes(kind)) {
    return { supported: false, reason: `${model.name} does not accept ${LABELS[kind]} input.` };
  }

  // Only Google publishes token rates for these inputs today. Everything else is counted
  // as unsupported with a reason, rather than with a number we cannot source.
  const rates = model.vision === 'gemini-budget' ? GEMINI_3 : model.vision === 'gemini-tiles' ? GEMINI_2 : undefined;
  if (!rates) {
    return {
      supported: false,
      reason: kind === 'pdf'
        ? `Page text is counted. ${model.name} is also sent each page as an image, and no per-page token cost is published for it.`
        : `${model.name} accepts ${LABELS[kind]} input, but no token rate is published for it.`,
    };
  }

  if (kind === 'audio') {
    const seconds = wholeSeconds(input.seconds);
    return {
      supported: true,
      tokens: seconds * rates.audioPerSecond,
      accuracy: 'provider-formula',
      method: `${rates.label} audio · ${rates.audioPerSecond} tokens per second × ${seconds.toLocaleString()}s`,
    };
  }

  if (kind === 'video') {
    const seconds = wholeSeconds(input.seconds);
    // Google's default for video is the low frame budget, unlike images, where the
    // default matches the high budget.
    const perFrame = input.detail === 'high' ? rates.videoFrame.high : rates.videoFrame.low;
    const frames = seconds * perFrame;
    const sound = input.sound === false ? 0 : seconds * rates.audioPerSecond;
    return {
      supported: true,
      tokens: frames + sound,
      accuracy: 'provider-formula',
      method: `${rates.label} video · ${perFrame} tokens per frame at 1 FPS × ${seconds.toLocaleString()}s${sound ? ` + ${rates.audioPerSecond} tokens per second of sound` : ''}`,
    };
  }

  const pages = Math.max(0, Math.round(input.pages ?? 0));
  const perPage = input.detail ? rates.pdfPerPage[input.detail] : rates.pdfPerPage.default;
  return {
    supported: true,
    tokens: pages * perPage,
    accuracy: 'provider-formula',
    method: `${rates.label} PDF pages · ${perPage} tokens per page × ${pages.toLocaleString()} page${pages === 1 ? '' : 's'}, page text counted separately`,
  };
}
