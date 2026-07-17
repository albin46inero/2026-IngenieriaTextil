# Ingeniería Textil – UPEA

Plataforma web institucional desarrollada para la **Carrera de Ingeniería Textil** de la Universidad Pública de El Alto (UPEA). Sitio moderno, responsive y auditado bajo estándares de seguridad, diseñado para difundir información académica, historia institucional, publicaciones, eventos, videos, autoridades, cursos, convocatorias, gaceta, ofertas, servicios y contacto institucional.

Desarrollado con **React + Vite**, con consumo de API REST institucional, componentes personalizados y almacenamiento de assets en MinIO.

---

## ️ Tecnologías Utilizadas

 Categoría  Herramientas 
 **Build Tool**  Vite 
 **Framework**  React 18/19 
 **Lenguaje**  JavaScript (ES6+) 
 **Enrutamiento**  React Router DOM 
 **HTTP Client**  Axios 
 **Estilos**  CSS + CSS Variables dinámicas 
 **Animaciones**  CSS Transitions / Animaciones personalizadas 
 **Iconos**  SVG personalizados 
 **Control**  Git & GitHub 
 **Almacenamiento**  MinIO (`archivosminio.upea.bo`) 
 **Backend/API**  REST API institucional (`apiadministrador.upea.bo`) 
 **Seguridad**  Validación de URLs, `rel="noopener noreferrer"`, Sanitización XSS 

---

##  Características Principales

###  Diseño Dinámico
- **Colores institucionales** consumidos en tiempo real desde la API (`colorinstitucion`)
- Variables CSS dinámicas (`--color-primario`, `--color-secundario`, `--color-terciario`)
- **ColorSync** para sincronización dinámica de colores
- Componentes personalizados y reutilizables

###  100% Responsive
- Adaptado para móviles, tablets y escritorio
- Menú hamburguesa animado para dispositivos móviles
- Grid layouts con CSS moderno

###  Seguridad Implementada
- **Validación estricta de URLs** con whitelist de dominios
- **Sanitización de contenido HTML** contra XSS
- **Enlaces externos seguros** con `rel="noopener noreferrer"`
- **Manejo de errores sin exposición** de información sensible
- **Componente ErrorNetwork** para manejo de errores de red
- **404Page** para rutas no encontradas

###  Multimedia Integrada
- **GacetaCarousel** para rotación de gacetas universitarias
- **HeroBanner** con imágenes optimizadas
- **VideoVision** para videos institucionales embebidos
- **MarqueeText** para texto en movimiento
- **LogosBar** para mostrar logos institucionales
- **Imágenes optimizadas** con lazy loading y formatos WebP

###  Navegación Avanzada
- **Routing SPA** con React Router DOM (navegación sin recargar la página)
- **Rutas dinámicas** para convocatorias, cursos, eventos, publicaciones, servicios, gaceta, ofertas
- **Scroll suave** a secciones con anclas
- **QuickAccess** para accesos rápidos
- **AppWrapper** para envoltura de la aplicación

###  Componentes Personalizados
- **Autoridades**: Visualización de autoridades de la carrera
- **CategoriesExplorer**: Explorador de categorías
- **LatestConvocatorias**: Últimas convocatorias
- **LatestCursos**: Últimos cursos
- **MisionVisionAcordion**: Acordeón de misión y visión
- **SidebarCustom**: Sidebar personalizado
- **HeaderPsicologia**: Header personalizado
- **FooterPsicologia**: Footer personalizado

###  Rendimiento Optimizado
- **Code-splitting** automático de Vite
- **Lazy loading** de componentes y rutas
- **Carga prioritaria** en imágenes del hero (LCP)
- **Optimización de imágenes** con formatos AVIF y WebP
- **Build optimizado** en carpeta `dist/`

---

##  Lo que hace 

- Renderiza una interfaz SPA (Single Page Application) con **React + Vite**
- Consume **4 endpoints REST** de la API administrativa UPEA
- Aplica **temas dinámicos** con colores desde `colorinstitucion` API
- Implementa **routing por vistas** (`Convocatorias`, `Cursos`, `Eventos`, `Gaceta`, `Ofertas`, `Publicaciones`, `Servicios`, `Videos`, `About`, `Contact`, `Home`)
- Visualiza **PDFs** mediante enlaces con `target="_blank"` y `rel="noopener noreferrer"`
- Integra **iframes de YouTube** y **Google Maps**
- Procesa y muestra **imágenes desde MinIO** (`archivosminio.upea.bo`)
- Gestiona estados con **React Hooks** (`useState`, `useEffect`, `useRef`)
- Aplica **animaciones con CSS** y transiciones personalizadas
- Genera **build optimizado** con `npm run build`
- Implementa **manejo de errores** con componentes ErrorNetwork y 404Page

