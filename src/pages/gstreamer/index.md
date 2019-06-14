---
title: "GStreamer"
date: "2019-06-01"
---

## Introducción

- Presentación gstreamer: [using gstreamer](https://www.youtube.com/watch?v=ZphadMGufY8)
- Comandos básicos: [enlace](http://www.einarsundgren.se/gstreamer-basic-real-time-streaming-tutorial/)
- Gstreamer y webrtc: https://www.youtube.com/watch?v=jcYoyVRAQGk

## Comandos que funcionan

### Emitir videotest vía rtp

Fichero rtp.sh:

```bash
#!/bin/bash

gst-launch-1.0 videotestsrc \
           ! x264enc qp-min=18 aud=false \
           ! video/x-h264, profile=baseline \
           ! rtph264pay name=pay0 pt=96 \
           ! udpsink host=127.0.0.1 port=5000
```

### Reproducir rtp

Fichero playrtp.sh:

```bash
#!/bin/bash

gst-launch-1.0 udpsrc address=127.0.0.1 port=5000 \
	! "application/x-rtp,media=(string)video,clock-rate=(int)90000,encoding-name=(string)H264" \
	! rtph264depay \
	! avdec_h264 \
	! videoconvert \
	! autovideosink

```

Alternativa: cargar fichero sdp en vlc. Contenido 'rtp.sdp':

```bash
v=0
m=video 5000 RTP/AVP 96
c=IN IP4 127.0.0.1
a=rtpmap:96 H264/90000
```

### Tansmitir rtp usando rtsp

> Requisito: gst-rtsp-server

Fichero rtsp.sh:

```bash
#!/bin/bash

gst-rtsp-launch -p 8554 "( udpsrc address=127.0.0.1 port=5000 \
 caps=\"application/x-rtp,media=video,clock-rate=90000,encoding-name=H264,payload=96\" \
 ! queue ! rtph264depay ! rtph264pay name=pay0 pt=96 )"

# Profiles:
# https://stackoverflow.com/questions/22960928/identify-h264-profile-and-level-from-profile-level-id-in-sdp
# caps=\"profile-level-id=428014\"
# caps=\"profile-level-id=42801f\"

```

### Reproducir rtsp

Fichero playrtsp.sh:

```bash
#!/bin/bash

ffplay rtsp://127.0.0.1:8554/test

```

## Instalación

### Windows

Mingw64:

```bash
pacman -Sy mingw-w64-x86_64-gstreamer mingw-w64-x86_64-gst-rtsp-server mingw-w64-x86_64-gst-plugins-base mingw-w64-x86_64-gst-plugins-good mingw-w64-x86_64-gst-plugins-ugly mingw-w64-x86_64-gst-plugins-bad

```

Instalador windows: [enlace](https://gstreamer.freedesktop.org/data/pkg/windows/)

### Arch

> TODO

## Ejemplos básicos

### Video test

```bash
gst-launch-1.0 -v videotestsrc ! videoconvert ! autovideosink
```

### Create file from videotestsrc

```bash
gst-launch-1.0 -v videotestsrc num-buffers=1000 ! x264enc  qp-min=18 ! avimux ! filesink location=video_test.avi
```

### Create rtp from videotestsrc

```bash
gst-launch-1.0 -v videotestsrc ! x264enc qp-min=18 ! rtph264pay config-interval=10 pt=96 ! udpsink host=127.0.0.1 port=5000

```

### Create rtp from device input

Option 1 (not tested)

```bash
gst-launch-1.0 ksvideosrc device-index=0 ! decodebin ! videoconvert ! x264enc ! rtph264pay pt=96 ! fakesink dump=true
```

Option 2 (not tested)

```bash
gst-launch-1.0 v4l2src device=/dev/video1 ! 'video/x-h264,width=800,height=448,framerate=30/1' ! h264parse ! rtph264pay config-interval=10 pt=96 ! udpsink host=127.0.0.1 port=5000
```

### Play rtp

#### Play rtp in vlc player

Create SDP file:

```bash
v=0
m=video 5000 RTP/AVP 96
c=IN IP4 127.0.0.1
a=rtpmap:96 H264/90000
```

And open in vlc:

```bash
vlc <filename>.sdp
```

#### Play rtp in ffplay

```bash
ffplay -protocol_whitelist file,udp,rtp rtp.sdp
```

#### Play rtp in gstreamer

```bash
gst-launch-1.0 udpsrc address=127.0.0.1 port=5000 \
        ! "application/x-rtp,media=(string)video,clock-rate=(int)90000,encoding-name=(string)H264" \
        ! rtph264depay \
        ! avdec_h264 \
        ! videoconvert \
        ! autovideosink
```

### rtsp server

- gst-rtsp-server
- happytime-rtsp server
- live555
- unreal media server

#### gst-rtsp-server

Se trata de una librería con la que crear servidores RTSP.

> No es un plugin de gstreamer

Incluye varios ejemplos, entre ellos gst-rtsp-launch.

##### Instalación Arch

```
yaourt -Sy gst-rtsp-server

```

##### Test

```bash
gst-rtsp-launch "( videotestsrc ! x264enc ! rtph264pay name=pay0 pt=96 )"
```

##### Test from rtp

```bash
gst-rtsp-launch -p 8554 "( udpsrc address=127.0.0.1 port=5000 \
 caps=\"application/x-rtp,media=video,clock-rate=90000,encoding-name=H264,payload=96\" \
 ! queue ! rtph264depay ! rtph264pay name=pay0 pt=96 )"
```

##### Play ffmpeg

```bash
ffplay rtsp://127.0.0.1:8554/test
```

##### Compilación bare-metal

```bash
git clone git://anongit.freedesktop.org/gstreamer/gst-rtsp-server
cd gst-rtsp-server
git checkout remotes/origin/1.14.4
./autogen.sh --noconfigure
GST_PLUGINS_GOOD_DIR=$(pkg-config --variable=pluginsdir gstreamer-plugins-bad-1.0) ./configure
make
make install
cd examples
./test-launch "( videotestsrc ! x264enc ! rtph264pay name=pay0 pt=96 )

```

### send screen

linux send h264 rtp stream:

```bash
gst-launch-1.0 -v ximagesrc ! video/x-raw,framerate=20/1 ! videoscale ! videoconvert ! x264enc tune=zerolatency bitrate=500 speed-preset=superfast ! rtph264pay ! udpsink host=127.0.0.1 port=5000
```

Macos send h264 rtp stream:

```bash
gst-launch-1.0 -v avfvideosrc capture-screen=true ! video/x-raw,framerate=20/1 ! videoscale ! videoconvert ! x264enc tune=zerolatency bitrate=500 speed-preset=superfast ! rtph264pay ! udpsink host=127.0.0.1 port=5000
```

receive h264 rtp stream:

```bash
gst-launch-1.0 -v udpsrc port=5000 caps = "application/x-rtp, media=(string)video, clock-rate=(int)90000, encoding-name=(string)H264, payload=(int)96" ! rtph264depay ! decodebin ! videoconvert ! autovideosink
```

### record and play rtsp stream

Record:

```bash
gst-launch-0.10 rtspsrc location=rtsp://127.0.0.1/live.sdp latency=0 ! decodebin ! ffmpegcolorspace ! ffenc_mpeg4 ! avimux ! filesink location=sample.avi
```

Play:

```bash
gst-launch-0.10 playbin uri=rtsp://192.168.100.50/live.sdp
gst-launch-0.10 udpsrc port=51234 ! decodebin ! ffmpegcolorspace ! autovideosink
```

## Notas

- Usar -v imprime las capacidades negociadas con el sumidero (video caps, audio caps.)
  Con dicha informadión, se puede crear un fichero sdp:
  ```bash
  v=<version>
  o= <owner> IN IP4 <IP4 ADDRESS>
  c=IN IP4 <IP4 ADDRESS>
  s=<STREAM "HUMAN" DESCRIPTION>
  m=<media> <udp port> RTP/AVP <payload>
  a=rtpmap:<payload> <encoding-name>/<clock-rate>[/<encoding-params>]
  a=fmtp:<payload> <param>=<value>;...
  ```

## Graphical pipe editors:

> Referencias:
>
> - [tutorial](https://developer.ridgerun.com/wiki/index.php/How_to_generate_a_Gstreamer_pipeline_diagram_%28graph%29)
> - [doc oficial](https://gstreamer.freedesktop.org/documentation/tutorials/basic/debugging-tools.html)
> - [pipeviz](https://github.com/virinext/pipeviz > https://embeddedartistry.com/blog/2018/2/22/generating-gstreamer-pipeline-graphs)

## RtspRestreamServer

> Referencia: [enlace](https://github.com/RSATom/RtspRestreamServer)

```bash
gst-launch-1.0 videotestsrc ! x264enc ! rtspclientsink location=rtsp://localhost:8001/test?record

vlc rtsp://localhost:8001/test
```

## Vlc como servidor rtsp

https://forum.videolan.org/viewtopic.php?t=58781
