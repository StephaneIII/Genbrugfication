import { Router } from 'express'
import {
  addTrashToOpenCheckout,
  deleteOpenCheckoutTrash,
  getOpenCheckoutByUID,
  lockOpenCheckoutByUID,
  scoreCheckoutByMonth,
  scoreCheckoutByUID,
  updateOpenCheckoutTrashAmount,
} from '../controllers/Checkout.controlller.js'

const checkoutRouter = Router()

checkoutRouter.get('/checkout/open/:UID', getOpenCheckoutByUID)
checkoutRouter.post('/checkout/open/:UID/items', addTrashToOpenCheckout)
checkoutRouter.put('/checkout/open/:UID/items/:trashId', updateOpenCheckoutTrashAmount)
checkoutRouter.delete('/checkout/open/:UID/items/:trashId', deleteOpenCheckoutTrash)
checkoutRouter.post('/checkout/open/:UID/lock', lockOpenCheckoutByUID)
checkoutRouter.get('/checkout/score/month/:UID', scoreCheckoutByMonth)
checkoutRouter.get('/checkout/score/user/:UID', scoreCheckoutByUID)
checkoutRouter.get('/checkout/score/:UID', scoreCheckoutByUID)

export default checkoutRouter
