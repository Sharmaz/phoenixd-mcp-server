import { registerGetBalanceTool } from './get_balance.js';
import { registerGetNodeInfoTool } from './get_node_info.js';
import { registerListChannelsTool } from './list_channels.js';
import { registerCloseChannelTool } from './close_channel.js';
import { registerDecodeInvoiceTool } from './decode_invoice.js';
import { registerDecodeOfferTool } from './decode_offer.js';
import { registerCreateInvoiceTool } from './create_invoice.js';
import { registerPayInvoiceTool } from './pay_invoice.js';
import { registerCreateOfferTool } from './create_offer.js';
import { registerPayOfferTool } from './pay_offer.js';
import { registerPayLightningAddressTool } from './pay_lightning_address.js';
import { registerPayOnChainTool } from './pay_on_chain.js';
import { registerBumpFeeTool } from './bump_fee.js';
import { registerListIncomingPaymentsTool } from './list_incoming_payments.js';
import { registerGetIncomingPaymentTool } from './get_incoming_payment.js';
import { registerListOutgoingPaymentsTool } from './list_outgoing_payments.js';
import { registerGetOutgoingPaymentTool } from './get_outgoing_payment.js';

export const tools = {
  registerGetBalanceTool,
  registerGetNodeInfoTool,
  registerListChannelsTool,
  registerCloseChannelTool,
  registerDecodeInvoiceTool,
  registerDecodeOfferTool,
  registerCreateInvoiceTool,
  registerPayInvoiceTool,
  registerCreateOfferTool,
  registerPayOfferTool,
  registerPayLightningAddressTool,
  registerPayOnChainTool,
  registerBumpFeeTool,
  registerListIncomingPaymentsTool,
  registerGetIncomingPaymentTool,
  registerListOutgoingPaymentsTool,
  registerGetOutgoingPaymentTool,
};
