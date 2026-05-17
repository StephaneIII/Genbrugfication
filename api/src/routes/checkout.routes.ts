import { Router } from 'express'
import { scoreCheckoutByMonth, scoreCheckoutByUserId } from '../controllers/Checkout.controlller.js'

const checkoutRouter = Router()

checkoutRouter.get('/checkout/score/month/:userId', scoreCheckoutByMonth)
checkoutRouter.get('/checkout/score/user/:userId', scoreCheckoutByUserId)
checkoutRouter.get('/checkout/score/:userId', scoreCheckoutByUserId)

export default checkoutRouter
