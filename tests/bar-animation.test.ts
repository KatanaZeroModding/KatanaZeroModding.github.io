import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beats, cycleFrames, sampleScene, sceneFps } from '../src/lib/bar-animation';
import sprites from '../src/lib/bar-sprites.json';

const atTick = (tick: number) => sampleScene((tick + 0.001) / sceneFps);
const shirtAt = (tick: number) => atTick(tick).actors.find((actor) => actor.name.startsWith('spr_vet1_'))!;
const capAt = (tick: number) => atTick(tick).actors.find((actor) => actor.name.startsWith('spr_vet2_'))!;

test('every spoken phrase has a complete, consistently timed listener response', () => {
  let start = 0;
  for (const beat of beats) {
    if (beat.speaker === 'cap') {
      const phraseLength = sprites.spr_vet2_cap_talk.frames;
      assert.equal(beat.frames % phraseLength, 0, 'do not interrupt a phrase');
      let previousNodPhase: number[] | undefined;
      for (let phrase = 0; phrase < beat.frames; phrase += phraseLength) {
        const phases: number[] = [];
        for (let frame = 0; frame < phraseLength; frame++) {
          const tick = start + phrase + frame;
          assert.equal(capAt(tick).name, 'spr_vet2_cap_talk');
          assert.equal(capAt(tick).frame, frame);
          if (atTick(tick).listenerNodding) phases.push(frame);
        }
        assert.ok(phases.length > 0, 'listener must respond to every phrase');
        assert.ok(phases[0] > 0, 'let the speaker start before the nod');
        assert.ok(phases.at(-1)! < phraseLength - 1, 'finish the nod before returning to rest');
        if (previousNodPhase) assert.deepEqual(phases, previousNodPhase);
        previousNodPhase = phases;
      }
    }
    start += beat.frames;
  }
});

test('listener rests outside speech and smoking follows each finished turn', () => {
  let start = 0;
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    if (beat.speaker) {
      assert.equal(beats[i + 1].speaker, undefined);
      assert.equal(beats[i + 1].action, undefined);
      assert.equal(beats[i + 2].action, 'smoke');
    }
    for (let frame = 0; frame < beat.frames; frame++) {
      const tick = start + frame;
      if (!beat.speaker) {
        assert.equal(atTick(tick).listenerNodding, false);
        assert.equal(shirtAt(tick).name, 'spr_vet1_shirt_right_idle');
      }
      if (beat.action === 'smoke') {
        assert.equal(capAt(tick).name, 'spr_vet2_cap_smoke');
        assert.equal(capAt(tick).frame, frame);
      }
      for (const actor of atTick(tick).actors) {
        assert.ok(actor.frame >= 0 && actor.frame < sprites[actor.name].frames);
      }
    }
    start += beat.frames;
  }
  for (let tick = 0; tick < cycleFrames; tick++) {
    assert.deepEqual(shirtAt(tick + cycleFrames), shirtAt(tick), 'listener must repeat without phase drift');
    assert.deepEqual(capAt(tick + cycleFrames), capAt(tick), 'speaker must repeat without phase drift');
  }
});
