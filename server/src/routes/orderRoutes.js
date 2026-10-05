import { Router } from 'express';
import { placeOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/mine', getMyOrders);

export default router;
