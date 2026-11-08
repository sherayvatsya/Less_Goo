
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().trim().min(1).max(2000),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  language: z.enum([
    "auto",
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Bengali",
  ]),
});

export const askLessGooAI = createServerFn({
  method: "POST",
})
  .inputValidator(chatSchema)
  .handler(async ({ data }) => {
    const { generateTravelReply } =
      await import("./gemini.server");

    if (data.messages.at(-1)?.role !== "user") {
      throw new Error("Last message must be from user");
    }

    const reply = await generateTravelReply(
      data.messages,
      data.language
    );

    return { reply };
  });
