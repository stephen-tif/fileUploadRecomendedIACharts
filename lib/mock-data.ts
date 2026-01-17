export interface AnalysisCard {
  id: string
  title: string
  description: string
  chartType: "bar" | "line" | "pie" | "area"
  insight: string
  data: Array<{ name: string; value: number; secondary?: number }>
}

export const mockAnalysisResults: AnalysisCard[] = [
  {
    id: "1",
    title: "Distribución de Ventas por Región",
    description: "Análisis comparativo del rendimiento de ventas en diferentes regiones geográficas.",
    chartType: "bar",
    insight: "La región 'Norte' lidera con un 35% del total de ventas, seguida por 'Centro' con 28%.",
    data: [
      { name: "Norte", value: 4500 },
      { name: "Sur", value: 2800 },
      { name: "Centro", value: 3600 },
      { name: "Este", value: 2100 },
      { name: "Oeste", value: 1900 },
    ],
  },
  {
    id: "2",
    title: "Tendencia de Ingresos Mensual",
    description: "Evolución de los ingresos a lo largo del tiempo con proyección de crecimiento.",
    chartType: "line",
    insight: "Se observa una tendencia alcista del 15% mensual, con pico máximo en noviembre.",
    data: [
      { name: "Ene", value: 12000 },
      { name: "Feb", value: 15000 },
      { name: "Mar", value: 18000 },
      { name: "Abr", value: 16000 },
      { name: "May", value: 21000 },
      { name: "Jun", value: 24000 },
    ],
  },
  {
    id: "3",
    title: "Composición de Gastos",
    description: "Desglose porcentual de las principales categorías de gastos operativos.",
    chartType: "pie",
    insight: "Los gastos de personal representan el 45% del presupuesto total, siendo el mayor rubro.",
    data: [
      { name: "Personal", value: 45 },
      { name: "Operaciones", value: 25 },
      { name: "Marketing", value: 15 },
      { name: "Tecnología", value: 10 },
      { name: "Otros", value: 5 },
    ],
  },
  {
    id: "4",
    title: "Rendimiento por Producto",
    description: "Comparativa de ventas vs objetivo por línea de producto.",
    chartType: "area",
    insight: "El producto 'Premium' supera el objetivo en un 22%, mientras que 'Básico' está 8% por debajo.",
    data: [
      { name: "Básico", value: 3200, secondary: 3500 },
      { name: "Estándar", value: 4800, secondary: 4500 },
      { name: "Premium", value: 5500, secondary: 4500 },
      { name: "Enterprise", value: 7200, secondary: 7000 },
    ],
  },
]

export const initialDashboardCharts: AnalysisCard[] = [
  {
    id: "initial-1",
    title: "Resumen de Ventas Totales",
    description: "Vista general del rendimiento de ventas por categoría.",
    chartType: "bar",
    insight: "Las ventas de tecnología lideran el mercado con un crecimiento del 23%.",
    data: [
      { name: "Tecnología", value: 8500 },
      { name: "Ropa", value: 5200 },
      { name: "Hogar", value: 4100 },
      { name: "Alimentos", value: 6800 },
    ],
  },
  {
    id: "initial-2",
    title: "Tráfico de Usuarios",
    description: "Evolución del tráfico web durante la última semana.",
    chartType: "line",
    insight: "El pico de visitas ocurre los martes y jueves, ideal para campañas.",
    data: [
      { name: "Lun", value: 2400 },
      { name: "Mar", value: 4200 },
      { name: "Mié", value: 3100 },
      { name: "Jue", value: 4800 },
      { name: "Vie", value: 3600 },
      { name: "Sáb", value: 2100 },
      { name: "Dom", value: 1800 },
    ],
  },
  {
    id: "initial-3",
    title: "Distribución de Clientes",
    description: "Segmentación de clientes por tipo de suscripción.",
    chartType: "pie",
    insight: "El 40% son clientes premium, representando el 70% de los ingresos.",
    data: [
      { name: "Premium", value: 40 },
      { name: "Estándar", value: 35 },
      { name: "Básico", value: 25 },
    ],
  },
]
