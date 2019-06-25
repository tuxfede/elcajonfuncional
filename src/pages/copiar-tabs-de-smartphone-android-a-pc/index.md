---
title: "Copiar pestañas de móvil a ordenador"
date: "2018-11-01"
---

## Opción 1. Usando sincronización de cuenta google

En chrome de escritorio, abrir marcadores, seleccionar otros dispositivos y ahí aparecerán las últimas pestañas abiertas.

Para que se muestren **todas** las pestañas abiertas, recargarlas en el móvil.

## Opción 2. Conectando móvil a ordenador por usb.

1.  Instalar drivers adb.

    1. Buscar en google: Xiamo mi a1 adb drivers ([enlace](http://www.mediafire.com/file/vuwg5k4ut428h78/adb-setup-1.4.3.exe))

2.  Habilitar la depuración por USB

    1. Ajustes -> Sistema -> información del telefono -> número de compilación -> varios clicks
    2. Ajuste -> Sistema -> opciones para desarrolladores -> Activado -> activar depuración por usb

3.  Conectar móvil al ordenador y esperar a que carguen los drivers. Desconectar móvil.

4.  Volver a conectar móvil al ordenador.

5.  Abrir chrome, lanzar chrome dev tools.

6.  pulsar el menú de tres puntos a la derechza, seleccionar 'undock' para que devtools se muestre en ventanas separadas

7.  pulsar el menú de tres puntos, more tools -> remote tools.

8.  En el móvil, aceptar el dispositivo

9.  Abrir un nuevo devtools (desde el devtool original, pulsar control+shift+j)

10. Expandir la lista de tabs (show more)

11. Ejecutar el siguiente script:

        ```javascript{1,3}{numberLines: true}

    tabs = document.querySelector('#-blink-dev-tools > div.widget.vbox.root-view > div > div > div > div:nth-child(1) > div > div').shadowRoot.querySelectorAll('div > div.hbox.devices-container > div.flex-auto.vbox > div > div.device-browser-list.vbox > div > div.device-page-list.vbox.device-view-more-toggled > .vbox')
    str = '';
    for (i=0;i<tabs.length;i++){
    if (tabs[i].querySelector('.device-page-url .devtools-link') != null){
    str += '- ['+tabs[i].querySelector('.device-page-title').textContent + '](' + tabs[i].querySelector('.device-page-url .devtools-link').getAttribute('href') +')\n'
    } else {
    console.log(tabs[i])
    }
    }
    copy(str)

    ```

    ```

12. Todos los enlaces se habrán copiado en el portapapeles.

## Referencias:

Instrucciones: https://github.com/lmmx/devnotes/wiki/Export-all-Chrome-tabs-on-Android

Stackoverflow: https://android.stackexchange.com/questions/56635/how-can-i-export-the-list-of-open-chrome-tabs
