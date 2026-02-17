# Products Microservice

## Dev
1. Crear archivo <i>.env</i> en base a <i>.env.template</i>
2. Configurar las variables de entorno necesarias
3. Instalar dependencias: `npm install`
4. Levantar el servidor de NATS
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
5. Ejecutar migraciones de base de datos con el comando `npx prisma migrate dev`
6. Iniciar la aplicación con el comando `npm run start:dev`
