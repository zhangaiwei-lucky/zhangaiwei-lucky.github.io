import test from "node:test";
import assert from "node:assert/strict";
import { loadConfigs, validateConfigs } from "./config-validation.js";
import { parseConfig } from "../src/utils/parseConfig.js";

test("current configuration and asset references are valid", () => {
  assert.deepEqual(validateConfigs(loadConfigs()), []);
});
test("JSONC supports comments without corrupting strings", () => {
  const source = '{ // heading\n "url": "https://example.com/*keep*/", /* note */ "value": 1 }';
  assert.equal(parseConfig(source, "theme.jsonc", true).url, "https://example.com/*keep*/");
  assert.throws(() => parseConfig(source, "content.json"), /content.json:1:/);
  assert.throws(() => parseConfig('{"value":}', "broken.json"), /broken.json:1:/);
});
test("missing required fields report their file and location", () => {
  const config = loadConfigs();
  delete config["hero.json"].primaryLinks;
  assert.match(validateConfigs(config).join("\n"), /hero.json.*primaryLinks/);
});
