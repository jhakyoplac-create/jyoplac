# Despliegue en Render

Esta es la forma gratis de poner el sistema en la nube y acceder desde cualquier laptop con internet.

## Importante

Esta version gratis usa:

- Render Free para publicar la web.
- PostgreSQL gratis externo en Supabase o Neon.

Ventajas:

- No requiere tarjeta en Render para el servidor web.
- No depende de una laptop prendida.
- Todos entran con una URL web.
- Los datos quedan en PostgreSQL, no en el disco temporal de Render.

## Archivos ya preparados

- `Procfile`
- `requirements.txt`
- `render.yaml`
- `backend/server.py`

El servidor lee:

- `PORT`: puerto que asigna Render.
- `HOST`: debe ser `0.0.0.0`.
- `DATABASE_URL`: conexion de PostgreSQL de Supabase o Neon.
- `ADMIN_PASSWORD`: contrasena inicial del administrador cuando la base esta vacia.

## Pasos

1. Crear una base gratis en Supabase o Neon.
2. Copiar el connection string PostgreSQL.
3. En Render elegir `New +` y luego `Blueprint`.
4. Conectar el repositorio `jhakyoplac-create/jyoplac`.
5. Render detectara `render.yaml`.
6. En la variable `DATABASE_URL`, pegar la conexion PostgreSQL.
7. En la variable `ADMIN_PASSWORD`, colocar una contrasena segura.
8. Crear el servicio.
9. Esperar que termine el despliegue.
10. Abrir la URL publica que Render entregue.

## DATABASE_URL

Debe tener una forma parecida a:

```text
postgresql://usuario:contrasena@host:puerto/base?sslmode=require
```

Supabase y Neon entregan este dato en su panel. Si la contrasena tiene simbolos especiales, usa la URL exacta que entrega el proveedor.

## Primer ingreso

Usuario:

```text
admin
```

Contrasena:

```text
la que colocaste en ADMIN_PASSWORD
```

## Respaldo

La base vive en Supabase o Neon. Desde esos paneles se pueden descargar respaldos o activar opciones de backup segun el plan.

## Recomendacion de uso

Para probar la nube:

1. Crear un paciente.
2. Entrar desde otra laptop o celular.
3. Iniciar sesion con otro usuario.
4. Confirmar que el paciente aparece.
5. Probar una cita, historial y pago.

Si todo funciona estable, el siguiente paso recomendado sera activar backups automaticos o pasar a un plan pago cuando el consultorio ya lo use todos los dias.
