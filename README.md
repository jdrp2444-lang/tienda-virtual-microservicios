# Tienda Virtual Local

Proyecto de la asignatura **DevOps – WebApps** (Universidad de Manizales).
Docente: Jhonathan Rodriguez Ramirez.

## Integrantes
- Juan Diego lozada

## Problema

Los pequeños comerciantes no cuentan con una forma sencilla y organizada de vender en línea, gestionar su catálogo y controlar los pedidos de sus clientes. Además, sin un control de acceso, cualquier persona podría modificar productos o ver pedidos de otros usuarios.

## Solución propuesta

Una tienda virtual construida con **microservicios** en Node.js, donde cada servicio tiene una única responsabilidad y toda petición entra por un **API Gateway** que valida la identidad del usuario mediante **JWT**.

- **MS Usuarios:** registra usuarios, autentica (login) y genera el JWT.
- **MS Productos:** administra el catálogo (listar, consultar, crear, editar y eliminar).
- **MS Pedidos:** registra los pedidos de cada cliente. Un cliente solo ve sus pedidos; el administrador ve todos.
- **API Gateway:** única puerta de entrada. Valida el JWT, controla los roles y reenvía la petición al microservicio correspondiente.

### Usuarios del sistema

| Rol | Qué puede hacer |
|---|---|
| Cliente | Consultar productos, crear pedidos y ver sus propios pedidos |
| Administrador | Todo lo anterior, además de gestionar productos, ver todos los pedidos y cambiar su estado |

## Tecnologías utilizadas

- Node.js
- Express
- Axios (comunicación del Gateway con los microservicios)
- jsonwebtoken (generación y validación del JWT)
- bcryptjs (encriptación de contraseñas)
- Git y GitHub (control de versiones con ramas por microservicio)
- Postman y curl (pruebas)
- Docker y Docker Compose (contenerización)
- Docker Hub (publicación de imágenes)
- GitHub Actions (integración continua)
- Zabbix (herramienta de monitoreo investigada)

## Arquitectura

```
Cliente
   │  JWT (Authorization: Bearer <token>)
   ▼
API Gateway (3000)  ← valida JWT y rol
   │
   ├──► MS Usuarios  (3001)
   ├──► MS Productos (3002)
   └──► MS Pedidos   (3003)
```

Cada microservicio está organizado por capas, y cada una tiene una responsabilidad específica:

```
Routes → Controller → Service → Repository → Base de datos
```

| Capa | Responsabilidad |
|---|---|
| Routes | Define qué URL llama a qué función del controller |
| Controller | Recibe la petición HTTP y devuelve la respuesta con el código correcto |
| Service | Contiene la lógica de negocio y las validaciones |
| Repository | Guarda y consulta los datos; no conoce HTTP ni reglas de negocio |
| Model | Define la estructura de los datos |

**Ventajas de esta arquitectura:** cada capa se puede entender, probar y modificar por separado; la lógica de negocio no depende de HTTP; y se puede cambiar la persistencia (por ejemplo, a MySQL o MongoDB) modificando solo la capa Repository.

> Los datos se guardan en memoria dentro del Repository, por lo que se reinician al apagar cada servicio.

### Estructura del proyecto

```
tienda-virtual-microservicios/
├── gateway/
│   └── src/ (middlewares, routes, app.js)
├── ms-usuarios/
│   └── src/ (controllers, services, repositories, routes, models, app.js)
├── ms-productos/
│   └── src/ (controllers, services, repositories, routes, models, app.js)
├── ms-pedidos/
│   └── src/ (controllers, services, repositories, routes, models, app.js)
└── README.md
```

## Seguridad: JWT

**¿Qué es JWT?** JSON Web Token es un token firmado digitalmente que el servidor entrega al iniciar sesión. Contiene datos del usuario (id, correo y rol) y una firma que permite verificar que no fue alterado, sin necesidad de guardar sesiones en el servidor.

**Flujo:**

1. El usuario hace login en `POST /auth/login` y MS Usuarios genera el token (dura 1 hora).
2. El cliente envía el token en cada petición: `Authorization: Bearer <token>`.
3. El Gateway verifica la firma y, si es válida, reenvía la petición agregando los headers `x-usuario-id` y `x-usuario-rol`.

**Autenticación vs. autorización:**

- **Autenticación:** verifica quién eres. Si el token falta o es inválido, el Gateway responde **401**.
- **Autorización:** verifica qué puedes hacer. Si eres cliente e intentas crear un producto, el Gateway responde **403**.

