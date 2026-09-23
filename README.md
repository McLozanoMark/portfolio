# Portfolio 3

Portafolio web estático de Gianmarco Lozano. La portada, los 26 casos de estudio y el UI Kit reutilizan la misma biblioteca visual.

## Fuente visual compartida

- `css/m3-ui-kit.css` es la única hoja de componentes. Define tipografía, espaciado, forma, elevación, movimiento, layouts y componentes M3.
- `tokens/` contiene los seis archivos de color Material Theme Builder que se recibieron. Se conservan sin editar y cada página carga un tema claro u oscuro junto a la hoja de componentes.
- `ui-kit.html` documenta y renderiza los mismos componentes que usa el portafolio. Desde el catálogo se puede consultar y copiar markup.
- La portada y los casos solo consumen clases documentadas del UI Kit. No tienen hojas de estilo locales.

## Páginas

- `index.html`: portada, perfil, contacto y 26 proyectos agrupados por área.
- `casos/<id>.html`: página HTML independiente por proyecto. Cada caso presenta Overview, The Problem, Understanding the User, Starting the Design, Usability Study, Refining the Design y Next Steps.
- `ui-kit.html`: foundations y catálogo de componentes.

Los casos respetan la evidencia del proyecto: cuando no hay investigación, pruebas o resultados documentados, la página lo indica explícitamente en lugar de inventarlos. Las portadas, marcas, capturas y el retrato se sirven desde `../portfolio/assets/images/`, el archivo original de proyectos.

## Tema y movimiento

El tema inicia en modo automático: claro desde las 6:00 a. m. y oscuro desde las 6:00 p. m., según la hora local del dispositivo. El control del encabezado permite fijar claro u oscuro y guarda la preferencia. El movimiento de tarjetas y controles utiliza las transiciones definidas por `m3-ui-kit.css` y respeta `prefers-reduced-motion`.

## Ejecución

Abre `index.html` con un servidor estático o sirve la carpeta raíz del repositorio. No hay compilación, dependencias de ejecución ni framework. Los vínculos internos son HTML nativo; `js/theme.js` solo cambia y programa el tema.

## Revisión Snowball

1. Se inventariaron los 26 proyectos, su evidencia, sus logos, portadas y enlaces antes de crear páginas.
2. Se conservó el UI Kit existente como página separada y se construyeron la portada y los casos con sus clases compartidas.
3. La auditoría encontró y corrigió rutas relativas, una repetición de destacados y selecciones de portada que faltaban.
4. La revisión final comprueba los 26 casos, sus siete secciones, enlaces y recursos locales, uso exclusivo de clases M3 y conservación de los seis temas fuente.
