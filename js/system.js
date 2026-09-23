const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const root = document.documentElement;
const stylesheet = $('#theme-css');
const dialog = $('#component-dialog');
const toast = $('#toast');
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function setScheme(scheme) {
  const safeScheme = ['light', 'dark', 'light-hc', 'light-mc', 'dark-hc', 'dark-mc'].includes(scheme) ? scheme : 'light';
  stylesheet.href = `tokens/${safeScheme}.css`;
  const rootClass = ({'light-hc':'light-high-contrast','light-mc':'light-medium-contrast','dark-hc':'dark-high-contrast','dark-mc':'dark-medium-contrast'})[safeScheme] || safeScheme;
  root.className = rootClass;
  $$('[data-scheme]').forEach(button => {
    const selected = button.dataset.scheme === safeScheme;
    button.classList.toggle('m3-chip--selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const color = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
  $('meta[name="theme-color"]').content = color;
  try { localStorage.setItem('m3-kit-scheme', safeScheme); } catch {}
}

const typeRoles = ['Display', 'Headline', 'Title', 'Body', 'Label'];
const typeSizes = ['Large', 'Medium', 'Small'];
$('#type-table').innerHTML = typeRoles.map(role => `<article class="m3-type-row"><b class="m3-type-row__role">${role}</b>${typeSizes.map(size => {
  const id = `${role.toLowerCase()}-${size.toLowerCase()}`;
  const style = getComputedStyle(root);
  const sizeValue = style.getPropertyValue(`--m3-type-${id}-size`).trim();
  const line = style.getPropertyValue(`--m3-type-${id}-line`).trim();
  const weight = style.getPropertyValue(`--m3-type-${id}-weight`).trim();
  const tracking = style.getPropertyValue(`--m3-type-${id}-track`).trim();
  return `<div class="m3-type-sample"><span class="m3-type-${id}">Ag</span><small>${role} ${size} · ${sizeValue}/${line} · ${weight} · ${tracking || '0'} tracking</small></div>`;
}).join('')}</article>`).join('');

const spacingTokens = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
$('#space-scale').innerHTML = spacingTokens.map(token => {
  const value = getComputedStyle(root).getPropertyValue(`--m3-space-${token}`).trim();
  return `<div class="m3-space-token" data-space="${parseInt(value, 10)}"><i></i><b>${value}</b><small>dp</small></div>`;
}).join('');

const symbols = ['home', 'search', 'favorite', 'settings', 'notifications', 'calendar_month', 'share', 'edit', 'delete', 'more_vert'];
$('#icon-grid').innerHTML = symbols.map(name => `<div><span class="material-symbols-rounded" aria-hidden="true">${name}</span><small>${name}</small></div>`).join('');

const components = [
  {name:'App bars', category:'Navegación', icon:'web_asset', path:'top-app-bar', description:'Identifican la pantalla actual y reúnen sus acciones principales.', html:`<header class="m3-top-app-bar"><button class="m3-icon-button" aria-label="Abrir navegación"><span class="material-symbols-rounded">menu</span></button><h2 class="m3-top-app-bar__title m3-type-title-large">Título de pantalla</h2><div class="m3-top-app-bar__actions"><button class="m3-icon-button" aria-label="Buscar"><span class="material-symbols-rounded">search</span></button><button class="m3-icon-button" aria-label="Más opciones"><span class="material-symbols-rounded">more_vert</span></button></div></header>`},
  {name:'Badges', category:'Comunicación', icon:'notifications', path:'badges', description:'Indican recuentos o estados relacionados con un control.', html:`<span class="m3-badge-anchor"><span class="material-symbols-rounded" aria-hidden="true">notifications</span><span class="m3-badge" aria-label="3 nuevas notificaciones">3</span></span>`},
  {name:'Bottom app bar', category:'Navegación', icon:'bottom_navigation', path:'bottom-app-bar', description:'Ofrece acciones frecuentes en la parte inferior de la ventana.', html:`<nav class="m3-bottom-app-bar" aria-label="Acciones"><button class="m3-icon-button" aria-label="Favoritos"><span class="material-symbols-rounded">favorite</span></button><button class="m3-icon-button" aria-label="Buscar"><span class="material-symbols-rounded">search</span></button><button class="m3-fab m3-fab--small" aria-label="Crear"><span class="material-symbols-rounded">add</span></button></nav>`},
  {name:'Bottom sheets', category:'Contención', icon:'vertical_align_top', path:'bottom-sheets', description:'Muestran contenido relacionado desde el borde de la pantalla.', html:`<section class="m3-bottom-sheet" aria-label="Opciones"><span class="m3-bottom-sheet__handle"></span><h3 class="m3-type-title-large">Compartir elemento</h3><div class="m3-button-row"><button class="m3-button m3-button--tonal">Copiar enlace</button><button class="m3-button m3-button--outlined">Más opciones</button></div></section>`},
  {name:'Buttons', category:'Acción', icon:'smart_button', path:'buttons', description:'Inician acciones con distintos niveles de énfasis.', html:`<div class="m3-button-row"><button class="m3-button m3-button--elevated">Elevated</button><button class="m3-button m3-button--filled">Filled</button><button class="m3-button m3-button--tonal">Tonal</button><button class="m3-button m3-button--outlined">Outlined</button><button class="m3-button m3-button--text">Text</button></div>`},
  {name:'Button groups', category:'Acción', icon:'view_week', path:'button-groups', description:'Agrupan acciones relacionadas y hacen visible su relación.', html:`<div class="m3-button-group" role="group" aria-label="Alineación"><button class="m3-button m3-button--tonal" aria-pressed="true">Izquierda</button><button class="m3-button m3-button--outlined" aria-pressed="false">Centro</button><button class="m3-button m3-button--outlined" aria-pressed="false">Derecha</button></div>`},
  {name:'Cards', category:'Contención', icon:'dashboard', path:'cards', description:'Agrupan contenido y acciones sobre un mismo tema.', html:`<div class="m3-card-variants"><article class="m3-card m3-card--elevated"><span class="m3-card__title">Elevated</span><p class="m3-card__content">Contenido y acción.</p></article><article class="m3-card m3-card--filled"><span class="m3-card__title">Filled</span><p class="m3-card__content">Contenido y acción.</p></article><article class="m3-card m3-card--outlined"><div class="m3-card__media" role="img" aria-label="Imagen de portada"></div><span class="m3-card__title">Outlined</span><p class="m3-card__content">Contenido y acción.</p><div class="m3-card__actions"><button class="m3-button m3-button--text">Ver detalle</button></div></article></div>`},
  {name:'Checkboxes', category:'Selección', icon:'check_box', path:'checkboxes', description:'Permiten seleccionar una o varias opciones.', html:`<label class="m3-choice-control"><input type="checkbox" checked aria-label="Recibir actualizaciones"></label>`},
  {name:'Chips', category:'Selección', icon:'sell', path:'chips', description:'Representan entradas, filtros, opciones o acciones compactas.', html:`<div class="m3-button-row"><button class="m3-chip" aria-pressed="false">Filtro</button><button class="m3-chip m3-chip--selected" aria-pressed="true"><span class="material-symbols-rounded">check</span> Seleccionado</button><button class="m3-chip m3-chip--elevated">Acción</button></div>`},
  {name:'Date pickers', category:'Selección', icon:'calendar_month', path:'date-pickers', description:'Ayudan a seleccionar una fecha con calendario o entrada de texto.', html:`<section class="m3-calendar" aria-label="Calendario"><header class="m3-calendar__header"><button class="m3-icon-button" aria-label="Mes anterior"><span class="material-symbols-rounded">chevron_left</span></button><b>Septiembre 2026</b><button class="m3-icon-button" aria-label="Mes siguiente"><span class="material-symbols-rounded">chevron_right</span></button></header><div class="m3-calendar__grid">${['L','M','X','J','V','S','D'].map(d=>`<span>${d}</span>`).join('')}${Array.from({length:14},(_,i)=>`<button class="m3-calendar__day ${i===9?'m3-calendar__day--selected':''}" aria-label="Día ${i+1}">${i+1}</button>`).join('')}</div></section>`},
  {name:'Dialogs', category:'Contención', icon:'help', path:'dialogs', description:'Solicitan una decisión o muestran información importante.', html:`<section class="m3-dialog m3-dialog--inline" role="dialog" aria-label="Confirmar eliminación"><h2 class="m3-type-title-large">¿Eliminar elemento?</h2><p class="m3-type-body-medium">Esta acción no se puede deshacer.</p><div class="m3-dialog__actions"><button class="m3-button m3-button--text">Cancelar</button><button class="m3-button m3-button--filled">Eliminar</button></div></section>`},
  {name:'Dividers', category:'Contención', icon:'horizontal_rule', path:'dividers', description:'Separan o agrupan contenido relacionado dentro de una superficie.', html:`<div class="m3-list"><div class="m3-list-item"><span class="material-symbols-rounded">folder</span><span>Documentos</span></div><hr class="m3-divider"><div class="m3-list-item"><span class="material-symbols-rounded">image</span><span>Imágenes</span></div></div>`},
  {name:'FAB', category:'Acción', icon:'add', path:'fab', description:'Destaca la acción principal de una pantalla.', html:`<div class="m3-button-row"><button class="m3-fab m3-fab--small" aria-label="Crear"><span class="material-symbols-rounded">add</span></button><button class="m3-fab" aria-label="Crear elemento"><span class="material-symbols-rounded">add</span></button><button class="m3-fab m3-fab--large" aria-label="Crear elemento"><span class="material-symbols-rounded">add</span></button><button class="m3-fab m3-fab--extended"><span class="material-symbols-rounded">edit</span> Redactar</button></div>`},
  {name:'Icon buttons', category:'Acción', icon:'radio_button_unchecked', path:'icon-buttons', description:'Acciones compactas representadas por un icono.', html:`<div class="m3-button-row"><button class="m3-icon-button" aria-label="Favorito"><span class="material-symbols-rounded">favorite</span></button><button class="m3-icon-button m3-icon-button--filled" aria-label="Compartir"><span class="material-symbols-rounded">share</span></button><button class="m3-icon-button m3-icon-button--tonal" aria-label="Editar"><span class="material-symbols-rounded">edit</span></button><button class="m3-icon-button m3-icon-button--outlined" aria-label="Más"><span class="material-symbols-rounded">more_vert</span></button></div>`},
  {name:'Lists', category:'Navegación', icon:'list', path:'lists', description:'Presentan elementos homogéneos en una colección vertical.', html:`<div class="m3-list"><a class="m3-list-item" href="#"><span class="material-symbols-rounded m3-list-item__icon">person</span><span class="m3-list-item__text"><span class="m3-list-item__headline">Cuenta</span><small class="m3-list-item__supporting">Administrar perfil</small></span><span class="material-symbols-rounded">chevron_right</span></a><a class="m3-list-item" href="#"><span class="material-symbols-rounded m3-list-item__icon">settings</span><span class="m3-list-item__text"><span class="m3-list-item__headline">Preferencias</span><small class="m3-list-item__supporting">Configurar la aplicación</small></span><span class="material-symbols-rounded">chevron_right</span></a></div>`},
  {name:'Menus', category:'Navegación', icon:'menu', path:'menus', description:'Ofrecen una lista compacta de acciones o selecciones.', html:`<menu class="m3-menu"><li><button class="m3-menu-item"><span class="material-symbols-rounded">edit</span>Editar</button></li><li><button class="m3-menu-item"><span class="material-symbols-rounded">content_copy</span>Duplicar</button></li><li><button class="m3-menu-item"><span class="material-symbols-rounded">delete</span>Eliminar</button></li></menu>`},
  {name:'Navigation bar', category:'Navegación', icon:'view_day', path:'navigation-bar', description:'Permite cambiar entre destinos principales en pantallas compactas.', html:`<nav class="m3-navigation-bar" aria-label="Secciones"><a class="m3-navigation-destination is-selected" href="#"><span class="m3-navigation-destination__icon"><span class="material-symbols-rounded">home</span></span><small>Inicio</small></a><a class="m3-navigation-destination" href="#"><span class="m3-navigation-destination__icon"><span class="material-symbols-rounded">search</span></span><small>Buscar</small></a><a class="m3-navigation-destination" href="#"><span class="m3-navigation-destination__icon"><span class="material-symbols-rounded">person</span></span><small>Perfil</small></a></nav>`},
  {name:'Navigation drawer', category:'Navegación', icon:'left_panel_open', path:'navigation-drawer', description:'Ofrece destinos y funciones principales en un panel lateral.', html:`<nav class="m3-navigation-drawer" aria-label="Navegación"><a class="m3-navigation-destination is-selected" href="#"><span class="material-symbols-rounded">home</span>Inicio</a><a class="m3-navigation-destination" href="#"><span class="material-symbols-rounded">folder</span>Proyectos</a><a class="m3-navigation-destination" href="#"><span class="material-symbols-rounded">settings</span>Ajustes</a></nav>`},
  {name:'Navigation rail', category:'Navegación', icon:'view_sidebar', path:'navigation-rail', description:'Mantiene accesibles varios destinos en ventanas medianas o amplias.', html:`<nav class="m3-navigation-rail" aria-label="Navegación"><a class="m3-navigation-destination is-selected" href="#"><span class="m3-navigation-destination__icon"><span class="material-symbols-rounded">home</span></span><small>Inicio</small></a><a class="m3-navigation-destination" href="#"><span class="m3-navigation-destination__icon"><span class="material-symbols-rounded">search</span></span><small>Buscar</small></a></nav>`},
  {name:'Progress indicators', category:'Comunicación', icon:'progress_activity', path:'progress-indicators', description:'Muestran el progreso de una operación o una espera.', html:`<div class="m3-progress"><span class="m3-progress__track" role="progressbar" aria-label="Progreso" aria-valuenow="62"></span></div><span class="m3-progress--circular" role="progressbar" aria-label="Cargando"></span>`},
  {name:'Radio buttons', category:'Selección', icon:'radio_button_checked', path:'radio-buttons', description:'Permiten elegir una sola opción de un conjunto.', html:`<fieldset class="m3-radio-group"><legend>Preferencia</legend><label><input type="radio" name="sample-radio" checked> Claro</label><label><input type="radio" name="sample-radio"> Oscuro</label></fieldset>`},
  {name:'Search', category:'Entrada', icon:'search', path:'search', description:'Ayuda a encontrar contenido mediante una consulta.', html:`<label class="m3-search"><span class="material-symbols-rounded">search</span><input type="search" placeholder="Buscar" aria-label="Buscar"><button class="m3-icon-button" aria-label="Búsqueda por voz"><span class="material-symbols-rounded">mic</span></button></label>`},
  {name:'Sliders', category:'Entrada', icon:'tune', path:'sliders', description:'Permiten ajustar un valor dentro de un intervalo.', html:`<label class="m3-slider-field">Volumen <input class="m3-slider" type="range" min="0" max="100" value="60"><span>60</span></label>`},
  {name:'Snackbars', category:'Comunicación', icon:'notifications_active', path:'snackbars', description:'Confirman una acción breve y pueden ofrecer una opción relacionada.', html:`<div class="m3-snackbar" role="status"><span>Archivo eliminado</span><button class="m3-snackbar__action">Deshacer</button></div>`},
  {name:'Switches', category:'Selección', icon:'toggle_on', path:'switches', description:'Activan o desactivan una preferencia.', html:`<button class="m3-switch" role="switch" aria-checked="true" aria-label="Activar notificaciones"><span class="m3-switch__handle"></span></button>`},
  {name:'Tabs', category:'Navegación', icon:'tab', path:'tabs', description:'Organizan contenido relacionado en vistas hermanas.', html:`<div class="m3-tabs" role="tablist" aria-label="Secciones"><button class="m3-tab" role="tab" aria-selected="true">Fotos</button><button class="m3-tab" role="tab" aria-selected="false">Álbumes</button><button class="m3-tab" role="tab" aria-selected="false">Compartido</button></div>`},
  {name:'Text fields', category:'Entrada', icon:'text_fields', path:'text-fields', description:'Permiten introducir y editar texto con etiquetas y apoyo contextual.', html:`<label class="m3-text-field m3-text-field--outlined"><span class="m3-text-field__label">Correo electrónico</span><input type="email" placeholder="nombre@dominio.com"><small class="m3-text-field__supporting">No compartiremos tu correo.</small></label>`},
  {name:'Time pickers', category:'Selección', icon:'schedule', path:'time-pickers', description:'Ayudan a seleccionar una hora con controles de reloj o texto.', html:`<fieldset class="m3-time-picker"><legend>Selecciona una hora</legend><span class="m3-time-input"><input class="m3-time-input__value" type="number" min="1" max="12" value="9" aria-label="Hora"><span aria-hidden="true">:</span><input class="m3-time-input__value" type="number" min="0" max="59" value="30" aria-label="Minutos"></span><button class="m3-chip m3-chip--selected" aria-pressed="true">AM</button><button class="m3-chip" aria-pressed="false">PM</button></fieldset>`},
  {name:'Toolbars', category:'Navegación', icon:'build', path:'toolbars', description:'Agrupan herramientas y comandos de una tarea activa.', html:`<div class="m3-toolbar" role="toolbar" aria-label="Formato de texto"><button class="m3-icon-button" aria-label="Negrita"><span class="material-symbols-rounded">format_bold</span></button><button class="m3-icon-button" aria-label="Cursiva"><span class="material-symbols-rounded">format_italic</span></button><span class="m3-toolbar__spacer"></span><button class="m3-icon-button" aria-label="Enlace"><span class="material-symbols-rounded">link</span></button></div>`},
  {name:'Split buttons', category:'Acción', icon:'call_to_action', path:'split-buttons', description:'Combina una acción principal y opciones relacionadas.', html:`<div class="m3-split-button"><button class="m3-button m3-button--filled">Guardar</button><button class="m3-button m3-button--filled" aria-label="Más opciones"><span class="material-symbols-rounded">arrow_drop_down</span></button></div>`},
  {name:'Tooltips', category:'Comunicación', icon:'chat_bubble', path:'tooltips', description:'Aclaran la función de un control cuando se necesita contexto adicional.', html:`<span class="m3-tooltip-demo"><button class="m3-icon-button" aria-label="Guardar"><span class="material-symbols-rounded">bookmark</span></button><span class="m3-tooltip" role="tooltip">Guardar</span></span>`},
  {name:'Carousels', category:'Navegación', icon:'view_carousel', path:'carousels', description:'Permiten recorrer una colección de elementos relacionados.', html:`<section class="m3-carousel" aria-label="Elementos destacados"><article class="m3-carousel__item">Elemento 1</article><article class="m3-carousel__item">Elemento 2</article><article class="m3-carousel__item">Elemento 3</article></section>`}
];

const categories = ['Todos', ...new Set(components.map(component => component.category))];
let activeCategory = 'Todos';
let activeComponent = null;
$('#component-filters').innerHTML = categories.map((category, index) => `<button class="m3-filter" data-category="${category}" aria-pressed="${index === 0}">${category}</button>`).join('');

function renderCatalog() {
  const query = $('#component-search').value.trim().toLocaleLowerCase('es');
  const visible = components.filter(component => (activeCategory === 'Todos' || component.category === activeCategory) && `${component.name} ${component.category} ${component.description}`.toLocaleLowerCase('es').includes(query));
  $('#component-count').textContent = String(visible.length).padStart(2, '0');
  $('#empty-state').hidden = visible.length > 0;
  $('#component-grid').innerHTML = visible.map(component => `<article class="m3-component-card" data-component="${component.path}"><button class="m3-component-card__title" data-open-component="${component.path}"><span class="material-symbols-rounded" aria-hidden="true">${component.icon}</span>${component.name}<span class="material-symbols-rounded m3-component-card__arrow" aria-hidden="true">open_in_full</span></button><div class="m3-component-card__stage">${component.html}</div><div class="m3-component-card__description"><span>${component.description}</span><button class="m3-button m3-button--text" data-open-component="${component.path}">Ver código <span class="material-symbols-rounded">arrow_forward</span></button></div></article>`).join('');
}

function openComponent(path) {
  const component = components.find(item => item.path === path);
  if (!component) return;
  activeComponent = component;
  $('#dialog-category').textContent = component.category.toUpperCase();
  $('#dialog-title').textContent = component.name;
  $('#dialog-description').textContent = component.description;
  $('#dialog-preview').innerHTML = component.html;
  $('#dialog-code').textContent = component.html;
  $('#dialog-source').href = `https://m3.material.io/components/${component.path}/overview`;
  if (!dialog.open) dialog.showModal();
}

$('#component-search').addEventListener('input', renderCatalog);
$('#component-filters').addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  $$('#component-filters [data-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderCatalog();
});
$('#component-grid').addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-component]');
  if (trigger) openComponent(trigger.dataset.openComponent);
});
$('#copy-source').addEventListener('click', async () => {
  if (!activeComponent) return;
  try {
    await navigator.clipboard.writeText(activeComponent.html);
    notify(`${activeComponent.name}: HTML copiado`);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('#dialog-code'));
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    notify('Selecciona y copia el código');
  }
});

