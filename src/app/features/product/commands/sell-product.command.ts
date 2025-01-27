import { Command } from 'src/lib/cqrs/command-bus';

import { SellProductPayload } from '../models/product.models';

export class SellProductCommand implements Command<SellProductPayload> {
  type = 'SELL_PRODUCT';

  constructor(public payload: SellProductPayload) {}
}
