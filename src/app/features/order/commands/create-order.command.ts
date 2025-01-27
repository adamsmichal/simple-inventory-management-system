import { CreateOrderPayload } from '../model/order.model';

export class CreateOrderCommand {
  type = 'CREATE_ORDER';
  constructor(public payload: CreateOrderPayload) {}
}