document.addEventListener('click', event => {
  const scheme = event.target.closest('[data-scheme]');
  if (scheme) setScheme(scheme.dataset.scheme);
  const notice = event.target.closest('[data-toast]');
  if (notice) notify(notice.dataset.toast);
  const switchButton = event.target.closest('.m3-switch[role="switch"]');
  if (switchButton) switchButton.setAttribute('aria-checked', String(switchButton.getAttribute('aria-checked') !== 'true'));
  const toggle = event.target.closest('[data-toggle-choice]');
  if (toggle) {
    const group = toggle.parentElement;
    $$('[data-toggle-choice]', group).forEach(item => {
      const selected = item === toggle;
      item.setAttribute('aria-pressed', String(selected));
      item.classList.toggle('m3-button--tonal', selected);
      item.classList.toggle('m3-button--outlined', !selected);
    });
  }
  if (event.target.closest('[data-dialog-close]')) dialog.close();
});

$('#theme-toggle').addEventListener('click', () => setScheme(root.className.startsWith('dark') ? 'light' : 'dark'));
const motionTrack = $('#motion-demo');
const motionObject = $('.m3-motion-object', motionTrack);
const motionTokens = {
  'fast-spatial': ['fast', 'spatial', 'position or shape'],
  'default-spatial': ['default', 'spatial', 'position or shape'],
  'slow-spatial': ['slow', 'spatial', 'position or shape'],
  'fast-effects': ['fast', 'effects', 'color or opacity'],
  'default-effects': ['default', 'effects', 'color or opacity'],
  'slow-effects': ['slow', 'effects', 'color or opacity'],
};
let motionFrame = 0;