---

##  Estructura del Proyecto

```text
 public/                 # Assets estáticos
 decoradores/        # Elementos decoradores
 gif/                # Animaciones GIF
 logo/               # Logos institucionales
 png_decoradores/    # Decoradores PNG
 icons.svg           # Iconos SVG
 logo-ico # Favicon
 logo-png # Logo PNG
 pdf.worker.min.mjs  # Worker para PDFs
 upeaLogo_1.ico      # Logo UPEA
 upeaLogo.svg        # Logo UPEA SVG
 src/
 assets/             # Recursos estáticos
 hero.png        # Imagen del hero
 react.svg       # Logo React
 vite.svg        # Logo Vite
 components/         # Componentes reutilizables
 index_comp/     # Componentes principales:
 QuickAccess.jsx         # Accesos rápidos
 VideoVision.jsx         # Video institucional
 ColorSync.jsx           # Sincronización de colores
 FooterPsicologia.jsx    # Footer personalizado
 HeaderPsicologia.jsx    # Header personalizado
 SidebarCustom.jsx       # Sidebar personalizado
 config/
 constants.js        # Constantes de la aplicación
 pages/
 404Page.jsx         # Página 404
 AppWrapper.jsx      # Envoltura de la app
 ErrorNetwork.jsx    # Error de red
 router/
 index.jsx           # Configuración de rutas
 services/
 axiosConfig.js      # Configuración de Axios
 psicologiaService.js # Servicio de API
 utils/
 imageHelper.js      # Helper de imágenes
 views/              # Vistas principales
 Convocatorias/
 ConvocatoriasView.jsx
 DetalleConvocatoria.jsx
 Cursos/
 CursosView.jsx
 DetalleCurso.jsx
 Eventos/
 EventosView.jsx
 DetalleEvento.jsx
 Gaceta/
 GacetaView.jsx
 DetalleGaceta.jsx
 Ofertas/
 OfertasView.jsx
 DetalleOferta.jsx
 Publicaciones/
 PublicacionesView.jsx
 DetallePublicacion.jsx
 Servicios/
 ServiciosView.jsx
 DetalleServicio.jsx
 Videos/
 VideosView.jsx
 DetalleVideo.jsx
 AboutView.jsx       # Sobre Nosotros
 ContactView.jsx     # Contacto
 HomeView.jsx        # Página principal
 index.css           # Estilos globales
 main.jsx            # Punto de entrada de Vite
 .env                    # Variables de entorno
 .env.copy               # Template de variables de entorno
 .gitignore
 eslint.config.js        # Configuración de ESLint
 index.html              # HTML principal
 package.json
 vite.config.js          # Configuración de Vite
 README.md

```
 ## Variables de Entorno
```
##  URL de la API para el consumo de datos
VITE_ROOT_API

##  Token de Desarrollo
VITE_TOKEN

##  Login administrador
VITE_LOGIN_ADM

##  ID PARA LA CARRERA DEINGENIERIA TEXTIL
VITE_ID_INSTITUCION

```
## Endpoints Principales
```
GET /institucionesPrincipal/{29}
GET /institucion/{29}/recursos
GET /institucion/{29}/contenido
GET /institucion/{29}/gacetaEventos

```
## Probar Endpoints

# 1. Institución Principal
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/{XX}" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 2. Recursos Institucionales
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/recursos" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 3. Contenido Dinámico
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/contenido" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

# 4. Gacetas y Eventos
curl -X GET "https://apiadministrador.upea.bo/api/v2/institucion/{XX}/gacetaEventos" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json"

## Instalacion y Ejecucion

# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/2026-IngenieriaTextil.git
cd 2026-IngenieriaTextil

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
# Copiar las variables de entorno descritas arriba
# Reemplazar VITE_ID_INSTITUCION y VITE_ID_CARRERA con los IDs reales

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173 

# Build optimizado para producción
npm run build

##  Notas Operativas

### Solución de Problemas Comunes

