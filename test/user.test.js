import supertest from "supertest";
import app from "../src/app";
import User from "../src/models/User";

const request = supertest(app);

const USER_TEST = {
  name: process.env.NAME_USER_TEST,
  email: process.env.EMAIL_USER_TEST,
  password: process.env.PASSWORD_USER_TEST,
  school_id: process.env.SCHOOL_USER_TEST,
  classroom_id: process.env.CLASSROOM_USER_TEST,
};
beforeAll(async ()=>{
    await request.post("/user").send(USER_TEST);
})
afterAll(async () => {
  try {
    const user = await User.findOne({ email: USER_TEST.email });
    if (user) {
      await request.delete(`/user/${user.id}`);
    }
  } catch (err) {
    throw err;
  }
});

describe("Cadastro de usuário", () => {
  test("Deve cadastrar o usuário com sucesso", async () => {
    let email = Date.now()
    let user = {
        name: "Gustav",
        email: `${email}@gmail.com`,
        password: '1245456567',
        school_id: 342534,
        classroom_id: 3,
      };
    try {
      const response = await request.post("/user").send(user);
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("Sucesso. Usuario cadastrado");
      expect(response.body.user).toBeDefined();
      await request.delete(`/user/${response.body.user.id}`);
    } catch (err) {
      throw err;
    }
  });

  test("Deve impedir o cadastro de campos vazios", async () => {
    const user = { name: "", email: "", password: "" };
    try {
      const response = await request.post("/user").send(user);
      expect(response.status).toEqual(400);
    } catch (err) {
      throw err;
    }
  });

  test("Deve impedir o cadastro de emails repetidos", async () => {
    try{
      const response = await request.post("/user").send(USER_TEST);
      
      expect(response.status).toEqual(409);
      expect(response.body.err).toEqual("Usuario ja cadastrado");
    }catch(err){throw err}
  });
  test("Deve impedir o cadastro de usuario pois não exite a sala de aula", async () => {
    try{
      let user = USER_TEST
      user.classroom_id = Date.now()
      const response = await request.post("/user").send(user);
      
      expect(response.status).toEqual(404);
      expect(response.body.err).toEqual("Não existe está sala no banco de dados");
    }catch(err){throw err}
  });
});

describe("Authenticação", () => {
  test("Deve me retornar o token quando logar", async () => {
    try {
      let response = await request
        .post("/login")
        .send({ password: USER_TEST.password, email: USER_TEST.email });
      expect(response.statusCode).toEqual(200);
      expect(response.body.token).toBeDefined();
    } catch (err) {
      throw err;
    }
  });
  test("Deve me retornar 404 por não existe o usuario", async () => {
    try {
      let response = await request
        .post("/login")
        .send({ password: 'teste', email: `${Date.now()}dfas845@gmail.com` });
      expect(response.statusCode).toEqual(404);
      expect(response.body.err).toEqual('Usuario não existe')
    } catch (err) {
      throw err;
    }
  });
  test("Deve impedir o login de senhas que não concidem", async () => {
    try {
      let response = await request
        .post("/login")
        .send({ password: 'teste', email: USER_TEST.email });
      expect(response.statusCode).toEqual(400);
      expect(response.body.err).toEqual('Credenciais invalidas')
    } catch (err) {
      throw err;
    }
  });
});