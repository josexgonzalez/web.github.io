function get_appcache_state() {
    var appCache = window.applicationCache;

    switch (appCache.status) {
        case appCache.UNCACHED:
            return 'UNCACHED';
        case appCache.IDLE:
            return 'IDLE';
        case appCache.CHECKING:
            return 'CHECKING';
        case appCache.DOWNLOADING:
            return 'DOWNLOADING';
        case appCache.UPDATEREADY:
            return 'UPDATEREADY';
        case appCache.OBSOLETE:
            return 'OBSOLETE';
        default:
            return 'UNKNOWN CACHE STATUS';
    }
}

function add_cache_event_toasts() {
    var appCache = window.applicationCache;

    if (!navigator.onLine) {
        showToast('You are offline.');
    }

    appCache.addEventListener('cached', function () {
        showToast('Finished caching site.');
    }, false);

    appCache.addEventListener('downloading', function () {
        showToast('Downloading new cache.');
    }, false);

    appCache.addEventListener('error', function () {
        if (navigator.onLine) {
            showToast('Error while caching site.', 5000);
        }
    }, false);

    appCache.addEventListener('noupdate', function () {
        showToast('Cache is up-to-date.');
    }, false);

    appCache.addEventListener('obsolete', function () {
        showToast('Site is obsolete.');
    }, false);

    appCache.addEventListener('updateready', function () {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            showToast('The site was updated. Refresh to switch to updated version', 8000);
        }
    }, false);
}

function showToast(message, duration = 4000) {
    // Crear el contenedor si no existe
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-end';
        document.body.appendChild(container);
    }

    // Crear la notificación
    let alertBox = document.createElement('div');
    alertBox.style.backgroundColor = '#333';
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px 30px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.marginTop = '10px';
    alertBox.style.textAlign = 'left';
    alertBox.style.fontSize = '18px';
    alertBox.style.width = '248px';
    alertBox.style.display = 'flex';
    alertBox.style.alignItems = 'center';
    alertBox.style.opacity = '0';
    alertBox.style.transition = 'opacity 0.3s ease-in';

    // Icono
    let icon = document.createElement('img');
    icon.src = '/ICONS/setting.png'; // Ruta de tu icono
    icon.style.width = '44px';
    icon.style.height = '44px';
    icon.style.marginRight = '7px';

    // Texto
    let text = document.createElement('span');
    text.innerText = message;

    // Estructura final
    alertBox.appendChild(icon);
    alertBox.appendChild(text);
    container.appendChild(alertBox);

    // Animación de entrada
    setTimeout(() => {
        alertBox.style.opacity = '0.9';
    }, 30);

    // Animación de salida
    setTimeout(() => {
        alertBox.style.opacity = '0';
    }, duration);

    // Remover del DOM
    setTimeout(() => {
        alertBox.remove();
    }, duration + 500);
}
