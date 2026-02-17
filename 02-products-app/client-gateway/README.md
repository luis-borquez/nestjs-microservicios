# API ClientGateway
El client-gateway es el punto de comunicación entre el cliente y los microservicios. Se encarga de recibir las peticiones, enviarlas a los servicios correspondientes y devolver la respuesta al cliente.

## Dev
1. Crear archivo <i>.env</i> en base a <i>.env.template</i>
2. Configurar las variables de entorno necesarias
3. Instalar dependencias: `npm install`
4. Levantar el servidor de NATS
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
5. Tener levantados los microservicios que se van a consumir
6. Iniciar la aplicación `npm run start:dev`