function selectMotionToken(token) {
  const [speed, kind, property] = motionTokens[token] || motionTokens['default-spatial'];
  const damping = getComputedStyle(root).getPropertyValue(`--m3-motion-spring-${speed}-${kind}-damping`).trim();
  const stiffness = getComputedStyle(root).getPropertyValue(`--m3-motion-spring-${speed}-${kind}-stiffness`).trim();
  motionTrack.dataset.motionToken = token;
  motionTrack.dataset.motionKind = kind;
  $('#motion-description').textContent = `${speed[0].toUpperCase()}${speed.slice(1)} ${kind} · ${property}`;
  $('#motion-values').textContent = `damping ${damping} · stiffness ${stiffness}`;
  $$('[data-motion-token]').forEach(button => {
    if (button === motionTrack) return;
    button.setAttribute('aria-pressed', String(button.dataset.motionToken === token));
  });
  motionObject.classList.remove('is-running');
  motionObject.style.transform = 'translateX(0)';
  motionObject.style.opacity = kind === 'effects' ? '.45' : '1';
  $('.m3-motion-line', motionTrack).style.setProperty('--motion-progress', '0');
}

$$('.m3-motion-option').forEach(button => button.addEventListener('click', () => {
  cancelAnimationFrame(motionFrame);
  selectMotionToken(button.dataset.motionToken);
}));

