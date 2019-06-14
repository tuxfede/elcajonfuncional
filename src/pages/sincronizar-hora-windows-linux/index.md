---
title: "Sincronizar hora en Windows y Linux (arranque dual"
date: "2019-03-01"
---

# Sincronizar hora en Windows y Linux (arranque dual)

## Método 1 (funciona)

```bash
sudo timedatectl set-ntp true
timedatectl set-local-rtc 0 --adjust-system-clock
```

> Referencia: [Wiki manjaro](https://wiki.manjaro.org/index.php?title=System_Time_Setting)

## Método 2 (no funciona)

### Hacer que linux use 'local time'

```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```

### Parar servicio 'windows time service'

```bash
services.msc
# Windows Time service: stop

sc config w32time start= disabled
sc config w32time start= demand
```

> Referencia: https://answers.microsoft.com/en-us/windows/forum/all/windows-10-clock-does-not-use-the-specified-time/39e187cd-1813-4de7-9cea-d36ceecc9b18

## Otras referencias

- https://www.howtogeek.com/323390/how-to-fix-windows-and-linux-showing-different-times-when-dual-booting/
- https://appuals.com/how-to-fix-wrong-time-on-clock-in-windows-10/
