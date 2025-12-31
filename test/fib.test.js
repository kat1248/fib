import assert from "assert";
import { FIBS, sumMask } from "../fibonacci.js";

describe("Fibonacci combinations", () => {

    it("all combinations sum correctly", () => {
        FIBS.forEach((sets, target) => {
            sets.forEach(mask => {
                assert.strictEqual(
                    sumMask(mask),
                    target,
                    `Mask ${mask.toString(2)} != ${target}`
                );
            });
        });
    });

    it("no mask uses invalid bits", () => {
        FIBS.flat().forEach(mask => {
            assert.ok(mask <= 0b11111, `Invalid bitmask ${mask}`);
        });
    });

    it("zero uses only empty mask", () => {
        assert.deepStrictEqual(FIBS[0], [0]);
    });

    it("twelve uses all boxes", () => {
        assert.strictEqual(FIBS[12][0], 0b11111);
    });

});
