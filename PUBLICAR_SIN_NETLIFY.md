# Publicar EmpresaFacil sin Netlify

La opcion recomendada ahora es publicar la landing desde GitHub Pages usando la carpeta `docs`.

## Opcion 1: GitHub Pages

1. Entra al repositorio de GitHub.
2. Abre `Settings`.
3. Entra a `Pages`.
4. En `Build and deployment`, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
5. Guarda los cambios.

GitHub generara una URL parecida a:

`https://jhakyoplac-create.github.io/jyoplac/`

Luego se puede conectar un dominio propio como `empresafacil.pe`, `empresafacil.com.pe` o el dominio que elijas.

## Opcion 2: Vercel

Si quieres una plataforma mas parecida a una publicacion profesional con dominio facil:

1. Entra a Vercel.
2. Conecta tu cuenta de GitHub.
3. Importa el repositorio.
4. Configura como carpeta de salida la carpeta `docs`.
5. Publica y conecta el dominio.

## Archivo ZIP

Tambien queda un ZIP listo:

`empresa-facil-github-pages.zip`

Ese ZIP contiene solo la landing nueva y sus archivos principales.
