# 🎮 Plataforma de Juegos y CRM (Backend & API)

Este proyecto es el núcleo (entorno servidor) de una plataforma de juegos modular. Desde la perspectiva del usuario final, funciona como un portal para acceder y jugar; sin embargo, técnicamente está diseñado como un **CRM robusto** que gestiona usuarios, roles, catálogo de juegos y expone servicios web para aplicaciones cliente independientes

Está diseñado con una arquitectura monolítica modular, separando responsabilidades entre vistas (Inertia/React) y servicios web (API).

## Arquitectura del Sistema (Monorepo)

El proyecto está diseñado bajo una arquitectura monolítica modular y escalable, separando estrictamente las responsabilidades:

1. **Laravel CRM (`routes/web.php`):** Renderiza las vistas (Inertia/React) para la gestión humana (usuarios, roles, juegos y monitorización).
2. **Laravel API (`routes/api.php`):** Expone endpoints RESTful sin estado (JSON) consumidos exclusivamente por los juegos cliente.
3. **Juegos Cliente:** Archivos estáticos externos (Three.js) que se comunican con la API.
4. **Microservicio Python:** Contenedor Docker independiente para el reconocimiento facial biológico.
5. **Laravel Reverb:** Servidor nativo de WebSockets para el chat y notificaciones en tiempo real.


## Uso del MCP
Este repositorio utiliza plantillas de Issues y PRs estructuradas para ser consumidas y analizadas mediante el MCP oficial de Laravel, garantizando la consistencia en el código base.

## Tecnologías Utilizadas

El proyecto se apoya en un stack moderno, priorizando la separación de responsabilidades y la seguridad:

- **Laravel 11 (Framework PHP):** Es el corazón de la aplicación. Gestiona el enrutamiento, la autenticación, la conexión a la base de datos y la exposición de la API RESTful.
- **PostgreSQL:** Base de datos relacional elegida por su robustez para gestionar datos que evolucionan (usuarios, roles, sesiones, eventos de juegos).
- **Laravel Breeze + React + Inertia.js:** Se utiliza para la capa de vistas del CRM. Inertia permite usar React para construir una interfaz dinámica (SPA) sin perder el enrutamiento y la seguridad gestionada por Laravel.
- **Tailwind CSS:** Para un diseño rápido, responsivo y profesional en los paneles de gestión.
- **Laravel Sanctum:** Para la autenticación y protección de los servicios web (API), asegurando que solo los juegos con una sesión válida puedan enviar datos al servidor.

---

## Roles de la Aplicación

- Un **Jugador** pueda acceder al catalogo de juegos publicados y jugar a ellos. No tiene acceso a la gestión interna del sistema.
- Un **Gestor** pueda crear, ver, publicar, despublicar, modificar y eliminar juegos. No gestiona usuarios ni roles.
- Un **Administrador** pueda gestionar usuarios, asignar roles y mantener la configuración general del sistema (no participa en los juegos como jugador).

## Implementación de la Práctica

### 1. Base de Datos y ORM

Se ha configurado la conexión a PostgreSQL mediante el archivo `.env`. La estructura de datos se ha levantado utilizando **Migraciones** de Laravel para tener control de versiones sobre la base de datos. Las relaciones entre tablas se gestionan mediante el ORM **Eloquent**:

- Relación Muchos a Muchos entre `Users` y `Roles` (tabla pivote `role_user`).
- Relación Uno a Muchos entre `Users` (creadores/gestores) y `Games`.

### 2. Autenticación, Roles y Seguridad

El sistema cuenta con autenticación real sin simulaciones. Se han definido tres roles clave: **Administrador, Gestor y Jugador**.
La autorización se aplica estrictamente en el servidor a través de un **Middleware personalizado (`CheckRole`)**, garantizando que:

- Un jugador no pueda acceder al panel de gestión, incluso si conoce la URL.
- Un gestor solo pueda ver y modificar los juegos que le pertenecen.

### 3. Panel de Gestión de Juegos (CRM)

