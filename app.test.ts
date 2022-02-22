import { assertEquals, assertExists, assert } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import { IFeedback } from "./model.ts";

const { test } = Deno;
const baseUrl = "http://localhost:8000";

test("I should get all posts", async () => {
    const res = await fetch(`${baseUrl}/feedback`);
    assert(res.ok);
    const data = await res.json() as IFeedback[];
    assertExists(data);
    assert(data?.length > 0);
});


test("I should get a single post", async () => {
    const id = "8b8fabc3-a449-47cc-96e4-070dec7669aa";
    const res = await fetch(`${baseUrl}/feedback/${id}`);
    assert(res.ok);
    const data = await res.json() as IFeedback;
    assertExists(data);
    assertEquals(data.id, id);
});

test("I should add a single post", async () => {
    const document = {
        subject: 2,
        stars: 3,
        feedback: "Det var greit nok"
    };
    const res = await fetch(`${baseUrl}/feedback`, {
        method: "POST",
        body: JSON.stringify(document),
        headers: [["content-type", "application/json"]]
    });
    assert(res.ok);
    const data = await res.json() as IFeedback;
    assertExists(data);
    const { subject, stars, feedback } = data;
    assertEquals({ subject, stars, feedback }, document);
});

test("I should add and update a post", async () => {
    const document = {
        subject: 2,
        stars: 1,
        feedback: "Det var ikke bra"
    };
    const posted = await fetch(`${baseUrl}/feedback`, {
        method: "POST",
        body: JSON.stringify(document),
        headers: [["content-type", "application/json"]]
    });
    assert(posted.ok, "Created");
    const postedData = await posted.json() as IFeedback;
    assertExists(postedData, "Created has data");
    const updatedDocument = {
        ...postedData,
        subject: 2,
        stars: 5,
        feedback: "Jeg ombestemte meg. Det var dritbra."
    };
    const updated = await fetch(`${baseUrl}/feedback/${postedData?.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedDocument),
        headers: [["content-type", "application/json"]]
    });
    assert(updated.ok, "Updates");
    const updatedData = await updated.json() as IFeedback;
    assertExists(updatedData, "Update has data");
    assertEquals(updatedData, updatedDocument);
});