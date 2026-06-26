"use strict";

// Speaker media store smoke suite for Podcast Design Canvas (#197).
// Run with: `node tests/speaker-media-store.test.js`.

const assert = require("assert");
const store = require("../app/speaker-media-store.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  ok ${name}`);
}

test("saveMediaSync stores multiple speaker tracks without last-one-wins loss", () => {
  store.resetMemoryStore();
  const episodeKey = "show-1:ep-1";
  store.saveMediaSync(store.buildMediaId(episodeKey, "source", 1), new Uint8Array([1, 2, 3]), { kind: "source" });
  store.saveMediaSync(store.buildMediaId(episodeKey, "source", 2), new Uint8Array([4, 5, 6]), { kind: "source" });
  store.saveMediaSync(store.buildMediaId(episodeKey, "polished", 1), new Uint8Array([7, 8, 9]), { kind: "polished" });
  assert.deepStrictEqual(Array.from(store.loadMediaSync(store.buildMediaId(episodeKey, "source", 1))), [1, 2, 3]);
  assert.deepStrictEqual(Array.from(store.loadMediaSync(store.buildMediaId(episodeKey, "source", 2))), [4, 5, 6]);
  assert.deepStrictEqual(Array.from(store.loadMediaSync(store.buildMediaId(episodeKey, "polished", 1))), [7, 8, 9]);
});

test("buildMediaId keeps stable per-episode source and polished keys", () => {
  assert.strictEqual(store.buildMediaId("show-a:ep-b", "source", 2), "show-a:ep-b:source:2");
  assert.strictEqual(store.buildMediaId("show-a:ep-b", "polished", 2), "show-a:ep-b:polished:2");
});

console.log(`\nspeaker media store: ${passed} assertions passed`);
