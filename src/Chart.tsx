import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

type DataPoint = {
  time: string;
  value: number;
};

const initialData: DataPoint[] = [
  { time: '2018-12-01', value: 32.51 },
  { time: '2018-12-02', value: 31.11 },
  { time: '2018-12-03', value: 27.02 },
  { time: '2018-12-04', value: 27.32 },
  { time: '2018-12-05', value: 25.17 },
  { time: '2018-12-06', value: 28.89 },
  { time: '2018-12-07', value: 25.46 },
  { time: '2018-12-08', value: 23.92 },
  { time: '2018-12-09', value: 22.68 },
  { time: '2018-12-10', value: 22.67 },
];

export const Chart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // Referencia al objeto de gráfico
  const lineSeriesRef = useRef<any>(null); // Referencia a la serie de líneas
  let counter = 0; // Variable para el contador

  const generateRandomData = () => {
    const newValue = Math.random() * 50; // Valor aleatorio entre 0 y 40
    const currentYear = 2018;
    const currentMonth = 12; // Diciembre
    const currentDay = 11 + counter; // Comenzar desde el día 11 y aumentar en cada iteración
    const currentTime = new Date(currentYear, currentMonth - 1, currentDay).toISOString().split('T')[0]; // Formato "yyyy-MM-dd"
    const newData = { time: currentTime, value: newValue };
    lineSeriesRef.current.update(newData); // Actualizar solo el nuevo dato
    counter++; // Incrementar el contador
  };

  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    chartRef.current = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      width: chartContainerRef.current!.clientWidth,
      height: 300,
    });

    chartRef.current.timeScale().fitContent(); // Ajustar la escala del tiempo automáticamente

    lineSeriesRef.current = chartRef.current.addLineSeries({
      color: '#2962FF',
    });

    lineSeriesRef.current.setData(initialData);

    // Simular la actualización de datos en tiempo real cada segundo
    const updateInterval = 1000; // 1 segundo
    const dataUpdater = setInterval(generateRandomData, updateInterval);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(dataUpdater);
      chartRef.current?.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default Chart;
