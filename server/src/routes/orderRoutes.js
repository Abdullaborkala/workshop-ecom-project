import { Router } from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/mine', getMyOrders);

router.get('/', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

export default router;
