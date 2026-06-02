# EmpresaFacil - Pagina publicable

Esta carpeta contiene solo la pagina promocional lista para publicar en internet.

## Archivos incluidos

- `index.html`: pagina principal.
- `pagina-web.css`: estilos.
- `assets/software-products-hero.png`: imagen principal.
- `assets/empresa-facil-icon.svg`: icono de la marca.
- `netlify.toml`: configuracion para Netlify.
- `vercel.json`: configuracion para Vercel.

## Publicar rapido en Netlify

1. Entrar a https://app.netlify.com/drop
2. Arrastrar la carpeta `empresa-facil-publicar`.
3. Esperar que Netlify genere una URL.
4. Si tienes dominio, agregarlo en `Domain management`.

## Publicar rapido en Vercel

1. Entrar a https://vercel.com/new
2. Importar el repositorio o subir el proyecto.
3. Elegir esta carpeta como raiz del proyecto.
4. Publicar.

## Dominios sugeridos

- `empresafacil.pe`
- `empresafacil.com.pe`
- `empresafacilapp.com`
- `empresafacildigital.com`
- `empresafacilpro.com`

## DNS basico

Cuando compres el dominio, el hosting te dara registros DNS. Normalmente debes configurar:

- `A` o `CNAME` para el dominio principal.
- `CNAME` para `www`.

El panel de Netlify o Vercel indica los valores exactos.
