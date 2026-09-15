import { describe, expect, it } from "vitest";
import { parseTrustExportArguments } from "./export-config-trust-bundle-args.js";

describe("config trust export arguments", () => {
  it("supports no selectors, one selector, multiple selectors, and output", () => {
    expect(parseTrustExportArguments([])).toEqual({ overlapKeyIds: [] });
    expect(
      parseTrustExportArguments([
        "--overlap-key",
        "config-k1",
        "--overlap-key",
        "config-k0",
        "--output",
        "dist/trust.json",
      ]),
    ).toEqual({
      overlapKeyIds: ["config-k1", "config-k0"],
      outputPath: "dist/trust.json",
    });
  });

  it("rejects duplicate selectors and invalid argument shapes", () => {
    expect(() =>
      parseTrustExportArguments([
        "--overlap-key",
        "config-k1",
        "--overlap-key",
        "config-k1",
      ]),
    ).toThrow("P3_PUBLIC_TRUST_KEY_DUPLICATE_OVERLAP");
    for (const argv of [
      ["--overlap-key"],
      ["--overlap-key", "--output"],
      ["--output"],
      ["--output", "a", "--output", "b"],
      ["--unknown"],
    ]) {
      expect(() => parseTrustExportArguments(argv)).toThrow(
        "Usage: pnpm config:trust-export",
      );
    }
  });

  it("preserves selector order for the builder to normalize", () => {
    expect(
      parseTrustExportArguments([
        "--overlap-key",
        "config-z",
        "--overlap-key",
        "config-a",
      ]).overlapKeyIds,
    ).toEqual(["config-z", "config-a"]);
  });
});
