# Sistema dental con base de datos

Este backend es el primer paso para que el sistema deje de depender del navegador y pueda sincronizarse entre varias laptops.

## Como abrirlo

Ejecutar:

```bat
ABRIR_SISTEMA_DENTAL_CON_BASE_DE_DATOS.bat
```

Luego abrir:

```text
http://127.0.0.1:8790/index.html
```

## Como usarlo desde otras laptops en el consultorio

En la laptop principal ejecutar:

```bat
ABRIR_SISTEMA_DENTAL_RED_LOCAL.bat
```

La ventana mostrara una direccion parecida a:

```text
http://192.168.1.25:8790/index.html
```

Esa direccion se abre en Chrome/Edge desde las otras laptops conectadas al mismo WiFi o red cableada.

La laptop principal debe permanecer encendida. Si se apaga, las demas laptops dejan de conectarse, pero la informacion guardada queda en:

```text
database/dental.sqlite3
```

## Usuario inicial

Usuario: `admin`

Contrasena: `admin123`

## Base de datos

La base se crea automaticamente en:

```text
database/dental.sqlite3
```

## Respaldos

Ejecutar:

```bat
RESPALDO_BASE_DE_DATOS.bat
```

Se creara una copia en:

```text
backups/
```

Recomendacion: copiar esa carpeta a USB, Google Drive, OneDrive o disco externo al cerrar el dia.

## Estado actual

El sistema ya usa `/api/*` y SQLite para pacientes, citas, historial, odontograma, tratamientos, pagos, caja, caja general y usuarios.
