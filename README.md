# Atlético Nacional · Archivo de datos

    npm run dev      # http://localhost:3000
    npm run build && npm start

## Cómo agregar fotos
- **Jugador:** guarda `public/players/<slug>.webp` (3:4 vertical). El slug es el de `src/data/players.ts`.
- **Leyenda:** `public/legends/<slug>.webp`.
- **Galería histórica:** copia la imagen a `public/gallery/` (`.webp`) y añade una línea en `src/data/gallery.ts`.
Si falta el archivo, la interfaz muestra automáticamente el dorsal, las iniciales o el año.

## Plantilla separada de la temporada
- `src/data/players.ts`  → quién es cada jugador (nombre, dorsal, posición, foto).
- `src/data/seasons.ts`  → qué hizo cada uno por temporada (se cruza por `slug`).
Nueva temporada = un objeto nuevo en `seasons.ts`. Un fichaje = una línea en `players.ts`.

## Datos
Todo lo que dice "muestra" o "por completar" debe reemplazarse con datos verificados.

## Sincronizaciones
- `npm run sync:espn` actualiza `src/data/fixtures.ts` con los partidos de la temporada de Atlético Nacional.
- `npm run sync:espn -- --refresh` vuelve a consultar ESPN e ignora el caché local.
- `npm run sync:wikimedia` descarga fotos con licencia CC BY, CC BY-SA o de dominio público y registra autor, licencia y fuente en `src/data/commons-attribution.json`.
- `npm run sync:wikimedia -- --refresh` vuelve a buscar las imágenes; si no encuentra una coincidencia compatible, la interfaz muestra su recurso alternativo.
- `npm test` comprueba las relaciones entre temporadas, plantilla, dorsales y archivos de imagen.
- GitHub Actions actualiza y valida los datos de ESPN cada lunes; habilita permisos de escritura para `GITHUB_TOKEN` en Actions. Configura `NEXT_PUBLIC_SITE_URL` con el dominio de despliegue para establecer `metadataBase`.
