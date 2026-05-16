# Ruta para llevar el sistema a varias laptops

## Etapa 1: Backend local con SQLite

Estado: funcionando.

- Servidor local: `backend/server.py`
- Base de datos: `database/dental.sqlite3`
- Puerto recomendado: `8790`
- Acceso: `http://127.0.0.1:8790/index.html`

## Etapa 2: Conectar la pantalla actual al backend

Estado: avanzado.

Ya estan conectados:

1. Login real con usuarios y roles
2. Pacientes
3. Agenda
4. Historial clinico
5. Odontograma
6. Tratamientos
7. Pagos y caja
8. Caja general
9. Usuarios del sistema

## Etapa 3: Red local del consultorio

Ejecutar en la laptop principal:

```bat
ABRIR_SISTEMA_DENTAL_RED_LOCAL.bat
```

Luego abrir desde las otras laptops la IP que aparezca en pantalla, por ejemplo:

```text
http://192.168.1.25:8790/index.html
```

Para esta opcion la laptop principal debe estar prendida. Si se va la luz, no se pierde lo que ya se guardo en la base, pero las otras laptops no podran entrar hasta volver a encender el servidor.

## Etapa 4: Nube

Estado: preparado para primer despliegue.

Archivos agregados:

- `Procfile`
- `requirements.txt`
- `render.yaml`
- `DESPLIEGUE_RENDER.md`

Primera version gratis:

- Render Web Service Free
- PostgreSQL gratis en Supabase o Neon
- Variable `HOST=0.0.0.0`
- Variable `DATABASE_URL` con la conexion PostgreSQL
- Variable `ADMIN_PASSWORD` con una contrasena segura

Siguiente mejora:

- Activar backups automaticos.
- Usar dominio propio si deseas.

## Recomendacion

Para pruebas en el consultorio, usar red local con SQLite. Para trabajo permanente con varias laptops, acceso remoto y menor riesgo por cortes de luz, migrar a PostgreSQL en la nube con backups automaticos.
