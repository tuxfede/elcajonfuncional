---
title: "Teclado Plank"
date: "2018-11-10"
---

# Teclado planck

## Pre-requisitos Windows

1. Instalar msys2
2. Actualizar msys2: `$ pacman -Syu`
3. Instalar git: `$ pacman -S git`

## Descargar repositorio

```bash
$ git clone https://github.com/qmk/qmk_firmware.git
$ cd qmk_firmware
```

## Instalar dependencias

```bash
$ ./util/qmk_install.sh
```

> Responder 'Yes' y 'All' a todas las cuestiones

## Compilar firmware por defecto

```bash
$ make planck/rev5:default
```

## Crear firmware personalizado

```bash
$ cd keyboards/planck/keymaps
$ cp -r default tuxfede
$ vim keymap.c
```

La siguiente línea indica el comienzo de la lista de capas.

```
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
```

Cada capa se representa con un 'LAYOUT' o 'KEYMAP'

A continuación, cambiar el teclado como se desee.

### Keycodes

> Referencia:
>
> - [keycodes](https://docs.qmk.fm/#/keycodes)
> - [keycodes básicos](https://docs.qmk.fm/#/keycodes_basic)
> - [FAQ](https://docs.qmk.fm/#/faq_keymap)

Los keycodes básicos se basan en la especificación USB ([enlace](https://www.usb.org/sites/default/files/documents/hut1_12v2.pdf)), con la excepción de `KC_NO`, `KC_TRNS` y el rango `0xA5-DF`.

### Features

> Referencia: [features](https://docs.qmk.fm/#/features)

#### Advanced keycodes

Funciones predefinidas:

- DF(layer) - Cambia a la capa por defecto mientras está pulsada.
- MO(layer) - Momentáneamente activa la capa 'layer'. Cuando se suelta la tecla, dicha 'layer' queda desactivada.
- LM(layer, mod), Como MO, pero con un modificador activado. Sólo para layers 0-15 y left-modifiers
- LT(layer, kc) - Momentáneamente activa 'layer' cuando es presionada, y envía KC cuando es pulsada y soltada. (solo para capas 0-15).
- OSL(layer) Momentáneamente activa 'layer' hasta que se pulsa la siguiente tecla (ver one shot keys)
- TG(layer) - Toggle layer (activa/desactiva)
- TO(layer) - activa 'layer' y desactiva todas las otras capas excepto la por defecto. Se activa con keydown
- TT(layer) - Layer Tap-Toggle. Si se pulsa la tecla, layer se activa, y entonces se desactiva cuando se suelta. Si se pulsa varias veces, la capa es toggled (como TG). Por defecto, 'toggle'funciona con 5 taps.

Modifier Keys (se pueden encadenar: LCTL(LALT(KC_DEL))

| Key        | Aliases                | Description                                          |
| ---------- | ---------------------- | ---------------------------------------------------- |
| `LCTL(kc)` |                        | Hold Left Control and press `kc`                     |
| `LSFT(kc)` | `S(kc)`                | Hold Left Shift and press `kc`                       |
| `LALT(kc)` |                        | Hold Left Alt and press `kc`                         |
| `LGUI(kc)` | `LCMD(kc)`, `LWIN(kc)` | Hold Left GUI and press `kc`                         |
| `RCTL(kc)` |                        | Hold Right Control and press `kc`                    |
| `RSFT(kc)` |                        | Hold Right Shift and press `kc`                      |
| `RALT(kc)` |                        | Hold Right Alt and press `kc`                        |
| `RGUI(kc)` | `RCMD(kc)`, `LWIN(kc)` | Hold Right GUI and press `kc`                        |
| `HYPR(kc)` |                        | Hold Left Control, Shift, Alt and GUI and press `kc` |
| `MEH(kc)`  |                        | Hold Left Control, Shift and Alt and press `kc`      |
| `LCAG(kc)` |                        | Hold Left Control, Alt and GUI and press `kc`        |
| `ALTG(kc)` |                        | Hold Right Control and Alt and press `kc`            |
| `SGUI(kc)` | `SCMD(kc)`, `SWIN(kc)` | Hold Left Shift and GUI and press `kc`               |
| `LCA(kc)`  |                        | Hold Left Control and Alt and press `kc`             |

#### Mod-Tap.

MT(mod, kc) Funciona como un modificador cuando se pulsa, y como un regular kc cuando es tapped.

Escape y control!

| Modifier   | Description                              |
| ---------- | ---------------------------------------- |
| `MOD_LCTL` | Left Control                             |
| `MOD_LSFT` | Left Shift                               |
| `MOD_LALT` | Left Alt                                 |
| `MOD_LGUI` | Left GUI (Windows/Command/Meta key)      |
| `MOD_RCTL` | Right Control                            |
| `MOD_RSFT` | Right Shift                              |
| `MOD_RALT` | Right Alt                                |
| `MOD_RGUI` | Right GUI (Windows/Command/Meta key)     |
| `MOD_HYPR` | Hyper (Left Control, Shift, Alt and GUI) |
| `MOD_MEH`  | Meh (Left Control, Shift, and Alt)       |

Los modificadores se pueden combinar, por ejemplo:

```c
MT(MOD_LCTL | MOD_LSFT, KC_ESC)
```

La función anterior activa left control y left shift cuando se presiona, y envía escape cuando es un tap.

QMK incluye los siguientes Mod-Tap por defecto:

| Key          | Aliases                                 | Description                                                                                                                                 |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `LCTL_T(kc)` | `CTL_T(kc)`                             | Left Control when held, `kc` when tapped                                                                                                    |
| `RCTL_T(kc)` |                                         | Right Control when held, `kc` when tapped                                                                                                   |
| `LSFT_T(kc)` | `SFT_T(kc)`                             | Left Shift when held, `kc` when tapped                                                                                                      |
| `RSFT_T(kc)` |                                         | Right Shift when held, `kc` when tapped                                                                                                     |
| `LALT_T(kc)` | `ALT_T(kc)`                             | Left Alt when held, `kc` when tapped                                                                                                        |
| `RALT_T(kc)` | `ALGR_T(kc)`                            | Right Alt when held, `kc` when tapped                                                                                                       |
| `LGUI_T(kc)` | `LCMD_T(kc)`, `RWIN_T(kc)`, `GUI_T(kc)` | Left GUI when held, `kc` when tapped                                                                                                        |
| `RGUI_T(kc)` | `RCMD_T(kc)`, `RWIN_T(kc)`              | Right GUI when held, `kc` when tapped                                                                                                       |
| `C_S_T(kc)`  |                                         | Left Control and Shift when held, `kc` when tapped                                                                                          |
| `MEH_T(kc)`  |                                         | Left Control, Shift and Alt when held, `kc`when tapped                                                                                      |
| `LCAG_T(kc)` |                                         | Left Control, Alt and GUI when held, `kc`when tapped                                                                                        |
| `RCAG_T(kc)` |                                         | Right Control, Alt and GUI when held, `kc`when tapped                                                                                       |
| `ALL_T(kc)`  |                                         | Left Control, Shift, Alt and GUI when held, `kc`when tapped - more info [here](http://brettterpstra.com/2012/12/08/a-useful-caps-lock-key/) |
| `SGUI_T(kc)` | `SCMD_T(kc)`, `SWIN_T(kc)`              | Left Shift and GUI when held, `kc` when tapped                                                                                              |
| `LCA_T(kc)`  |                                         | Left Control and Alt when held, `kc` when tapped                                                                                            |

#### One Shot Keys (OSM)

Son teclas que permanecen activas hasta que se pulsa la siguiente. Por ejemplo: OSM(MOD_LSFT) deja pulsado left shift. Cuando se pulsa después la tecla 'a', el ordenador recibe 'A'

#### Auto shift

Pulsar una tecla y aparece en minúscula. PUlsarla algo más de tiempo y aparece en mayúscula.

#### Combos

Permite pulsar muchas telcas a la vez y emitir una diferente. Por ejemplo A y S generan ESC.

#### Macros

Permite crear macros temporales al vuelo, o fijas.

Fijas: SEND_STRING()

#### Grave Escape

Escape y ~ en el mismo símbolo. Cuando se pulsa escape junto con shift o GUI envía KC_GRAVE. Cuando se pulsa sola envía ESC.

`KC_GESC`

#### Key Lock

Key lock deja pulsada la siguiente tecla por tí. Cuando se pulsa de nuevo, la tecla es liberad. Por ejemplo, para fijar mayúsculas: KC_LOCK y entonces shift.

#### Mousekeys

| Key              | Aliases   | Description                 |
| ---------------- | --------- | --------------------------- |
| `KC_MS_UP`       | `KC_MS_U` | Mouse Cursor Up             |
| `KC_MS_DOWN`     | `KC_MS_D` | Mouse Cursor Down           |
| `KC_MS_LEFT`     | `KC_MS_L` | Mouse Cursor Left           |
| `KC_MS_RIGHT`    | `KC_MS_R` | Mouse Cursor Right          |
| `KC_MS_BTN1`     | `KC_BTN1` | Mouse Button 1              |
| `KC_MS_BTN2`     | `KC_BTN2` | Mouse Button 2              |
| `KC_MS_BTN3`     | `KC_BTN3` | Mouse Button 3              |
| `KC_MS_BTN4`     | `KC_BTN4` | Mouse Button 4              |
| `KC_MS_BTN5`     | `KC_BTN5` | Mouse Button 5              |
| `KC_MS_WH_UP`    | `KC_WH_U` | Mouse Wheel Up              |
| `KC_MS_WH_DOWN`  | `KC_WH_D` | Mouse Wheel Down            |
| `KC_MS_WH_LEFT`  | `KC_WH_L` | Mouse Wheel Left            |
| `KC_MS_WH_RIGHT` | `KC_WH_R` | Mouse Wheel Right           |
| `KC_MS_ACCEL0`   | `KC_ACL0` | Set mouse acceleration to 0 |
| `KC_MS_ACCEL1`   | `KC_ACL1` | Set mouse acceleration to 1 |
| `KC_MS_ACCEL2`   | `KC_ACL2` | Set mouse acceleration to 2 |

#### Leader key (KC_LEAD)

Igual que en VIM

En lugar de pulsar Alt+Shit+W, permite pulsarlas como secuencia! Pulsas Leader key, seguida de W seguido de C y haces que se comporte como alt shift w

#### Space cadet shift

Cuando pulsas left shift, se abre paréntesis, cuando pulsas el derecho, se cierra paréntesis.

En cambio, si mantienes pulsado, funciona como normalmente.

| Keycode   | Description                            |
| --------- | -------------------------------------- |
| `KC_LSPO` | Left Shift when held, `(` when tapped  |
| `KC_RSPC` | Right Shift when held, `)` when tapped |

#### Space cadet shift enter

Cuando pulsas y sueltas shift, se comporta como enter; cuando sólo se pulsa, como shift.

| Keycode     | Description                              |
| ----------- | ---------------------------------------- |
| `KC_SFTENT` | Right Shift when held, Enter when tapped |

#### Tap dance

Una misma tecla para varias cosas. Si se pulsa una vez, envía un 'kc'; si se pulsa dos veces, envía un 'kc' diferente.

#### Envío de unicode

QMK permite enviar unicode

## Compilar el nuevo firmware

```bash
$ make planck/rev5:tuxfede
```

## Flashear el teclado

> Importante: No desconectar el teclado durante el proceso de flasheo

### QMK Toolbox

QMK Tookbox es una GUI que permite flashear el teclado de forma fácil.

Disponible para windows y macOs:

> Enlace de descarga: [QMK Toolbox](https://github.com/qmk/qmk_toolbox/releases)

Para flashear:

1. Localizar el firmware (fichero <keyboard*name>*<keymap_name>.{bin,.hex})
2. Arrastrar el archivo al inputbox 'Local file' de la GUI de QMK Toolbox
3. Poner el teclado en DFU MOde.
   1. En QMK, existen los siguientes métodos por defecto (probarlos en orden):
      1. Mantener pulsadas las dos teclas `shift` y presionar `pause`
      2. Mantener pulsadas las dos teclas `shift` y presionar `B`
      3. Desconectar el teclado, mantener pulsada la tecla `spacebar` y la tecla `B` al mismo tiempo, conectar el teclado y esperar un segundo antes de soltar todas las teclas
      4. Presionar la tecla física `RESET` (ubicada en la parte trasera de la PCB)
      5. Localizar `header pins` de la PCB etiquetadas `BOOT0` o `RESET`, cortocircuitarlas juntas y conectar PCB.
   2. Si el teclado ha entrado correctamente en modo DFU, aparecerá el siguiente mensaje en QMK Toolbox: `DFU device connected`
4. Pulsar el botón `Flash`
5. Comprobar el resultado `success`

### Desde la línea de comandos

En primer lugar hay que conocer el bootloader que usa el teclado.

> Planck rev 5: QMK-DFU

A continuación, poner en modo dfu (lower+raise+Q) y ejecutar el comando para lanzar DFU bootloader:

`make planck/rev5:tuxfede:dfu`

Este comando buscará el teclado conectado cada 5 segundos hasta que lo encuentre o se cancele.

Una vez que se encuentre el teclado, se resetará el teclado y se flasheará la memoria.

## Probar el teclado

- [Switch Hitter](https://elitekeyboards.com/switchhitter.php) - Windows
- [Keyboard Viewer](https://www.imore.com/how-use-keyboard-viewer-your-mac) - Mac
- [Keyboard Tester](http://www.keyboardtester.com/) - Web
- [Keyboard Checker](http://keyboardchecker.com/) - Web

## Mis cambios

KC_ESC -> control y escape: MT(MOD_LCTL, KC_ESC)

left space: KC_ENT

enter: KC_RSFT

en lower y raiserÑ backspace por del, se mantiene transparente control-esc

fn por hype

ctrl por capslock

space shift cadets

### Cambios propuestos

space cadet shift
