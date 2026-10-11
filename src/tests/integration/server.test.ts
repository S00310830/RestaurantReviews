import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app";

describe("GET /ping", () => {
    it("should return the correct message", async () => {
        const response = await request(app)
            .get("/ping");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "This is your restaurant reviews!"
        });
    });
});