$('#play-motion').addEventListener('click', () => {
  cancelAnimationFrame(motionFrame);
  const token = motionTrack.dataset.motionToken;
  const [speed, kind] = motionTokens[token];
  const damping = Number(getComputedStyle(root).getPropertyValue(`--m3-motion-spring-${speed}-${kind}-damping`));
  const stiffness = Number(getComputedStyle(root).getPropertyValue(`--m3-motion-spring-${speed}-${kind}-stiffness`));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trackStyle = getComputedStyle(motionTrack);
  const travel = Math.max(0, motionTrack.clientWidth - parseFloat(trackStyle.paddingLeft) - parseFloat(trackStyle.paddingRight) - motionObject.offsetWidth);
  motionObject.style.setProperty('--motion-travel', `${travel}px`);
  let position = 0;
  let velocity = 0;
  let previousTime = 0;
  const render = value => {
    if (kind === 'spatial') motionObject.style.transform = `translateX(${travel * value}px)`;
    $('.m3-motion-line', motionTrack).style.setProperty('--motion-progress', String(Math.max(0, Math.min(1, value))));
    if (kind === 'effects') motionObject.style.opacity = String(.45 + .55 * Math.max(0, Math.min(1, value)));
  };
  if (reduceMotion) {
    render(1);
    motionObject.classList.remove('is-running');
    return;
  }
  motionObject.classList.add('is-running');
  render(0);
  const step = time => {
    if (!previousTime) previousTime = time;
    let remaining = Math.min((time - previousTime) / 1000, 1 / 30);
    previousTime = time;
    while (remaining > 0) {
      const delta = Math.min(remaining, 1 / 120);
      const acceleration = stiffness * (1 - position) - 2 * damping * Math.sqrt(stiffness) * velocity;
      velocity += acceleration * delta;
      position += velocity * delta;
      remaining -= delta;
    }
    render(position);
    if (Math.abs(1 - position) < .001 && Math.abs(velocity) < .01) {
      render(1);
      motionObject.classList.remove('is-running');
      motionFrame = 0;
      return;
    }
    motionFrame = requestAnimationFrame(step);
  };
  motionFrame = requestAnimationFrame(step);
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    $('#component-search').focus();
  }
});

try { setScheme(localStorage.getItem('m3-kit-scheme') || 'light'); } catch { setScheme('light'); }
renderCatalog();