## Endpoints

Todas las peticiones se hacen al Gateway (`http://localhost:3000`).

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| GET | `/usuarios/:id` | Token válido |
| GET | `/productos` | Token válido |
| GET | `/productos/:id` | Token válido |
| POST | `/productos` | Solo admin |
| PUT | `/productos/:id` | Solo admin |
| DELETE | `/productos/:id` | Solo admin |
| POST | `/pedidos` | Token válido |
| GET | `/pedidos` | Token válido (cliente: los suyos; admin: todos) |
| GET | `/pedidos/:id` | Token válido |
| PUT | `/pedidos/:id/estado` | Solo admin |

## Cómo ejecutar

### Opción A: con Docker (recomendada)

Requisitos: Docker Desktop y Git.

```bash
git clone https://github.com/jdrp2444-lang/tienda-virtual-microservicios.git
cd tienda-virtual-microservicios
docker compose up --build
```

El Gateway queda disponible en `http://localhost:3000`. Para apagar todo: `docker compose down`.

Para usar las imágenes ya publicadas en Docker Hub, sin construirlas:

```bash
docker compose pull
docker compose up
```

### Opción B: sin Docker

Requisitos: Node.js y Git.

```bash
git clone https://github.com/jdrp2444-lang/tienda-virtual-microservicios.git
cd tienda-virtual-microservicios
```

En **cuatro terminales**, una por servicio:

```bash
cd ms-usuarios  && npm install && node src/app.js   # puerto 3001
cd ms-productos && npm install && node src/app.js   # puerto 3002
cd ms-pedidos   && npm install && node src/app.js   # puerto 3003
cd gateway      && npm install && node src/app.js   # puerto 3000
```

## Pruebas del JWT

Con `GET http://localhost:3000/productos`:

| Prueba | Resultado esperado |
|---|---|
| Sin token | 401 "Token no enviado" |
| Token falso | 401 "Token inválido o expirado" |
| Token válido | 200 con la lista de productos |

Con `POST http://localhost:3000/productos`:

| Token | Resultado esperado |
|---|---|
| Cliente | 403 "No tienes permisos para esta acción" |
| Administrador | 201 producto creado |

## Contenerización con Docker

Cada microservicio tiene su propio `Dockerfile` y `.dockerignore`. Un `docker-compose.yml` en la raíz levanta los cuatro servicios en una red interna.

- Imagen base: `node:24-alpine`.
- Solo el Gateway publica un puerto (3000). Los demás microservicios solo son accesibles dentro de la red de Docker, por lo que el Gateway es la única entrada.
- El Gateway encuentra a los demás servicios por su nombre (`ms-usuarios`, `ms-productos`, `ms-pedidos`) mediante variables de entorno.

Imágenes publicadas en Docker Hub:

| Servicio | Imagen |
|---|---|
| Gateway | `juanda444/tienda-gateway` |
| MS Usuarios | `juanda444/tienda-ms-usuarios` |
| MS Productos | `juanda444/tienda-ms-productos` |
| MS Pedidos | `juanda444/tienda-ms-pedidos` |

## Integración continua (GitHub Actions)

El workflow `.github/workflows/ci.yml` se ejecuta en cada push a `main`:

1. **Checkout** del código.
2. **Instalación de dependencias** (`npm ci`) de MS Usuarios y MS Productos.
3. **Pruebas básicas** (`npm test`, con el ejecutor de pruebas integrado de Node).
4. **Construcción** de la imagen Docker de cada servicio.
5. **Push** de las imágenes a Docker Hub.

Los trabajos de Docker solo corren si las pruebas pasan. Las credenciales de Docker Hub se guardan como secretos del repositorio (`DOCKERHUB_TOKEN`), nunca dentro del código.

## Monitoreo (Zabbix)

Zabbix es una plataforma de monitoreo de infraestructura. Sus componentes principales son el servidor, la base de datos, la interfaz web y los agentes, que se instalan en las máquinas monitoreadas y envían métricas como CPU y memoria. Sobre esas métricas se definen triggers (por ejemplo, "CPU superior al 80%") y acciones que generan alertas. En este proyecto se investigó la herramienta a nivel teórico y no se implementó.

## Flujo de trabajo con Git

Cada microservicio se desarrolló en su propia rama (`ms-usuarios`, `ms-productos`, `ms-pedidos` y `gateway`). La contenerización se hizo en la rama `docker` y el pipeline en la rama `ci`. Todo se integró en `main` mediante `merge`.