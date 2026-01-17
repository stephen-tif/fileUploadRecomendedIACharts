# Integración Frontend-Backend

Este documento explica cómo el frontend React se conecta con el backend Flask.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto `file-upload-app`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Importante:** En Next.js, las variables de entorno que se usan en el cliente deben comenzar con `NEXT_PUBLIC_`.

### 2. Iniciar el Backend Flask

Primero, asegúrate de que el backend Flask esté corriendo:

```bash
cd RecomendedChartWS
.\venv\Scripts\activate  # Windows
# o
source venv/bin/activate  # Linux/Mac

python run.py
```

El backend debería estar disponible en `http://localhost:5000`

### 3. Iniciar el Frontend React

En otra terminal:

```bash
cd file-upload-app
npm install  # Solo la primera vez
npm run dev
```

El frontend debería estar disponible en `http://localhost:3000`

## Flujo de Integración

### 1. Subir Archivo

Cuando el usuario sube un archivo:

1. El componente `FileUploadZone` captura el archivo
2. `handleUpload` en `page.tsx` llama a `uploadFile()` de `lib/api.ts`
3. Se hace un `POST` a `http://localhost:5000/api/upload` con el archivo
4. El backend procesa el archivo, genera recomendaciones y devuelve:
   - `file_info`: Información del archivo subido
   - `recommendations`: Array de recomendaciones de gráficos
   - `data_summary`: Resumen de los datos

### 2. Mostrar Recomendaciones

Las recomendaciones se transforman usando `transformRecommendationToCard()`:
- Se convierten al formato `AnalysisCard` que usa el frontend
- Se muestran en el `AnalysisSidebar`
- **Nota:** En este punto, las tarjetas NO tienen datos aún, solo metadatos

### 3. Agregar Gráfico al Dashboard

Cuando el usuario hace clic en "Agregar al Dashboard":

1. Se llama a `handleAddToDashboard()`
2. Se verifica si la tarjeta ya tiene datos
3. Si no tiene datos:
   - Se llama a `enrichCardWithData()` que hace `POST` a `/api/chart/data`
   - Se obtienen los datos agregados del backend
   - Se transforman con `transformChartDataToCardData()`
   - Se agrega la tarjeta completa al dashboard

## Transformación de Datos

### API Response → Frontend Format

**Recomendación del API:**
```typescript
{
  title: "Sales by Region",
  chart_type: "bar",
  parameters: { x_axis: "Region", y_axis: "Sales" },
  insight: "This visualization reveals..."
}
```

**Frontend AnalysisCard:**
```typescript
{
  id: "rec-0-1234567890",
  title: "Sales by Region",
  chartType: "bar",
  description: "bar chart showing Region vs Sales",
  insight: "This visualization reveals...",
  data: [{ name: "North", value: 1000 }, ...]
}
```

### Mapeo de Tipos de Gráficos

| API (Backend) | Frontend (React) |
|--------------|------------------|
| `bar`        | `bar`            |
| `line`       | `line`           |
| `pie`        | `pie`            |
| `scatter`    | `area`           |

**Nota:** Los gráficos `scatter` del backend se mapean a `area` en el frontend porque Recharts maneja mejor los gráficos de área.

## Estructura de Archivos

```
file-upload-app/
├── lib/
│   ├── api.ts              # Servicio API - funciones fetch al backend
│   ├── data-transform.ts   # Transformación API → Frontend
│   └── mock-data.ts        # Tipos y datos iniciales (legacy)
├── app/
│   └── page.tsx            # Componente principal - orquesta todo
└── components/
    ├── analysis-sidebar.tsx    # Muestra recomendaciones
    └── dashboard-grid.tsx      # Muestra gráficos en el dashboard
```

## Endpoints Consumidos

### POST /api/upload
- **Función:** `uploadFile(file: File)`
- **Uso:** Subir archivo y obtener recomendaciones
- **Response:** `UploadResponse`

### POST /api/chart/data
- **Función:** `getChartData(filepath, chartType, parameters, aggregation)`
- **Uso:** Obtener datos agregados para un gráfico específico
- **Response:** `ChartDataResponse`

### GET /health
- **Función:** `checkHealth()`
- **Uso:** Verificar que el backend esté disponible
- **Response:** `{ status: "healthy" }`

## Manejo de Errores

El frontend maneja errores en:

1. **Upload:** Si falla, muestra un mensaje de error y vuelve al estado `upload`
2. **Chart Data:** Si falla al obtener datos, la tarjeta se agrega con datos vacíos (se puede mejorar)
3. **Network:** Los errores de red se capturan con try/catch y se muestran al usuario

## Próximas Mejoras

- [ ] Carga optimista: Agregar tarjeta inmediatamente y cargar datos después
- [ ] Caché de datos: Guardar datos de gráficos ya cargados
- [ ] Retry logic: Reintentar automáticamente en caso de error
- [ ] Loading states: Mostrar spinners mientras se cargan los datos
- [ ] Error boundaries: Mejor manejo de errores con React Error Boundaries
