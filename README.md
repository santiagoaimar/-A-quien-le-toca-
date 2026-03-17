# ¿A quién le toca?

App para visualizar rotaciones semanales dentro de un equipo: quién tiene el horario cortado cada semana y quién trae la comida los viernes.

---

## Módulos

### Cortado
Rotación semanal del horario cortado entre **Santi, Nico, Kevin y Tomi**.
Bruno tiene horario corrido fijo y no entra en esta rotación.
Avanza una posición cada lunes.

### Viernes Feliz
Rotación semanal de quién trae comida entre **Kevin, Nico, Santi, Bruno y Tomi**.
Avanza una posición cada viernes.

---

## Stack

| Tecnología | Uso |
|---|---|
| React 18 + Vite 5 | Frontend |
| Three.js + @react-three/fiber + @react-three/drei | Escena 3D con modelos Pastelito |
| CSS plano con variables | Estilos |
| localStorage | Persistencia (sin backend) |
| Electron | Empaquetado como app de escritorio (Windows) |
| Tauri | Build alternativo nativo |

---

## Estructura del proyecto

```
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── CalendarMonth.jsx      # Calendario mensual del Cortado
│   │   ├── FridayQueue.jsx        # Cola del Viernes Feliz
│   │   ├── ThreeHero.jsx          # Escena 3D principal
│   │   ├── ThreeCanvas.jsx
│   │   ├── PastelCanvas.jsx
│   │   ├── MiniCanvas.jsx
│   │   ├── MiniPastelito.jsx
│   │   ├── PersonLegend.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── PasswordModal.jsx
│   ├── data/
│   │   └── demoData.js            # Participantes, colores y fechas base
│   ├── hooks/
│   │   └── useLocalStorage.js
│   └── utils/
│       ├── dateUtils.js
│       └── rotationUtils.js       # Lógica de rotación por semanas
├── public/
│   └── models/                    # Modelos 3D (.glb)
├── electron/
│   └── main.cjs                   # Entry point Electron
├── src-tauri/                     # Config Tauri
└── 3D Models/                     # Fuentes originales de los .glb
```

---

## Lógica de rotación

La rotación es puramente matemática, sin base de datos. Dada una **fecha base** (el turno inicial del primer participante) y la fecha actual, se calcula cuántas semanas pasaron y se hace `semanas % cantidad_participantes` para obtener el índice actual.

```js
// rotationUtils.js
const weeks = weeksBetween(base, targetDate);
const idx = ((weeks % participants.length) + participants.length) % participants.length;
```

Esto permite que la app funcione correctamente hacia adelante y hacia atrás en el tiempo sin ningún estado persistido.

---

## Colores por persona

| Persona | Color |
|---|---|
| Kevin | `#7de3ff` — celeste |
| Nico | `#e97dff` — lila |
| Santi | `#7dffa8` — verde menta |
| Bruno | `#ff9f9f` — coral |
| Tomi | `#ecff7d` — amarillo-verde |

---

## Desarrollo local

```bash
npm install

# Web (Vite)
npm run dev

# App de escritorio con Electron
npm run electron:dev

# App nativa con Tauri
npm run tauri:dev
```

## Build

```bash
# Web
npm run build

# Instalador Windows (.exe) con Electron
npm run dist

# Build nativo Tauri
npm run tauri:build
```

---

## Fechas base de referencia

- **Viernes Feliz:** `2026-03-06` — Kevin, primer turno
- **Cortado:** `2026-03-02` — Santi, primera semana
