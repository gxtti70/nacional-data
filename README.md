# Atlético Nacional · Archivo de datos

    npm run dev      # http://localhost:3000
    npm run build && npm start

## Cómo agregar fotos
- **Jugador:** guarda `public/players/<slug>.jpg` (3:4 vertical). El slug es el de `src/data/players.ts`.
- **Leyenda:** `public/legends/<slug>.jpg`.
- **Galería histórica:** copia la imagen a `public/gallery/` y añade una línea en `src/data/gallery.ts`.
Si falta el archivo, la interfaz muestra automáticamente el dorsal, las iniciales o el año.

## Plantilla separada de la temporada
- `src/data/players.ts`  → quién es cada jugador (nombre, dorsal, posición, foto).
- `src/data/seasons.ts`  → qué hizo cada uno por temporada (se cruza por `slug`).
Nueva temporada = un objeto nuevo en `seasons.ts`. Un fichaje = una línea en `players.ts`.

## Datos
Todo lo que dice "muestra" o "por completar" debe reemplazarse con datos verificados.
