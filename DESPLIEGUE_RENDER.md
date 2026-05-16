# Despliegue en Render

Esta es la forma mas directa de poner el sistema en la nube y acceder desde cualquier laptop con internet.

## Importante

Esta primera version en nube usa SQLite con disco persistente de Render.

Ventajas:

- Es mas rapido de desplegar.
- No depende de una laptop prendida.
- Todos entran con una URL web.

Limitacion:

- Para un uso mas grande o con muchas sedes, lo ideal despues sera migrar a PostgreSQL.

## Archivos ya preparados

- `Procfile`
- `requirements.txt`
- `render.yaml`
- `backend/server.py`

El servidor lee:

- `PORT`: puerto que asigna Render.
- `HOST`: debe ser `0.0.0.0`.
- `DATA_DIR`: carpeta donde guardar la base.
- `ADMIN_PASSWORD`: contrasena inicial del administrador cuando la base esta vacia.

## Pasos

1. Crear una cuenta en Render.
2. Subir este proyecto a GitHub.
3. En Render elegir `New +` y luego `Blueprint`.
4. Conectar el repositorio de GitHub.
5. Render detectara `render.yaml`.
6. En la variable `ADMIN_PASSWORD`, colocar una contrasena segura.
7. Crear el servicio.
8. Esperar que termine el despliegue.
9. Abrir la URL publica que Render entregue.

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

En esta etapa, la base vive en el disco persistente de Render:

```text
/var/data/dental.sqlite3
```

Cuando pasemos a PostgreSQL, los respaldos se podran automatizar mejor.

## Recomendacion de uso

Para probar la nube:

1. Crear un paciente.
2. Entrar desde otra laptop o celular.
3. Iniciar sesion con otro usuario.
4. Confirmar que el paciente aparece.
5. Probar una cita, historial y pago.

Si todo funciona estable, el siguiente paso recomendado sera migrar la base a PostgreSQL.
