# File Upload App - Dashboard de Análisis Interactivo

Una aplicación web moderna para cargar archivos de datos (CSV, Excel) y generar automáticamente recomendaciones de visualización con gráficos interactivos en tiempo real.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Configuración y Instalación](#configuración-e-instalación)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Guía de Uso](#guía-de-uso)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Patrones de Diseño](#patrones-de-diseño)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Dependencias Principales](#dependencias-principales)

## 📖 Descripción General

Esta aplicación proporciona un flujo de trabajo intuitivo para:

1. **Cargar datos**: Sube archivos CSV o Excel con tus datos
2. **Obtener recomendaciones**: El sistema analiza automáticamente los datos y sugiere visualizaciones apropiadas
3. **Crear dashboard**: Personaliza tu dashboard agregando gráficos recomendados
4. **Visualizar insights**: Explora los datos con gráficos interactivos y análisis en tiempo real

### Características Principales

✨ **Interfaz Moderna**: Diseño responsivo y atractivo con tema oscuro/claro  
📊 **Gráficos Interactivos**: Visualizaciones dinámicas usando Recharts  
🎯 **Recomendaciones Automáticas**: Análisis inteligente de datos para sugerir mejores gráficos  
💾 **Persistencia Local**: Guarda tu dashboard automáticamente en el navegador  
🔄 **Transformación de Datos**: Conversión automática entre formatos frontend y backend  
⚡ **Actualización en Tiempo Real**: Cambios instantáneos en el dashboard

---

## 🚀 Configuración e Instalación

### Requisitos Previos

- **Node.js**: v18+ ([descargar](https://nodejs.org/))
- **npm**: v9+ (incluido con Node.js)
- **Backend Flask**: Debe estar corriendo en `http://localhost:5000`
  - Ver [guía de integración](./INTEGRATION.md)

### Instalación

1. **Clonar o navegar al proyecto**:
```bash
cd file-upload-app
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Conexión con el backend Flask
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Nota importante**: Las variables que comienzan con `NEXT_PUBLIC_` están disponibles en el navegador. No incluyas datos sensibles.

### Verificar Instalación

Para verificar que todo está correctamente instalado:

```bash
npm run lint
```

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo

Inicia el servidor de desarrollo (incluye hot reload):

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:8080**

### Modo Producción

1. **Compilar el proyecto**:
```bash
npm run build
```

2. **Iniciar servidor**:
```bash
npm start
```

### Con Backend Flask

Para que la aplicación funcione completamente, necesitas ejecutar el backend Flask en paralelo:

**Terminal 1** (Backend):
```bash
cd RecomendedChartWS
.\venv\Scripts\activate  # Windows
# o
source venv/bin/activate  # Linux/Mac

python run.py
# Backend disponible en http://localhost:5000
```

**Terminal 2** (Frontend):
```bash
cd file-upload-app
npm run dev
# Frontend disponible en http://localhost:8080
```

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │    COMPONENTES REACT            │
        │  (Interfaz de Usuario)          │
        │                                 │
        │  • FileUploadZone               │
        │  • AnalysisSidebar              │
        │  • DashboardGrid                │
        │  • ResultDisplay                │
        └────────────┬─────────────────────┘
                     │
        ┌────────────▼──────────────────┐
        │    CAPA DE LÓGICA              │
        │  (lib/*)                       │
        │                                │
        │  • api.ts (HTTP requests)      │
        │  • data-transform.ts (mapeos)  │
        │  • dashboard-storage.ts (cache)│
        │  • mock-data.ts (tipos)        │
        └────────────┬──────────────────┘
                     │
        ┌────────────▼──────────────────┐
        │    BACKEND FLASK               │
        │  (http://localhost:5000)       │
        │                                │
        │  • Análisis de datos           │
        │  • Recomendaciones de gráficos │
        │  • Agregación de datos         │
        └────────────┬──────────────────┘
                     │
        ┌────────────▼──────────────────┐
        │    BASE DE DATOS               │
        │  (uploaded files)              │
        └────────────────────────────────┘
```

### Flujo de Datos

#### 1. **Carga de Archivo**
```
Usuario selecciona archivo
    ↓
FileUploadZone valida el archivo
    ↓
uploadFile() → POST /api/upload
    ↓
Backend analiza archivo → genera recomendaciones
    ↓
UploadResponse con recomendaciones
```

#### 2. **Conversión de Recomendaciones a Tarjetas**
```
ChartRecommendation (backend)
    ↓
transformRecommendationToCard()
    ↓
AnalysisCard (frontend)
```

#### 3. **Agregación de Gráfico al Dashboard**
```
Usuario hace clic "Agregar"
    ↓
enrichCardWithData() → POST /api/chart/data
    ↓
Backend calcula datos agregados
    ↓
transformChartDataToCardData()
    ↓
AnalysisCard con datos completos
    ↓
saveDashboardCharts() → localStorage
```

### Capas de la Aplicación

| Capa | Responsabilidad | Archivos |
|------|-----------------|----------|
| **Presentación** | Interfaz de usuario | `app/`, `components/` |
| **Lógica de Negocio** | Transformación de datos | `lib/data-transform.ts` |
| **API** | Comunicación HTTP | `lib/api.ts` |
| **Almacenamiento** | Cache local | `lib/dashboard-storage.ts` |
| **Tipos** | Definiciones TypeScript | `lib/mock-data.ts` |

---

## 📱 Guía de Uso

### 1. Cargar un Archivo

1. Haz clic en el área de carga o arrastra un archivo
2. Formatos soportados: **CSV**, **Excel (.xlsx, .xls)**
3. Se mostrará un indicador de progreso durante la carga

### 2. Revisar Recomendaciones

Después de cargar el archivo:
- Se abre el panel lateral con recomendaciones de gráficos
- Cada tarjeta muestra:
  - **Tipo de gráfico** (barra, línea, pastel, etc.)
  - **Variables** (ejes X e Y)
  - **Insight** (análisis inteligente del dato)

### 3. Agregar Gráficos al Dashboard

1. Haz clic en **"Agregar al Dashboard"** en una recomendación
2. El gráfico se calcula y se agrega al dashboard en tiempo real
3. Los gráficos se guardan automáticamente en tu navegador

### 4. Interactuar con Gráficos

- **Hover**: Pasa el mouse para ver valores detallados
- **Reasizable**: Muchos gráficos son redimensionables
- **Responsive**: Adaptan automáticamente el tamaño en móvil

### 5. Gestionar Dashboard

- **Limpiar todo**: Botón para eliminar todos los gráficos
- **Persistencia**: Tu dashboard se guarda automáticamente
- **Recargar**: Tu dashboard persiste al refrescar la página

### Ejemplo de Flujo Completo

```
1. Abres la app → Dashboard vacío
2. Subes "ventas.xlsx"
3. Sistema analiza 5 columnas: fecha, región, producto, cantidad, monto
4. Se recomiendan:
   - Gráfico de barras: Monto por región
   - Gráfico de líneas: Monto a lo largo del tiempo
   - Gráfico de pastel: Proporción por producto
5. Agregas 2 gráficos al dashboard
6. Refrescas la página → Los gráficos siguen ahí (guardados en localStorage)
```

---

## 🔧 Decisiones Técnicas

### Framework: Next.js 16 (React 19)

**Por qué Next.js:**
- ✅ SSR/SSG integrado para mejor SEO
- ✅ File-based routing (menos boilerplate)
- ✅ API routes (aunque no se usan en este proyecto)
- ✅ Excelente rendimiento y optimizaciones automáticas
- ✅ TypeScript first-class support

**React 19:**
- Hooks modernos y optimizaciones de rendimiento
- Server Components (no usados aquí, pero disponibles)

### UI Components: Radix UI + Tailwind CSS

**Radix UI** (Accesibilidad):
- ✅ Componentes accesibles por defecto (ARIA)
- ✅ Sin dependencias de estilos fuertes
- ✅ Control total del styling
- ✅ Componentes de calidad empresarial

**Tailwind CSS 4**:
- ✅ Utility-first CSS para desarrollo rápido
- ✅ Bundle size optimizado (purge automático)
- ✅ Temas dinámicos integrados con next-themes
- ✅ Mejor mantenibilidad que CSS-in-JS

**Por qué esta combinación:**
- Accesibilidad + rendimiento
- Sin runtime overhead
- Componentes customizables pero con buenos defaults

### Gráficos: Recharts

**Por qué Recharts:**
- ✅ Basado en React (excelente integración)
- ✅ Componibles (construyes gráficos con componentes)
- ✅ Interactivo por defecto (tooltips, leyendas)
- ✅ Responsive automático
- ✅ Performance (usa SVG y canvas)

**Alternativas consideradas:**
- Chart.js: Más bajo nivel, menos integración con React
- D3.js: Muy complejo para este use case
- Apache ECharts: Más pesado, overkill para el proyecto

### Validación de Formularios: React Hook Form + Zod

**React Hook Form:**
- ✅ Performance (no re-renders innecesarios)
- ✅ Integración con Radix UI
- ✅ API simple e intuitiva

**Zod:**
- ✅ Validación en runtime
- ✅ Type-safe (inferencia automática de tipos)
- ✅ Mensajes de error customizables

### Gestión de Estado

**Por qué no Redux/Zustand/Context:**
```
El proyecto es relativamente simple:
- Estado principal en home (page.tsx)
- Props drilling aceptable
- localStorage para persistencia
→ Solución KISS: React hooks nativo
```

**Persistencia: localStorage**
- ✅ Perfecto para guardar dashboard del usuario
- ✅ Rápido y sincrónico
- ✅ No requiere backend

### TypeScript

**Configuración estricta:**
- `strict: true` en tsconfig.json
- Tipos explícitos en funciones públicas
- Interfaces para contrato entre componentes

**Ventajas:**
- Early error detection
- Better IDE support
- Self-documenting code

---

## 🎨 Patrones de Diseño

### 1. **Component Composition** (Composición)
```typescript
// En lugar de megacomponentes, componentes pequeños reutilizables
<DashboardGrid>
  <Card>
    <AnalysisCard />
  </Card>
</DashboardGrid>
```

### 2. **Container/Presentational Pattern**
```typescript
// Componentes inteligentes (page.tsx, análisis-sidebar.tsx)
// Componentes tontos (file-upload-zone.tsx, result-display.tsx)
```

### 3. **Adapter Pattern** (Transformación de Datos)
```typescript
// lib/data-transform.ts
// Convierte formato backend → frontend
transformRecommendationToCard(recommendation) → AnalysisCard
transformChartDataToCardData(chartData) → CardData
```

### 4. **Strategy Pattern** (Tipos de Gráficos)
```typescript
// Diferentes estrategias de rendering basadas en chartType
const ChartComponent = getChartRenderer(card.chartType)
<ChartComponent data={card.data} />
```

### 5. **Observer Pattern** (Hooks)
```typescript
// useEffect escucha cambios en dashboardCharts
useEffect(() => {
  saveDashboardCharts(dashboardCharts)
}, [dashboardCharts])
```

### 6. **Factory Pattern** (Creación de Cards)
```typescript
// lib/data-transform.ts
export function transformRecommendationToCard(
  recommendation: ChartRecommendation
): AnalysisCard
// Factory que crea AnalysisCards a partir de recomendaciones
```

### 7. **Service Locator** (API Service)
```typescript
// lib/api.ts
// Punto central para toda comunicación HTTP
uploadFile()
getChartData()
```

---

## 📁 Estructura de Carpetas

```
file-upload-app/
│
├── app/                          # Next.js app directory (SSR)
│   ├── page.tsx                  # Página principal (componente inteligente)
│   ├── layout.tsx                # Layout base
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes React
│   ├── dashboard-grid.tsx        # Cuadrícula de gráficos (inteligente)
│   ├── analysis-sidebar.tsx      # Panel de recomendaciones (inteligente)
│   ├── file-upload-zone.tsx      # Zona de carga (tonto)
│   ├── result-display.tsx        # Mostrador de resultados (tonto)
│   ├── analysis-cards.tsx        # Tarjetas de análisis (tonto)
│   ├── loading-animation.tsx     # Animación de carga (tonto)
│   ├── interactive-background.tsx # Fondo interactivo (presentación)
│   ├── theme-provider.tsx        # Proveedor de tema
│   │
│   └── ui/                       # Componentes base de Radix UI
│       ├── button.tsx            # Botón customizado
│       ├── card.tsx              # Tarjeta customizada
│       ├── dialog.tsx            # Diálogo modal
│       ├── sidebar.tsx           # Sidebar responsive
│       ├── select.tsx            # Selector dropdown
│       ├── chart.tsx             # Componentes de gráficos
│       └── ... (otros 30+ componentes de UI)
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── api.ts                    # Servicio HTTP (comunica con backend)
│   ├── data-transform.ts         # Transformadores (backend → frontend)
│   ├── dashboard-storage.ts      # Persistencia en localStorage
│   ├── mock-data.ts              # Tipos e interfaces TypeScript
│   └── utils.ts                  # Funciones auxiliares (cn, etc.)
│
├── hooks/                        # Hooks personalizados
│   ├── use-mobile.ts             # Hook para detectar viewport móvil
│   └── use-toast.ts              # Hook para notificaciones
│
├── public/                       # Activos estáticos
│   └── (íconos, imágenes, etc.)
│
├── styles/                       # Estilos compartidos
│   └── globals.css               # Variables CSS, temas
│
├── .env.local                    # Variables de entorno (crear manualmente)
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
├── postcss.config.mjs            # Configuración de PostCSS
├── components.json               # Configuración de shadcn/ui
│
└── INTEGRATION.md                # Guía de integración con backend
```

### Principios de Organización

1. **Separación de Responsabilidades**: Cada archivo tiene una responsabilidad clara
2. **Colocalización**: Componentes relacionados están juntos
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Importabilidad**: Paths claros con alias (`@/` = raíz)

---

## 📦 Dependencias Principales

### Frontend Framework
| Paquete | Versión | Uso |
|---------|---------|-----|
| `next` | 16.0.10 | Framework React con SSR |
| `react` | 19.2.0 | Librería de UI |
| `react-dom` | 19.2.0 | Rendering en DOM |
| `typescript` | ^5 | Type checking |

### UI Components
| Paquete | Versión | Uso |
|---------|---------|-----|
| `@radix-ui/*` | ~1.2.x | 30+ componentes accesibles |
| `tailwindcss` | ^4.1.9 | Utilidad CSS |
| `lucide-react` | ^0.454.0 | 500+ íconos |
| `clsx` | ^2.1.1 | Clases condicionales |
| `tailwind-merge` | ^3.3.1 | Merge de clases Tailwind |

### Gráficos
| Paquete | Versión | Uso |
|---------|---------|-----|
| `recharts` | 2.15.4 | Gráficos interactivos |

### Formularios
| Paquete | Versión | Uso |
|---------|---------|-----|
| `react-hook-form` | ^7.60.0 | Gestión de formularios |
| `@hookform/resolvers` | ^3.10.0 | Validación con Zod/Yup |
| `zod` | 3.25.76 | Validación en runtime |

### Persistencia & Almacenamiento
| Paquete | Versión | Uso |
|---------|---------|-----|
| `embla-carousel-react` | 8.5.1 | Carruseles |
| `react-resizable-panels` | ^2.1.7 | Paneles redimensionables |

### Temas & Utilidades
| Paquete | Versión | Uso |
|---------|---------|-----|
| `next-themes` | ^0.4.6 | Temas oscuro/claro |
| `sonner` | ^1.7.4 | Toast notifications |
| `date-fns` | 4.1.0 | Manipulación de fechas |

### Dev Dependencies
```json
{
  "@tailwindcss/postcss": "^4.1.9",  // PostCSS plugin
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "postcss": "^8.5",
  "tailwindcss": "^4.1.9"
}
```

### Instalación de Nuevas Dependencias

```bash
# Instalar un paquete
npm install nombre-paquete

# Instalar dev dependency
npm install --save-dev nombre-paquete

# Instalar versión específica
npm install nombre-paquete@1.2.3
```

---

## 🔍 Detalles de Implementación Clave

### Tipos Principales

```typescript
// Definido en lib/mock-data.ts
interface AnalysisCard {
  id: string
  title: string
  chartType: 'bar' | 'line' | 'pie' | 'scatter'
  description: string
  insight: string
  data: ChartData[]
}

interface ChartData {
  labels?: string[]
  values?: number[]
  data?: Array<{ name: string; value: number }>
}
```

### Flujo de Transformación

```typescript
// 1. Backend responde con:
interface ChartRecommendation {
  title: string
  chart_type: string
  parameters: { x_axis: string; y_axis?: string }
  insight: string
}

// 2. Frontend transforma a:
interface AnalysisCard {
  id: string
  title: string
  chartType: string
  description: string
  insight: string
  data: ChartData[]
}
```

### LocalStorage Schema

```typescript
// Clave: 'dashboardCharts'
// Valor: JSON.stringify(AnalysisCard[])

{
  "dashboardCharts": [
    {
      "id": "rec-0-1234567890",
      "title": "Ventas por Región",
      "chartType": "bar",
      // ... resto de datos
    }
  ]
}
```

---

## 🚦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:8080

# Producción
npm run build        # Compila la aplicación
npm start            # Inicia servidor de producción

# Calidad de código
npm run lint         # Verifica errores con ESLint

# Node.js
node --version       # Verificar versión de Node
npm --version        # Verificar versión de npm
```

---

## 🐛 Troubleshooting

### El frontend no puede conectar con el backend

**Problema**: Error 404 o conexión rechazada al subir archivo

**Soluciones**:
1. Verifica que Flask esté corriendo en `http://localhost:5000`
2. Revisa `.env.local` tiene `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. Reinicia ambos servidores

### Los gráficos no se muestran

**Problema**: Datos vacíos o error en transformación

**Soluciones**:
1. Abre DevTools → Network → revisa respuesta del API
2. Verifica que el archivo CSV/Excel tiene datos válidos
3. Revisa que el backend retorna `recommendations` no vacío

### Dashboard no se persiste

**Problema**: Los gráficos desaparecen al refrescar

**Soluciones**:
1. Verifica que localStorage está habilitado
2. Abre DevTools → Application → localStorage
3. Revisa que la clave `dashboardCharts` existe

### Errores de compilación TypeScript

**Problema**: `npm run build` falla

**Soluciones**:
```bash
# Limpiar node_modules y reinstalar
rm -r node_modules package-lock.json
npm install

# Verificar tipos
npx tsc --noEmit
```

---

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Recharts](https://recharts.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Integración con Backend](./INTEGRATION.md)

---

## 📝 Notas de Desarrollo

### Convenciones de Código

- **Componentes**: PascalCase (e.g., `FileUploadZone`)
- **Funciones**: camelCase (e.g., `transformRecommendationToCard`)
- **Constantes**: UPPER_SNAKE_CASE (e.g., `ALLOWED_TYPES`)
- **Archivos**: kebab-case (e.g., `file-upload-zone.tsx`)

### TypeScript Strict Mode

El proyecto usa `strict: true` en `tsconfig.json`:
- Tipos explícitos requeridos
- No se permiten valores `any` implícitos
- Null/undefined handling requerido

### Performance Optimization

- React.memo en componentes que no cambian
- useCallback para event handlers
- Lazy loading de componentes pesados (opcional)

---

## 📄 Licencia

Este proyecto es parte de una prueba técnica.

---

## 👨‍💻 Autor

Desarrollado como una solución completa de análisis de datos con visualización automática.

**Última actualización**: Enero 2026

---

## 🤝 Contribuir

Para contribuir al proyecto:

1. Crea una rama feature (`git checkout -b feature/tu-feature`)
2. Commit tus cambios (`git commit -am 'Agrega feature'`)
3. Push a la rama (`git push origin feature/tu-feature`)
4. Abre un Pull Request

**Estándares**:
- Código debe pasar `npm run lint`
- Tipos TypeScript correctos
- Componentes accesibles (ARIA)
- Responsive design

---

## ❓ Preguntas Frecuentes

### ¿Necesito el backend para desarrollar?

Parcialmente. Puedes ver la UI sin el backend, pero no podrás subir archivos. Para desarrollo completo, necesitas ambos.

### ¿Cuáles son los formatos de archivo soportados?

- CSV (.csv)
- Excel (.xlsx, .xls)

Otros formatos generarán un error de validación.

### ¿Dónde se guardan los gráficos?

En `localStorage` del navegador bajo la clave `dashboardCharts`. Borrar cookies/datos del navegador los eliminará.

### ¿Puedo usar esto en producción?

Sí, después de:
1. Configurar variables de entorno correctas
2. Ejecutar `npm run build`
3. Deployar con `npm start`
4. Considerar CDN para activos estáticos

### ¿Cómo agregar un nuevo gráfico tipo?

1. Actualizar enum en `lib/mock-data.ts`
2. Agregar case en transformador (`lib/data-transform.ts`)
3. Crear componente en `components/ui/chart.tsx`
4. Actualizar backend para soportar el tipo

---

**¡Gracias por usar File Upload App!** 🎉
