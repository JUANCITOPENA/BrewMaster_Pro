# ☕ BrewMaster Pro - Aplicación de Pedidos de Café (Simulada) ☕

¡Bienvenido a BrewMaster Pro! Esta es una aplicación web simulada y altamente interactiva para pedir cafés premium. Diseñada para mostrar una experiencia de usuario fluida y moderna, similar a las aplicaciones móviles, pero construida completamente con tecnologías web estándar.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=font-awesome&logoColor=white)](https://fontawesome.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-FF4444?style=for-the-badge)](https://github.com/parallax/jsPDF)
[![html2canvas](https://img.shields.io/badge/html2canvas-F44336?style=for-the-badge)](https://html2canvas.hertzen.com/)

## ✨ Características Principales

*   **📱 Interfaz Estilo App Móvil:** Diseño responsivo que se adapta a diferentes tamaños de pantalla, optimizado para una experiencia similar a una aplicación nativa.
*   **🎨 Splash Screen Animado:** Una pantalla de bienvenida atractiva con el logo y eslogan de la marca.
*   **🎠 Carrusel de Productos Dinámico:**
    *   Navegación fluida entre diferentes tipos de café.
    *   Indicador de progreso visual (puntos).
    *   Soporte para gestos táctiles (swipe).
*   **🛍️ Selección de Productos Detallada:**
    *   Imágenes de alta calidad para cada producto.
    *   Títulos, subtítulos y descripciones.
    *   Precios que se actualizan dinámicamente según:
        *   📏 **Tamaño** (Pequeño, Mediano, Grande).
        *   💰 **Moneda** (DOP, USD, EUR, MXN - para productos seleccionados).
        *   🔢 **Cantidad** (para productos seleccionados).
    *   ⭐ **Sistema de Calificación (Rating):** Estrellas y número de reseñas.
    *   📜 **Acordeones Interactivos:** Para mostrar detalles, ingredientes y características.
    *   💳 **Selección de Métodos de Pago (Simulado):** Visualización de opciones.
*   **❤️ Gestión de Favoritos:**
    *   Marcar/desmarcar productos como favoritos.
    *   El estado de los favoritos se guarda en `localStorage` para persistencia.
    *   Iconos de corazón que cambian de estado visualmente.
*   **🛒 Carrito de Compras Complejo:**
    *   Añadir productos al carrito con tamaño, cantidad y moneda seleccionados.
    *   Insignia (badge) en el ícono del carrito que muestra el número de ítems.
    *   Modal del carrito para ver, modificar cantidad o eliminar ítems.
    *   Cálculo del total del carrito.
    *   Persistencia del carrito usando `localStorage`.
    *   Validación para no mezclar monedas en un mismo pedido.
*   **💳 Pasarela de Pago (Simulada):**
    *   Modal que aparece al "Proceder al Pago".
    *   Muestra un resumen del pedido.
    *   Formulario para ingresar datos de tarjeta (simulado con validación básica).
    *   Botón para "Confirmar Pago" que simula el procesamiento.
*   **📄 Generación de Factura Dinámica:**
    *   Tras un "pago exitoso", se genera una factura detallada.
    *   Incluye:
        *   Logo de la empresa.
        *   Número de orden y fecha/hora.
        *   Información del cliente (simulada).
        *   Listado de ítems comprados con cantidades y precios.
        *   Cálculo de subtotal, impuestos (ITBIS simulado) y total general.
    *   El carrito se vacía después de la generación de la factura.
*   **📁 Exportación y Utilidades de Factura:**
    *   🖨️ **Imprimir Factura:** Abre una ventana de impresión del navegador con la factura formateada.
    *   📄 **Descargar PDF:** Genera y descarga un archivo PDF de la factura usando `jsPDF` y `html2canvas`.
*   **🔔 Notificaciones Toast:** Mensajes emergentes (toasts) para feedback al usuario (ej: producto añadido, error, pago exitoso).
*   **💾 Persistencia de Datos:** Uso de `localStorage` para guardar el carrito y los favoritos entre sesiones.
*   **💅 Estilo Moderno:** Uso de Google Fonts (Poppins, Pacifico), Font Awesome para iconos, y Bootstrap para componentes base y layout. Animaciones CSS para una experiencia más pulida.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:**
    *   **HTML5:** Estructura semántica del contenido.
    *   **CSS3:** Estilos, diseño responsivo, animaciones y transiciones.
    *   **JavaScript (ES6+):** Lógica de la aplicación, manipulación del DOM, interacciones, cálculos, y gestión de datos.
*   **Frameworks y Librerías:**
    *   **Bootstrap 5.3:** Para el sistema de grid, componentes modales, y utilidades CSS.
    *   **Font Awesome 6.4:** Para iconos vectoriales.
    *   **Google Fonts:** Para tipografías (`Poppins` y `Pacifico`).
    *   **jsPDF:** Para la generación de documentos PDF del lado del cliente.
    *   **html2canvas:** Para convertir elementos HTML (la factura) en una imagen (canvas) que luego se usa para el PDF.
*   **Almacenamiento del Navegador:**
    *   **`localStorage`:** Para persistir el estado del carrito y los favoritos del usuario.

## 🚀 ¿Cómo Empezar?

1.  Clona este repositorio o descarga los archivos (`index.html`, `script.js`, `style.css`).
2.  Crea una carpeta llamada `img` en el mismo directorio que `index.html`.
3.  Coloca tus imágenes de productos en la carpeta `img` y asegúrate de que los nombres coincidan con los especificados en el array `coffeeProducts` dentro de `script.js` (ej: `img/IMG0.png`, `img/IMG1.png`, etc.).
4.  Abre `index.html` en tu navegador web preferido.
    *   ¡No se requiere un servidor web para esta demo, pero es recomendable para evitar problemas con CORS si decides cargar recursos de forma más compleja en el futuro!

## 💡 ¿Qué se puede aprender de este proyecto?

*   **Manipulación Avanzada del DOM:** Creación, modificación y eliminación dinámica de elementos HTML.
*   **Gestión de Estado del Lado del Cliente:** Manejo de datos como productos, carrito, favoritos, y preferencias del usuario (tamaño, moneda).
*   **Uso de `localStorage`:** Para persistencia de datos entre sesiones.
*   **Componentes Interactivos:** Creación de carruseles, acordeones, modales, y selectores personalizados.
*   **Event Handling:** Manejo de clics, cambios, gestos táctiles, etc.
*   **Programación Asíncrona (Básica):** Uso de `setTimeout` para simular demoras y `async/await` para la generación de PDF.
*   **Integración de Librerías Externas:** Cómo incluir y utilizar librerías de terceros como Bootstrap, jsPDF, y html2canvas.
*   **Diseño Responsivo y Mobile-First:** Técnicas CSS para adaptar la interfaz a diferentes dispositivos.
*   **Animaciones CSS:** Para mejorar la experiencia visual y las transiciones.
*   **Generación de Documentos (PDF):** Implementación de una funcionalidad compleja como la exportación a PDF desde el navegador.
*   **Estructura de una Aplicación de una Sola Página (SPA) Simple:** Aunque no usa un framework SPA formal, la lógica organiza la interfaz en "vistas" (slides del carrusel) y modales.
*   **Buenas Prácticas (Simuladas):** Aunque es una simulación, toca conceptos como la separación de datos (el array `coffeeProducts`), lógica de UI, y utilidades.

## 🔮 Posibles Mejoras Futuras

*   **Backend Real:** Conectar con un backend para gestión de productos real, pedidos, y autenticación de usuarios.
*   **Pasarela de Pago Real:** Integrar con servicios como Stripe o PayPal.
*   **Optimización de Rendimiento:** Especialmente para la generación de PDF con muchas imágenes o datos.
*   **Pruebas Unitarias y de Integración.**
*   **Internacionalización (i18n) Completa:** No solo monedas, sino todo el texto de la UI.
*   **Accesibilidad (a11y):** Mejorar el cumplimiento de las directrices WCAG.
*   **Refactorización a un Framework Moderno:** Migrar a React, Vue, o Angular para una gestión de estado y componentización más robusta.

---

¡Disfruta explorando y modificando BrewMaster Pro! 🚀