- **"Error al cargar datos"**: Verificar conexión a internet y que la API de la UPEA esté respondiendo
- **Imágenes no se visualizan**: Verificar que la URL comience con `https://archivosminio.upea.bo` y que la variable `VITE_MINIO_BASE_URL` esté bien configurada
- **Los datos no corresponden a la carrera esperada**: Verificar que las variables `VITE_ID_INSTITUCION` y `VITE_ID_CARRERA` en `.env` estén correctas
- **Ruta no encontrada (404)**: Revisar que la ruta esté correctamente definida en `src/components/index_comp/router/index.jsx`
- **Puerto 5173 ocupado**: Vite asignará automáticamente otro puerto, o puedes usar `npm run dev -- --port 3000`
- **Variables de entorno no cargan**: Reiniciar el servidor de desarrollo (`Ctrl + C` y luego `npm run dev`) después de crear o modificar el archivo `.env`
- **El HTML se muestra como texto plano**: Asegúrate de usar `dangerouslySetInnerHTML` en React para renderizar contenido HTML crudo de la API
- **Error de red**: Verificar que el servicio `psicologiaService.js` esté correctamente configurado con las URLs de la API
- **Los colores no se sincronizan**: Verificar que el componente `ColorSync.jsx` esté importado y funcionando correctamente

### Buenas Prácticas

- **Nunca subas el archivo `.env` a GitHub**. Ya está incluido en `.gitignore`.
- Usa `dangerouslySetInnerHTML` con precaución y sanitiza el contenido HTML que viene de la API para prevenir XSS
- Para cambios de colores institucionales, modifica directamente en el panel administrativo de la API; el frontend lo reflejará automáticamente al recargar
- Mantén las dependencias actualizadas ejecutando `npm audit` periódicamente
- Usa componentes reutilizables en `src/components/index_comp/` para mantener el código DRY (Don't Repeat Yourself)
- Centraliza el consumo de API en `src/components/index_comp/services/psicologiaService.js`
- Usa `axiosConfig.js` para configuración global de Axios (timeouts, interceptores, headers)
- Utiliza `imageHelper.js` para validar y sanitizar URLs de imágenes
- Implementa `ErrorNetwork.jsx` para manejar errores de conexión de forma amigable
- Usa `constants.js` para centralizar constantes y configuraciones de la aplicación
- Aprovecha los componentes personalizados (`QuickAccess`, `MarqueeText`, `LogosBar`) para mejorar la experiencia de usuario
- Genera builds optimizados con `npm run build` antes de desplegar a producción

---

##  Recomendación Final

Se recomienda mantener este repositorio con las siguientes responsabilidades:

- Frontend **React + Vite** exclusivo para visualización de datos institucionales
- **Nada de lógica de negocio compleja** en el cliente (validaciones simples sí, reglas de negocio no)
- **Nada de almacenamiento local sensible** (evitar `localStorage` para datos de usuarios, usarlo solo para preferencias de UI)
- Todo el consumo de datos debe ser vía **API REST** a través de servicios centralizados
- **Builds optimizados** en la carpeta `dist/` para despliegue en producción
- Seguridad implementada en frontend (validación de URLs, sanitización de HTML, enlaces seguros)
- Mantener la estructura de carpetas modular y escalable
- Usar componentes reutilizables en `src/components/index_comp/`
- Implementar rutas dinámicas para detalles de convocatorias, cursos, eventos, etc.
- Auditorías visuales periódicas para garantizar que los enlaces a redes sociales y documentos externos abran en pestañas nuevas de forma segura (`rel="noopener noreferrer"`)
- Mantener actualizados los assets en `public/` (logos, decoradores, GIFs)
- **Verificar los IDs de institución y carrera** correctos antes de hacer deploy a producción
- Usar `useEffect` y `useState` de React de manera eficiente para evitar re-renders innecesarios
- Implementar **lazy loading** en componentes pesados para mejorar el rendimiento inicial
- Optimizar imágenes en `public/` para reducir el tamaño del build final

































# Sitio Web de la Carrera de ingenieria textil

Proyecto React + Vite para los sitio web de la carrera de ingenieria textil de la Upea

> **Nota** Este proyecto fue desarrollado con React 19 y Vite. Antes de probar, asegúrate de tener Node.js instalado, copiar el archivo `.env` con los valores correctos, y ejecutar `npm install` para instalar las dependencias.

---

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Levanta en `http://localhost:5173`

## Producción

```bash
npm run build
```

---


## Stack

- React 19
- Vite 8
- React Router 7
- Axios
- Tailwind CSS 4
- Motion (Framer Motion)
- Lucide React
- Recharts