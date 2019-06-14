---
title: "Tipos binarios en python"
date: "2019-05-02"
---

# Trabajar con binarios en python

> Referencias:
>
> - [doc python](https://docs.python.org/3/library/stdtypes.html#binaryseq)
>
> - [fluent python](https://www.oreilly.com/library/view/fluent-python/9781491946237/ch04.html)

## Expresar números en diferentes bases

```python
>>> 0x12AF
4783
>>> 0x100
256
>>> 0b101111
47
```

## Operaciones a nivel de bits

```python
# Some bytes to play with
byte1 = int('11110000', 2)  # 240
byte2 = int('00001111', 2)  # 15
byte3 = int('01010101', 2)  # 85

# Ones Complement (Flip the bits)
print(~byte1)

# AND
print(byte1 & byte2)

# OR
print(byte1 | byte2)

# XOR
print(byte1 ^ byte3)

# Shifting right will lose the right-most bit
print(byte2 >> 3)

# Shifting left will add a 0 bit on the right side
print(byte2 << 1)

# See if a single bit is set
bit_mask = int('00000001', 2)  # Bit 1
print(bit_mask & byte1)  # Is bit set in byte1?
print(bit_mask & byte2)  # Is bit set in byte2?
```

## Conversiones básicas

### entero -> bytes

```python
# Create one byte from the integer 16
i = 16
single_byte = i.to_bytes(1, byteorder='big', signed=True)
print(single_byte)

# Create four bytes from the integer
four_bytes = i.to_bytes(4, byteorder='big', signed=True)
print(four_bytes)

# Compare the difference to little endian
print(i.to_bytes(4, byteorder='little', signed=True))

# Create bytes from a list of integers with values from 0-255
bytes_from_list = bytes([255, 254, 253, 252])
print(bytes_from_list)
```

### bytes -> entero

```python
# Create an int from bytes. Default is unsigned.
some_bytes = b'\x00\xF0'
i = int.from_bytes(some_bytes, byteorder='big')
print(i)

# Create a signed int
i = int.from_bytes(b'\x00\x0F', byteorder='big', signed=True)
print(i)

# Use a list of integers 0-255 as a source of byte values
i = int.from_bytes([255, 0, 0, 0], byteorder='big')
print(i)
```

### entero -> cadena binaria

```python
>>> bin(173)
'0b10101101'
```

### cadena binaria -> entero

```python
>>> int('01010101111',2)
687
```

### cadena binaria -> cadena binaria con padding

```python
>>> format(int('010101', 2), '{fill}{width}b'.format(width=10, fill=0))
'0000010101'
>>> bin(6)[2:].zfill(8)
'00000110'
```

### cadena hexadecimal a entero

```python
>>> int('0xff',16)
255
>>> int('d484fa894e',16)
912764078414
```

### cadena hexadecimal a bytes

```python
# Starting with a hex string you can unhexlify it to bytes
deadbeef = binascii.unhexlify('DEADBEEF')
print(deadbeef)

>>> hexStr = bytes.fromhex('A2f7 4509')
>>> print(hexStr)
b'\xa2\xf7E\t'
```

### bytes a hexadecimal

```python
>>> byteString = b'\xa2\xf7E\t'
>>> print(byteString.hex())
a2f74509
```

### bytes a string

```python
# Given raw bytes, get an ASCII string representing the hex values
hex_data = binascii.hexlify(b'\x00\xff')  # Two bytes values 0 and 255

# The resulting value will be an ASCII string but it will be a bytes type
# It may be necessary to decode it to a regular string
text_string = hex_data.decode('utf-8')  # Result is string "00ff"
print(text_string)
```

### caracter a entero

```python
>>> int('01110101', 2)
117
>>> chr(int('01110101', 2))
'u'
>>> ord('u')
117
```

### Desplazamientos de bits

```python
>>> 1 << 0
1
>>> 1 << 1
2
>>> 1 << 2
4
>>> 1 << 3
8
>>> 1 << 4
16
>>> 1 << 5
32
>>> 1 << 6
64
>>> 1 << 7
128
```

### manipular cadenas de caracteres como octetos

```python
>>> bArray1 = b"XYZ"
>>> bArray2 = bArray1.replace(b"X", b"P")
>>> print(bArray2)
b'PYZ'


>>> byteArray1 = b'ABBACACBBACA'
>>> print(byteArray1.count(b'AC'))
3

>>> print(byteArray1.find(b'CA'))
4

>>> bArr = b'Mumbai,Kolkata,Delhi,Hyderabad'
>>> partList = bArr.partition(b',')
>>> print(partList)
(b'Mumbai', b',', b'Kolkata,Delhi,Hyderabad')

>>> myByteArray = bytearray('String', 'UTF-8')
>>> memView = memoryview(myByteArray)

>>> print(memView[2]) #ASCII of 'r'
114

>>> print(bytes(memView[1:5]))
b'trin'
```

## Tipos de datos bytes y bytearray

> Referencias:
>
> - [devdungeon](https://www.devdungeon.com/content/working-binary-data-python)

```python
# Create empty bytes
empty_bytes = bytes(4)
print(type(empty_bytes))
print(empty_bytes)

# Cast bytes to bytearray
mutable_bytes = bytearray(b'\x00\x0F')

# Bytearray allows modification
mutable_bytes[0] = 255
mutable_bytes.append(255)
print(mutable_bytes)

# Cast bytearray back to bytes
immutable_bytes = bytes(mutable_bytes)
print(immutable_bytes)
```

## Raw streams con módulo IO

```python
# Binary data and strings are different types, so a str
# must be encoded to binary using ascii, utf-8, or other.
binary_stream = io.BytesIO()
binary_stream.write("Hello, world!\n".encode('ascii'))
binary_stream.write("Hello, world!\n".encode('utf-8'))

# Move cursor back to the beginning of the buffer
binary_stream.seek(0)

# Read all data from the buffer
stream_data = binary_stream.read()

# The stream_data is type 'bytes', immutable
print(type(stream_data))
print(stream_data)

# To modify the actual contents of the existing buffer
# use getbuffer() to get an object you can modify.
# Modifying this object updates the underlying BytesIO buffer
mutable_buffer = binary_stream.getbuffer()
print(type(mutable_buffer))  # class 'memoryview'
mutable_buffer[0] = 0xFF

# Re-read the original stream. Contents will be modified
# because we modified the mutable buffer
binary_stream.seek(0)
print(binary_stream.read())
```

## Funciones muy útiles de manipulación de bits

> Referencia:
>
> - [wiki python](https://wiki.python.org/moin/BitManipulation)

#### Usando funciones

```python
# testBit() returns a nonzero result, 2**offset, if the bit at 'offset' is one.

def testBit(int_type, offset):
    mask = 1 << offset
    return(int_type & mask)

# setBit() returns an integer with the bit at 'offset' set to 1.

def setBit(int_type, offset):
    mask = 1 << offset
    return(int_type | mask)

# clearBit() returns an integer with the bit at 'offset' cleared.

def clearBit(int_type, offset):
    mask = ~(1 << offset)
    return(int_type & mask)

# toggleBit() returns an integer with the bit at 'offset' inverted, 0 -> 1 and 1 -> 0.

def toggleBit(int_type, offset):
    mask = 1 << offset
    return(int_type ^ mask)
```

#### Usando clases

```python
import ctypes
c_uint8 = ctypes.c_uint8

class Flags_bits( ctypes.LittleEndianStructure ):
    _fields_ = [
                ("logout",     c_uint8, 1 ),  # asByte & 1
                ("userswitch", c_uint8, 1 ),  # asByte & 2
                ("suspend",    c_uint8, 1 ),  # asByte & 4
                ("idle",       c_uint8, 1 ),  # asByte & 8
               ]

class Flags( ctypes.Union ):
    _anonymous_ = ("bit",)
    _fields_ = [
                ("bit",    Flags_bits ),
                ("asByte", c_uint8    )
               ]

flags = Flags()
flags.asByte = 0x2  # ->0010

print( "logout: %i"      % flags.bit.logout   )
# `bit` is defined as anonymous field, so its fields can also be accessed directly:
print( "logout: %i"      % flags.logout     )
print( "userswitch:  %i" % flags.userswitch )
print( "suspend   :  %i" % flags.suspend    )
print( "idle  : %i"      % flags.idle       )

# resultado:
logout: 0
logout: 0
userswitch:  1
suspend   :  0
idle  : 0
```

#### Extraer k bits:

> Referencia: [geeksforgeeks](https://www.geeksforgeeks.org/python-slicing-extract-k-bits-given-position/)

```python
# Function to extract ‘k’ bits from a given
# position in a number

def extractKBits(num,k,p):

     # convert number into binary first
     binary = bin(num)

     # remove first two characters
     binary = binary[2:]

     end = len(binary) - p
     start = end - k + 1

     # extract k  bit sub-string
     kBitSubStr = binary[start : end+1]

     # convert extracted sub-string into decimal again
     print (int(kBitSubStr,2))

# Driver program
if __name__ == "__main__":
    num = 171
    k = 5
    p = 2
    extractKBits(num,k,p)
```

## Byte order del sistem

```python
# Find out what byte order your system uses
import sys
print("Native byteorder: ", sys.byteorder)
print(repr(sys.byteorder))
```

## Módulo struct

> Referencias:
>
> - [doc oficial](https://docs.python.org/2/library/struct.html)
> - [geeksforgeeks](https://www.geeksforgeeks.org/struct-module-python/)
> - [pymotw](https://pymotw.com/2/struct/)

Permite convertir valores Python en estructuras en C (incluyendo padding bytes)

- struct.pack(formato, valor1, valor2...)

- struct.unpack(formato, valor1, valor2...)

Donde formato indica byteorder, size and alignment de cada elemento

Ejemplos 1:

```python
import struct

# '?' -> _BOOL , 'h' -> short, 'i' -> int and 'l' -> long
var = struct.pack('?hil', True, 2, 5, 445)
print(var)
# b'\x01\x00\x02\x00\x05\x00\x00\x00\xbd\x01\x00\x00\x00\x00\x00\x00'

# struct.unpack() return a tuples
# Variables V1, V2, V3,.. are returned as elements of tuple
tup = struct.unpack('?hil', var)
print(tup)
# (True, 2, 5, 445)

# q -> long long int and f -> float
var = struct.pack('qf', 5, 2.3)
print(var)
# b'\x05\x00\x00\x00\x00\x00\x00\x0033\x13@'

tup = struct.unpack('qf', var)
print(tup)
# (5, 2.299999952316284)
```

Ejemplos 2:

```python
import struct
var = struct.pack('?hil', True, 2, 5, 445)
print(var)
# b'\x01\x00\x02\x00\x05\x00\x00\x00\xbd\x01\x00\x00\x00\x00\x00\x00'

# Returns the size of the structure
print(struct.calcsize('?hil'))
# 16
print(struct.calcsize('qf'))
# 12
```

Ejemplos 3:

```python
import struct
import binascii

values = (1, 'ab', 2.7)
s = struct.Struct('I 2s f')
packed_data = s.pack(*values)

print 'Original values:', values
print 'Format string  :', s.format
print 'Uses           :', s.size, 'bytes'
print 'Packed Value   :', binascii.hexlify(packed_data)
# Original values: (1, 'ab', 2.7)
# Format string  : I 2s f
# Uses           : 12 bytes
# Packed Value   : 0100000061620000cdcc2c40
```

## Protocolos para puerto serie

> Referencias:
>
> - [The green place - frames and protocols](https://eli.thegreenplace.net/2009/08/20/frames-and-protocols-for-the-serial-port-in-python)

Para transmitir secuencias de bytes: array de enteros (0-255) o 'packet string'

### Arrays de datos en python

```python
>>> arr = [0x45, 0xAB, 0xC3, 0x16]
>>> arr
[69, 171, 195, 22]
>>> str = '\x45\xAB\xC3\x16'
>>> str
'E\xab\xc3\x16'
>>> ''.join(chr(b) for b in arr)
'E\xab\xc3\x16'
>>> [ord(b) for b in str]
[69, 171, 195, 22]
```

### Serializar datos

> Serializar datos == convertirlos en un packet string

Aunque python incluye los módulos 'array' y 'struct', es mucho más fácil trabajar con la librería 'construct'.

Ejemplo:

```python
from construct import *

message_crc = Struct('message_crc', ULInt32('crc'))

message_format = Struct('message_format',
    ULInt16('msg_id'),
    ULInt16('dest_addr'),
    Enum(Byte('command_type'),
        RESTART = 0x40,
        RESTART_ACK = 0x80,
        SIGNAL = 0x22,
        _default_ = Pass
    ),
    BitStruct('flags',
        Flag('on'),
        BitField('status', 3),
        Flag('cache'),
        Padding(3)
    ),
    Byte('datalen'),
    Array(lambda ctx: ctx['datalen'], Byte('data')),
    Embed(message_crc)
)
```

Características:

- Especificación explícita del endianness
- Enumerados
- campos de bytes y bits
- Arrays con longitud específica
- Estructuras anidadas

Uso de la definición del mensaje:

```python
>>> from sampleformat import message_format
>>> from construct import *
>>> raw = message_format.build(Container(
...         msg_id=0x1234,
...         dest_addr=0xacba,
...         command_type='RESTART',
...         flags=Container(on=1, cache=0, status=4),
...         datalen=4,
...         data=[0x1, 0xff, 0xff, 0xdd],
...         crc=0x12345678))
>>> raw.encode('hex')
'3412baac40c00401ffffdd78563412'
>>> c = message_format.parse(raw)
>>> print c
Container:
    msg_id = 4660
    dest_addr = 44218
    command_type = 'RESTART'
    flags = Container:
        on = True
        status = 4
        cache = False
    datalen = 4
    data = [
        1
        255
        255
        221
    ]
    crc = 305419896
```

Dos cosas interesantes:

- message_format contiene 'build' y 'parse' para empaquetar/desempaquetar
- Container es una clase de construct. También se podría haber usado namedtuple (build hace duck typing)
- rawes una packed string

## Otros módulos populares

https://construct.readthedocs.io/en/latest/intro.html

https://scapy.net/

https://pythonhosted.org/protlib/

## python y sockets

> Referencia:
>
> - [real python](https://realpython.com/python-sockets/)
