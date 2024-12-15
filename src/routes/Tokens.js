import Token from '../controllers/User/TokenController.js'
import express from 'express'
const Router = express.Router()

Router.post('/recoverpassword', Token.CreateToken)

export default Router