Los usuarios con rol de _Gestor_ tienen acceso a un CRUD completo desarrollado en React.

- **Validación de datos:** Se utilizan `Form Requests` (`StoreGameRequest` y `UpdateGameRequest`) para validar la entrada de datos en el servidor antes de interactuar con la base de datos.
- **Gestión de estado:** Permite publicar o despublicar juegos dinámicamente, decidiendo qué contenido es visible para los jugadores.

### 4. Experiencia del Jugador

El usuario _Jugador_ accede a un catálogo filtrado (`is_published = true`). Al seleccionar un juego, este se carga incrustado (`iframe`) dentro del contexto de la plataforma manteniendo el menú de navegación superior.

Esto prepara el terreno para que el juego cliente (Three.js/JavaScript) funcione de manera independiente, alojado en servidores externos (ej. Vercel), comunicándose con Laravel única y exclusivamente a través de los endpoints de `api.php`.

---

## Instalación y Despliegue Local

1.  Clonar el repositorio.
2.  Instalar dependencias de PHP: `composer install`
3.  Instalar dependencias de Node: `npm install`
4.  Configurar el archivo `.env` con las credenciales de PostgreSQL.
5.  Generar la clave de la aplicación: `php artisan key:generate`
6.  Ejecutar las migraciones y los seeders (para crear los roles y usuarios de prueba):
    ```bash
    php artisan migrate:fresh --seed
    ```
7.  Levantar los servidores de desarrollo:
    - Servidor PHP: `php artisan serve`
    - Compilación de Vite: `npm run dev`
    - Servidor Reverb: `php artisan reverb:start`
    - Servidor de Colas: `php artisan queue:work`


# Configuración del Sistema de Comunicación en Tiempo Real

Para implementar el chat y las notificaciones en tiempo real, se ha utilizado **Laravel Reverb** como servidor de WebSockets nativo. A continuación, se detallan los comandos ejecutados para su configuración:

### 1. Instalación de la Infraestructura
- `php artisan install:broadcasting`: Comando maestro que instala Laravel Reverb, configura el archivo `channels.php` y descarga las dependencias necesarias de Echo para el frontend.
- `composer require pusher/pusher-php-server`: Instalación del SDK de PHP necesario para que Laravel pueda comunicarse con el servidor Reverb (utilizando el protocolo compatible con Pusher).

### 2. Preparación de la Base de Datos
- `php artisan queue:table`: Crea la migración para la tabla de "jobs". Es necesaria porque el envío de eventos se realiza en segundo plano (Queues) para no ralentizar la respuesta al usuario.
- `php artisan migrate`: Ejecuta las migraciones pendientes (mensajes, colas de trabajo y sesiones) para asegurar la persistencia de los datos.

### 3. Generación de Lógica de Negocio
- `php artisan make:model Message -mc`: Genera el modelo `Message` junto con su migración y su controlador, permitiendo gestionar el historial del chat.
- `php artisan make:event MessageSend`: Crea la clase de evento que se encarga de "difundir" (broadcast) los mensajes a través de los WebSockets hacia los clientes conectados.

### 4. Mantenimiento y Caché
- `php artisan config:clear`: Limpia la caché de configuración para asegurar que Laravel lea las nuevas variables del archivo `.env` (como las claves de Reverb) correctamente.



## Info sobre las Terminales 

- php artisan serve - Levanta el servidor PHP en el puerto 8000. Se encarga de procesar las rutas web, la API, la autenticación y la conexión a PostgreSQL.*

- npm run dev - Compila los componentes .jsx de React (Inertia) y los estilos de Tailwind CSS al vuelo cada vez que hay un cambio.*

- php artisan reverb:start - Mantiene una conexión abierta con los navegadores. Recibe los eventos de Laravel y los "difunde" (broadcast) instantáneamente a los usuarios conectados a la sala de chat.* --- Esta fallando al descargarse

- php artisan queue:work - Procesa las tareas en segundo plano, como el envío de mensajes en tiempo real.