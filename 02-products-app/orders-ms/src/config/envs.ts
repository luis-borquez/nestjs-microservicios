import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),
}
