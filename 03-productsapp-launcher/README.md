# Products App
Proyecto con arquitectura de microservicios construida con NestJS, utilizando NATS para comunicación entre servicios y un gateway HTTP para exponer endpoints a los clientes. 

Contiene:
- [client-gateway](client-gateway): gateway/cliente que expone endpoints HTTP y se comunica por NATS.
- [products-ms](products-ms): microservicio de productos (Prisma + SQLite en desarrollo).
- [orders-ms](orders-ms): microservicio de órdenes (Postgres + Prisma).

Requisitos
---------
- Docker y Docker Compose instalados.
- Node.js y npm (opcional, si desea ejecutar servicios fuera de contenedores).

Ejecución en modo desarrollo (recomendada)
-----------------------------------------
1. Copie el archivo de ejemplo de variables de entorno si todavía no existe:
	```
    cp .env.template .env
    ```
    (Windows: copiar manualmente o usar PowerShell `Copy-Item`)

2. Inicializar y actualizar sub-módulos de Git (si es la primera vez que clona el repositorio):
    ```
    git submodule update --init --recursive
    ```

3. Levante los servicios con Docker Compose (se compilan y arranca en modo desarrollo según `docker-compose.yml`):
	```
    docker-compose up --build
    ```
	- Esto levantará `nats-server`, `client-gateway`, `products-ms`, `orders-ms` y la base de datos `orders-db`.
	- Los servicios montan los directorios `src` para recarga en caliente (`npm run start:dev`).

Ejecución manual de un servicio (sin Docker)
-------------------------------------------
1. Abra una terminal en la carpeta del servicio (por ejemplo `client-gateway`):
	```
    cd client-gateway
    ```

2. Instale dependencias e inicie en modo desarrollo:
    ```
    npm install
    ```
	```
    npm run start:dev
    ```

Notas importantes
-----------------
- Configure las variables en `.env` (puede partir de `.env.template`).
- `orders-ms` usa PostgreSQL en `orders-db` cuando se levanta con Docker Compose; si ejecuta `orders-ms` fuera de Docker, asegúrese de apuntar `POSTGRES_URL` a una base de datos Postgres accesible.
- Los puertos por defecto están en `.env` y `docker-compose.yml`. El gateway expone `CLIENT_GATEWAY_PORT` (por defecto `3000`).

Estructura del repositorio
--------------------------
- `client-gateway/` — gateway HTTP y controladores.
- `products-ms/` — microservicio de productos (Prisma + SQLite en dev).
- `orders-ms/` — microservicio de órdenes (Prisma + Postgres).

## Pasos para crear los Git Submodules

1. Crear un nuevo repositorio en GitHub
2. Clonar el repositorio en la máquina local
3. Añadir el submodule, donde `repository_url` es la url del repositorio y `directory_name` es el nombre de la carpeta donde quieres que se guarde el sub-módulo (no debe de existir en el proyecto)
```
git submodule add <repository_url> <directory_name>
```
4. Añadir los cambios al repositorio (git add, git commit, git push)
Ej:
```
git add .
git commit -m "Add submodule"
git push
```
5. Inicializar y actualizar Sub-módulos, cuando alguien clona el repositorio por primera vez, debe de ejecutar el siguiente comando para inicializar y actualizar los sub-módulos
```
git submodule update --init --recursive
```
6. Para actualizar las referencias de los sub-módulos
```
git submodule update --remote
```

## Importante
Si se trabaja en el repositorio que tiene los sub-módulos, **primero actualizar y hacer push** en el sub-módulo y **después** en el repositorio principal. 

Si se hace al revés, se perderán las referencias de los sub-módulos en el repositorio principal y tendremos que resolver conflictos.
