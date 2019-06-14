---
title: "Bluetooth Low Energy en Raspberry"
date: "2018-03-04"
---

## Instalación en Raspberry Arch

### Requisitos

- Distribución linux Arch
- Lector de tarjetas SD
- tarjeta microSD clase 10 8Gb

#### Paso 1. Cargar imagen inicial en tarjeta

> [Web archlinux arm](https://archlinuxarm.org/platforms/armv8/broadcom/raspberry-pi-3)

```bash
sudo fdisk /dev/sdd
o,ENTER,p,ENTER,n,ENTER,p,ENTER,1,ENTER,ENTER,+100M,ENTER,t,ENTER,c,ENTER,n,ENTER,p,NETER,2,ENTER,ENTER,ENTER,w,ENTER
sudo mkfs.vfat /dev/sdd1
sudo mkdir /mnt/boot
sudo mount /dev/sdd1 /mnt/boot
sudo mkfs.ext4 /dev/sdd2
sudo mkdir /mnt/root
sudo mount /dev/sdd2 /mnt/root
wget http://archlinuxarm.org/os/ArchLinuxARM-rpi-2-latest.tar.gz
sudo bsdtar -xpf ArchLinuxARM-rpi-2-latest.tar.gz -C /mnt/root
sudo sync
sudo mv /mnt/root/boot/\* /mnt/boot
sudo umount /mnt/root /mnt/boot
```

#### Paso 2. Optimizar sistema

```bash
su
(password: root)
nano /boot/config.txt

# Agregar al final:
dtparam=sd_overclock=100
```

#### Paso 3. Actualización del sistema e instalación de aplicaciones básicas

Como root:

```bash
pacman-key --init
pacman -Syu
pacman -S sudo screen tmux base-devel git-core
visudo -f /etc/sudoers.d/myOverrides

# Agregar la línea:
alarm ALL=NOPASSWD: ALL

# Pulsar ESC :w ENTER :q ENTER
su alarm
```

#### Paso 4. Instalación de gestor packer y yaourt

```bash
sudo pacman -S packer
sudo nano /usr/bin/packer

# Buscar la linea
${EDITOR:-vi} "$2"

# y sustituir por
${EDITOR:-nano} "$2"

#Ctrl+o ENTER Ctrl+x

packer -S yaourt
```

#### Paso 5. Habilitar wifi

```bash
sudo ifconfig wlan0 up
```

#### Paso 6. Instalación de bluetooth

```bash
packer -S bluez bluez-libs bluez-utils
yaourt -S pi-bluetooth

# sudo pacman -S libcap

sudo setcap cap_net_raw+ep /usr/bin/hcitool
sudo systemctl start bluetooth.service
sudo systemctl enable bluetooth.service
sudo systemctl enable brcm43438.service
sudo hciconfig hci0 up

## Alternativa: bluetoothctl power on

usermod -a -G lp alarm
```

#### Paso 7. Instalación de entorno de desarrollo qt

```bash
sudo pacman -S qt5-base qt5-connectivity
```

#### Paso 8. Instalación timezone

```bash
timedatectl set-timezone Europe/Madrid
```

ajustar hora:

```bash
timedatectl set-time "yyyy-MM-dd hh:mm:ss"
```

## Comandos básicos

Fijar hora:

```bash
sudo timedatectl set-time "2017-06-08 17:17:00"
```

### HCITOOL

### Mostrar unidades

```bash
hcitool dev
```

#### Activar interfaz bluetooth:

```bash
sudo hciconfig hcio up
```

#### Escanear dispositivos

```bash
hcitool lescan
```

#### Información adicional:

```bash
sudo hcitool leinfo 43:BE:EB:FE:5C:31
```

#### Nueva conexión

```bash
hcitool -i hci0 lecc --random 43:BE:EB:FE:5C:31
```

#### Listado de conexiones

```bash
hcitool con
```

#### Eliminar conexión:

```bash
sudo hcitool ledc HANDLE
```

#### Una vez conectado (lecc), se puede comprobar en:

```bash
bluetoothctl
info 43:BE:EB:FE:5C:31
```

#### otros comandos:

```bash
lewladd [--random] <bdaddr>
Add device to LE White List
lewlrm <bdaddr>
Remove device from LE White List
```

### GATTTOOL

#### Conectarse a dispositivos

```bash
gatttool -I --addr-type=random
connect 43:BE:EB:FE:5C:31
```

#### Leer característica:

```bash
char-read-uuid 0000cca5-0000-1000-8000-00805f9b34fb
```

#### todo en un comando:

```bash
sudo gatttool -b 43:BE:EB:FE:5C:31 --char-read -u 0000cca5-0000-1000-8000-00805f9b34fb
```

#### Obtener servicios primarios:

```bash
gatttool -b 43:BE:EB:FE:5C:31 --addr-type=random --primary
```

#### Obtener caracteristicas::

```bash
gatttool -b 43:BE:EB:FE:5C:31 --addr-type=random --characteristics
```

#### Usar handler:

```bash
gatttool -b <MAC Address> --char-write-req --handle=0x0031 --value=0100 --listen
char-read-hnd 0x000e
```

## Permitir a usuario gestionar bluetooth

AGREGAR EL USUARIO ALARM AL GRUPO LP:

```bash
sudo usermod -aG lp alarm
sudo setcap 'cap_net_raw,cap_net_admin+eip' `which hcitool`
```

## COMPILAR BLUEZ 5.44 EN ARCH RASPBERRY

```bash
mkdir bluez
cd bluez
curl -h\
curl -h
curl https://archlinuxarm.org/packages/armv7h/bluez/files
curl https://archlinuxarm.org/packages/armv7h/bluez/files/PKGBUILD > PKGBUILD
ls
more PKGBUILD
ls
rm PKGBUILD
vim PKGBUILD
vim bluetooth.modprobe
vim PKGBUILD
makepkg PKGBUILD
vim PKGBUILD
makepkg PKGBUILD
vim PKGBUILD
makepkg PKGBUILD
makepkg --skippgpcheck PKGBUILD
vim PKGBUILD
ls
vim PKGBUILD
vim PKGBUILD
makepkg --skippgpcheck PKGBUILD
vim PKGBUILD
vim PKGBUILD
makepkg --skippgpcheck PKGBUILD
cp /home/alarm/bluez/src/bluez-5.44/attrib/gatttool /usr/bin
```
