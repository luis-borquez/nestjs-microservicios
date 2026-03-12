import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    STRIPE_SECRET: env.get('STRIPE_SECRET').required().asString(),
    
    STRIPE_SUCCESS_URL: env.get('STRIPE_SUCCESS_URL').required().asString(),
    STRIPE_CANCEL_URL: env.get('STRIPE_CANCEL_URL').required().asString(),

    STRIPE_WEBHOOK_SECRET: env.get('STRIPE_WEBHOOK_SECRET').required().asString(),
}
