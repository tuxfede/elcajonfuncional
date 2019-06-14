---
title: "Manjaro i3"
date: "2019-03-06"
---

# Manjaro i3 configuration

## Guía de usuario

> Referencia: [enlace](https://i3wm.org/docs/userguide.html#_using_i3)

## Shorcuts

> Refcard: [enlace](https://i3wm.org/docs/refcard.html)

- Nuevo terminal: mod + enter
- Mover foco: mod + j, k, l, ;
- Foco en padre: mod + a
- Mover ventanas: mod + shift + j, k, l, ;
- full screen: mod + f
- cambiar modo en que se divide: mod + h, v
- Cambiar layout
  - default: mod + e
  - stacking: mod + s
  - tabs: mod + w
- ventana flotante
  - toggle: mod + shift + space
  - mover: mod + ratón
- redimensionar: mod+r para entrar en resize mde (salir con escape)
  - left, right, up, down; j,k,l,;
- lockscreen mod + 9
- workspaces: mod + 0..9
  - mover ventana a otro workspace: mod + shift + 0..9
- matar ventana: mod + shift + q
- salir: mod + 0
  - por defecto: mod + shift + e
- recargar configuración i3: mod+shift+c
- reiniciar i3 inplace: mod+shift+r
- gestor de ventanas: mod+ f3
- copiar: control + shift + c
- pegar: control + shift + v

## Cambiar terminal

urxvt (terminal por defecto) no soporta ligaduras, el texto no se ve siempre
bien, etc.

Alternativas: alacritty (rust, todavía sin ligaduras), kitty
Tras instalar, editar .profile y agregar

```bash
export TERMINAL=/usr/bin/kitty
```

por último, editar .i3/config y cambiar 'terminal' por 'i3-sensible-terminal'

Por último, editar .i3/config y configurar mod+return para que ejecute kitty

### Shortucts modificadas por mi (estilo vim)

> Referencia: [ref](http://vitiral.github.io/linux/2015/10/30/30-i3-vim-mode.html)

- dmenu: mod + semicolon
- kill: mod+ d
- usar hjkl en lugar de jkl;
- en lugar de h y v para cambair a vertical/horizontal, usar :
- mod + ' : tile vertical
- mod + | : tile horizontal

## Aplicaciones

- apariencia: lxappearance
- file manager: pcmanfm
- Información en wallpaper: conky
- menú superior: dmenu
  - alternativa: rofi
- menú contextual: special + Z
- menú inferior: i3 status bar (i3bar)
  - alternativa: py3status, polybar, bumblebee status bar

## Directorios importantes

- .config/autostart
- .i3/config

## Configuraciones interesantes

> Referencias:

- [enlace](https://confluence.jaytaala.com/display/TKB/My+Manjaro+i3+setup#MyManjaroi3setup-RicingConky%28numixtheme%29)
- [enlace](https://github.com/xPMo/i3wm-config)

cambiar jkl; para ponerlo igual que vim

### Cambiar repositorio por defecto de pacman

```bash
sudo pacman-mirrors --geoip
pacman-mirrors -l
sudo pacman-mirrors -c United_States,Canada
```

### Colorear pacman

Editar /etc/pacman.conf y descomentar `Color`

### Agregar alias ll, la

En .zshrc

```bash
# convenient ll list command
echo -e '\nalias ll="ls -lhF"' >> ~/.bashrc
# convenient la list command
# same as before, but show hidden files
echo -e '\nalias la="ls -lahF"' >> ~/.bashrc

# Let calibre know it should use the system theme (usually dark)
echo -e '\nexport CALIBRE_USE_SYSTEM_THEME=1' >> ~/.bashrc
```

### Instalar vscode

sudo pacman -Sy code

### Ir a ventana urgente

Agregar, en .i3/config

```
bindsym $mod+x [urgent=latest] focus
```

### Asignar nombres a workspaces

> Referencia:[enlace](https://wiki.archlinux.org/index.php/i3)

```
set $WS1 term
set $WS2 web
set $WS3 misc
set $WS4 media
set $WS5 code
bindsym $mod+1          workspace $WS1
```

### Cambiar palemoon por chrome

> Referencia: [enlace](https://lobotuerto.com/blog/how-to-setup-manjaro-linux-i3-on-a-macbook-pro/)

```bash
sudo pacman -Rns palemoon-bin
sudo pacman -Syy
sudo pacman -S firefox namcap
yaourt -S google-chrome
```

Tras ello, editar .i3/config y cambiar la línea:

```bash
bindsym $mod+F2 exec palemoon
```

por:

```bash
bindsym $mod+F2 exec google-chrome-stable
```

## Montar partición local al arranque

> Referencias:
>
> - [montar partición e hibernación](<https://wiki.manjaro.org/How_to_mount_Windows_(NTFS)_filesystem_due_to_hibernation>)
> - [ntfs-3g](https://wiki.archlinux.org/index.php/NTFS-3G)
> - [udev rules](https://www.youtube.com/watch?v=ugynBc1lwZo)
> - [udisks](https://wiki.archlinux.org/index.php/udisks)

Listar particiones:

```bash
lsblk -f
```

Método 1: editar /etc/fstab
UUID=XXX /mnt/datos ntfs-3g defaults 0 0

Método 2: reglas udev

## Multi-monitor

### Configure monitors position and geometry

(resize and rotate):

```bash
arandr
```

Save monitor configuration in 'multimonitor.sh'

### Make changes permanents

By default, manjaro i3 includes lightdm as display manager. To configure it:

1. Copy multimonmitor.sh to `/usr/bin/`
2. Add execution permissions to script: `sudo chmod +x /usr/bin/multimonitor.sh`
3. Edit ligdm.conf and add to the end of `/etc/lightdm/lightdm.conf`:

```ini
[SeatDefaults]
display-setup-script=/usr/bin/multimonitor.sh
session-setup-script=/usr/bin/multimonitor.sh

```

## Vim

### Vim-plug

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

## zsh shell

Check current shell:

```bash
echo $SHELL
```

Install ZSH:

```bash
sudo pacman -S zsh zsh-completions
chsh -s /usr/bin/zsh
```

### Install oh-my-zsh:

```bash
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

instalar plugins git, vi-mode
tras ello, comandos útiles:

- control P arriba en histórico
- control N down en histórico
- control r busqueda incremental

### Install base16 themes:

```bash
git clone https://github.com/chriskempson/base16-shell.git ~/.config/base16-shell
```

Add the following lines to the end of .zshrc:

```
# Base16 Shell
BASE16_SHELL="$HOME/.config/base16-shell/"
[ -n "$PS1" ] && \
    [ -s "$BASE16_SHELL/profile_helper.sh" ] && \
        eval "$("$BASE16_SHELL/profile_helper.sh")"
```

Open new shell, type 'base16' and press 'tab' key to autocomplete and select theme

### Upgrade vim theme (sync)

Add to .vimrc:

```vim
if filereadable(expand("~/.vimrc_background"))
  let base16colorspace=256
  source ~/.vimrc_background
endif
```

## Resumen:

screenfetch -s .

## Wallpaper

nitrogen

## Montar unidades usb

manualmente:

```bash
$ udiskctl status
$ udisksctl mount -b /dev/sdc1
$ udisksctl unmount -b /dev/sdc1
```

mount ISO images:

```bash
$ udisksctl loop-setup -r -f image.iso
```

usando mount:

```
sudo mount /dev/sdc1 /mnt/usbstick
```

Para que mount no requiere root, agregar a /etc/fstab:

```
/dev/sda1 /mnt/usbstick vfat rw,noauto,async,user 0 0
```

y ejecutar mount /mnt/usbstick o mount /mnt/usbstick

## VIM

### Instalar vim-hug-neovim

```bash
# https://github.com/roxma/vim-hug-neovim-rpc/issues/28
pip3 uninstall pynvim
cd ~/.local/lib/python3.7/site-packages/
rm -r greenlet-0.4.15-py3.7.egg-info greenlet.cpython-37m-x86_64-linux-gnu.so
pip3 install --user --no-binary :all: pynvim
```

### Deshabilitar xon/xoff (c-s c-q software control flow)

Agregar a .zshrc :

## Sincronizar hora windows y linux:

> Referencia: [enlace](https://wiki.archlinux.org/index.php/System_time#UTC_in_Windows)

```bash
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /d 1 /t REG_DWORD /f

```

## Reiniciar/Apagar sin root

```bash
reboot
```

### Alternativa 1

systemctl poweroff
systemctl reboot

Crear alias:
alias reboot="sudo systemctl reboot"
alias poweroff="sudo systemctl poweroff"
alias halt="sudo systemctl halt"

### Alternativa 2:

Editar /etc/sodoers y agregar:

```bash
user hostname =NOPASSWD: /usr/bin/systemctl poweroff,/usr/bin/systemctl halt,/usr/bin/systemctl reboot
```

## Reiniciar en windows desde consola

> Referencias:
>
> - [enlace](https://github.com/kaipee/grub-reboot2win/blob/master/grub-reboot2win.sh)

Dar permisos de ejecutar grub-update:

```bash
sudo chmod u+s /usr/bin/grub-editenv
```

Obtener entrada del menu con:

```bash
grep -i "menuentry '" /boot/grub/grub.cfg
```

Crear archivo rebootwin.sh:

```bash
zenity --question --text="Reboot to Win?" --icon-name=windows && sudo grub-reboot "Windows Boot Manager (on /dev/sda3)" && /sbin/reboot
```

## Limitar el tiempo de apagado

Editar el fichero /etc/systemd/system.conf:

```
DefaultTimeoutStartSec=10s
DefaultTimeoutStopSec=10s
```

## Agregar acceso a puertos serie

```bash
sudo usermod -a -G uucp flo
```
