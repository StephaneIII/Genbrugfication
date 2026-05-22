import { Router } from 'express'
import {
  addTrashToOpenCheckout,
  deleteOpenCheckoutTrash,
  getOpenCheckoutByUserId,
  lockOpenCheckoutByUserId,
  scoreCheckoutByMonth,
  scoreCheckoutByUserId,
  updateOpenCheckoutTrashAmount,
} from '../controllers/Checkout.controlller.js'

const checkoutRouter = Router()

checkoutRouter.get('/checkout/open/:userId', getOpenCheckoutByUserId)
checkoutRouter.post('/checkout/open/:userId/items', addTrashToOpenCheckout)
checkoutRouter.put('/checkout/open/:userId/items/:trashId', updateOpenCheckoutTrashAmount)
checkoutRouter.delete('/checkout/open/:userId/items/:trashId', deleteOpenCheckoutTrash)
checkoutRouter.post('/checkout/open/:userId/lock', lockOpenCheckoutByUserId)
checkoutRouter.get('/checkout/score/month/:userId', scoreCheckoutByMonth)
checkoutRouter.get('/checkout/score/user/:userId', scoreCheckoutByUserId)
checkoutRouter.get('/checkout/score/:userId', scoreCheckoutByUserId)

export default checkoutRouter
