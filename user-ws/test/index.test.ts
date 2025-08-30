import { describe, test, expect } from "vitest";
import WebSocket from "ws";

const BACKEND_URL = "ws://localhost:8080";

describe("chat application", () => {
  test("Message sent from room 1 reaches another part in room1", async () => {
    const ws1 = new WebSocket(`${BACKEND_URL}`);
    const ws2 = new WebSocket(`${BACKEND_URL}`);

    await new Promise<void>((resolve) => {
      let count = 0;
      ws1.onopen = () => {
        count = count + 1;
        if (count == 2) {
          resolve();
        }
      };

      ws2.onopen = () => {
        count = count + 1;
        if (count == 2) {
          resolve();
        }
      };
    });
    console.log("hi there")
    ws1.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );

    ws2.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );

    await new Promise<void>((resolve) => {
      ws2.on("message", (raw) => {
        const data = JSON.parse(raw.toString());
        expect(data.type).toBe("chat");
        expect(data.message).toBe("hi there");
        resolve();
      });

      ws1.send(
        JSON.stringify({
          type: "chat",
          room: "Room 1",
          message: "hi there",
        })
      );
    });
  });
});
