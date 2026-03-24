# 🎮 Plataforma de Juegos y CRM (Backend & API)

Este proyecto es el núcleo (entorno servidor) de una plataforma de juegos modular. Desde la perspectiva del usuario final, funciona como un portal para acceder y jugar; sin embargo, técnicamente está diseñado como un **CRM robusto** que gestiona usuarios, roles, catálogo de juegos y expone servicios web para aplicaciones cliente independientes

---

## Tecnologías Utilizadas

El proyecto se apoya en un stack moderno, priorizando la separación de responsabilidades y la seguridad:

- **Laravel 11 (Framework PHP):** Es el corazón de la aplicación. Gestiona el enrutamiento, la autenticación, la conexión a la base de datos y la exposición de la API RESTful.
- **PostgreSQL:** Base de datos relacional elegida por su robustez para gestionar datos que evolucionan (usuarios, roles, sesiones, eventos de juegos).
- **Laravel Breeze + React + Inertia.js:** Se utiliza para la capa de vistas del CRM. Inertia permite usar React para construir una interfaz dinámica (SPA) sin perder el enrutamiento y la seguridad gestionada por Laravel.
- **Tailwind CSS:** Para un diseño rápido, responsivo y profesional en los paneles de gestión.
- **Laravel Sanctum:** Para la autenticación y protección de los servicios web (API), asegurando que solo los juegos con una sesión válida puedan enviar datos al servidor.

---

## Arquitectura del Proyecto

El proyecto está diseñado bajo una arquitectura modular y escalable, preparada para integraciones futuras:

1.  **Monorepo Backend:** El repositorio contiene tanto el código fuente de Laravel como el espacio preparado para el futuro microservicio de Python (Docker).
2.  **Separación Web vs. API:** Se ha respetado estrictamente la separación de responsabilidades:
    - `routes/web.php`: Renderiza las vistas del CRM (React/Inertia) para la gestión visual y navegación humana.
    - `routes/api.php`: Expone endpoints sin estado (JSON) destinados a ser consumidos exclusivamente por los juegos cliente (desarrollados en Three.js).

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
