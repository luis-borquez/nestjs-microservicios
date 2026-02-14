import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),
    
    PRODUCTS_MICROSERVICE_HOST: env.get('PRODUCTS_MICROSERVICE_HOST').required().asString(),
    PRODUCTS_MICROSERVICE_PORT: env.get('PRODUCTS_MICROSERVICE_PORT').required().asPortNumber(),
}
