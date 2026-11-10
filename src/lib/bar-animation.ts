import sprites from './bar-sprites.json';

// Half-speed playback for the whole scene, including props, pauses and smoke.
export const sceneFps = 7.5;

export type SpriteName = keyof typeof sprites;
export type SpriteFrame = {
  name: SpriteName;
  x: number;
  y: number;
  frame: number;
  scale?: number;
  mirror?: boolean;
  opacity?: number;
};
type Beat = {
  id: string;
  frames: number;
  speaker?: 'cap';
  action?: 'drink' | 'smoke';
};

// One shared playback clock directs both sides of the conversation and all props.
// Action lengths come from the source strips, so drink/smoke finish completely.
export const beats: Beat[] = [
  { id: 'settle', frames: 30 },
  { id: 'cap-replies', frames: sprites.spr_vet2_cap_talk.frames * 4, speaker: 'cap' },
  { id: 'cap-reply-breath', frames: 9 },
  { id: 'cap-reply-smoke', frames: sprites.spr_vet2_cap_smoke.frames, action: 'smoke' },
  { id: 'smoke-rest', frames: 18 },
  { id: 'null-drinks', frames: sprites.spr_player_drink.frames, action: 'drink' },
  { id: 'rest', frames: 36 },
  { id: 'cap-answers', frames: sprites.spr_vet2_cap_talk.frames * 3, speaker: 'cap' },
  { id: 'cap-answer-breath', frames: 9 },
  { id: 'cap-answer-smoke', frames: sprites.spr_vet2_cap_smoke.frames, action: 'smoke' },
  { id: 'quiet', frames: 60 }
];

export const cycleFrames = beats.reduce((total, beat) => total + beat.frames, 0);

// Emit on the exhale after the cigarette reaches the mouth, not while speaking.
// Sample the effect on the same scene clock; let its last frames linger
// into the following rest, instead of cutting the puff off with the body clip.
const smokeEmissions: number[] = [];
let beatStart = 0;
for (const beat of beats) {
  if (beat.action === 'smoke') smokeEmissions.push(beatStart + 14);
  beatStart += beat.frames;
}

// A nine-frame phrase pairs the smoker's gesture with the listener's nod.
// Use only the downward head-bob poses of the six-frame shirt strip.
// Both return to rest before the next phrase or the smoking animation.
const listenerPhraseFrames = [0, 0, 0, 2, 3, 3, 2, 0, 0];

export function sampleScene(elapsed: number): { beat: string; speaker: 'cap' | null; listenerNodding: boolean; actors: SpriteFrame[] } {
  const tick = Math.floor(Math.max(0, elapsed) * sceneFps);
  let localFrame = tick % cycleFrames;
  let beat = beats[0];
  for (const candidate of beats) {
    beat = candidate;
    if (localFrame < beat.frames) break;
    localFrame -= beat.frames;
  }
  const drinking = beat.action === 'drink';
  const phraseFrame = localFrame % sprites.spr_vet2_cap_talk.frames;
  const shirtFrame = beat.speaker === 'cap' ? listenerPhraseFrames[phraseFrame] : 0;
  const listenerNodding = shirtFrame !== 0;
  const shirt: SpriteName = listenerNodding ? 'spr_vet1_shirt_talk' : 'spr_vet1_shirt_right_idle';
  const cap: SpriteName = beat.action === 'smoke' ? 'spr_vet2_cap_smoke' :
    beat.speaker === 'cap' ? 'spr_vet2_cap_talk' : 'spr_vet2_cap_idle';
  const actors: SpriteFrame[] = [
    { name: drinking ? 'spr_player_drink' : 'spr_player_sitstool_idle', x: 291, y: 243, frame: drinking ? localFrame : 0 },
    { name: 'spr_bartender_idle', x: 326, y: 228, frame: tick % sprites.spr_bartender_idle.frames },
    { name: shirt, x: 376, y: 243, frame: shirtFrame },
    // The original cap sprites already face left, towards the other visitor.
    { name: cap, x: 398, y: 243, frame: localFrame % sprites[cap].frames }
  ];
  // The drink strip includes the glass in every frame. Only the seated idle
  // needs a separate glass, aligned exactly with drink frames 0 and 22.
  if (!drinking) actors.push({ name: 'spr_bar_glass', x: 304, y: 221, frame: 0 });
  for (const emission of smokeEmissions) {
    const age = (tick % cycleFrames - emission + cycleFrames) % cycleFrames;
    const duration = sprites.spr_cigarette_smoke.frames;
    if (age < duration) {
      actors.push({
        name: 'spr_cigarette_smoke', frame: age,
        x: 390 - Math.floor(age / 5), y: 211 - Math.floor(age * 0.6),
        scale: 0.6, mirror: true,
        opacity: 0.7 * Math.min(1, (duration - age) / 3)
      });
    }
  }
  return { beat: beat.id, speaker: beat.speaker ?? null, listenerNodding, actors };
}
