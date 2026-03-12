import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { envs } from 'src/config';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(envs.STRIPE_SECRET);

    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
        const { currency, items, orderId } = paymentSessionDto;

        const lineItems = items.map(item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity
            };
        });

        const session = await this.stripe.checkout.sessions.create({
            // Id de order
            payment_intent_data: {
                metadata: {
                    orderId: orderId,
                }
            },

            line_items: lineItems,
            mode: 'payment',
            success_url: envs.STRIPE_SUCCESS_URL,
            cancel_url: envs.STRIPE_CANCEL_URL,
        });

        return session;
    }

    async stripeWebhook(req: Request, res: Response) {
        const endpointSecret = envs.STRIPE_WEBHOOK_SECRET;
        const signature = req.headers['stripe-signature'];
        let event: Stripe.Event;

        if (!endpointSecret || !signature) {
            return res.sendStatus(400);
        }

        try {
            event = Stripe.webhooks.constructEvent(
                req['rawBody'],
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }

        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceded = event.data.object;

                console.log({
                    metadata: chargeSucceded.metadata,
                    orderId: chargeSucceded.metadata.orderId
                });
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }

        return res.sendStatus(200);
    }
}
