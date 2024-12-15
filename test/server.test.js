import app from "../src/app.js";
import supertest from "supertest";
const request = supertest(app);

test("A aplicação tem que responder na porta 8081", async () => {
  try {
    const res = await request.get('/')
    let status = res.statusCode;
    expect(status).toEqual(200);
  } catch (err) {
    throw err;
  }
});
