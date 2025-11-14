// import { useEffect, useRef } from 'react';
// import { Chart } from 'chart.js/auto';
// export default function ChartWrapper({ type = 'bar', data, options = {}, className }) {
//   const canvasRef = useRef(null);
//   const instanceRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // If an old chart exists on this canvas, destroy it first
//     try {
//       const existing = Chart.getChart(canvas);
//       if (existing) existing.destroy();
//     } catch (e) {
//       // ignore
//     }

//     // create a new chart instance
//     try {
//       instanceRef.current = new Chart(canvas, { type, data, options });
//     } catch (err) {
//       console.error('Failed to create chart', err);
//     }

//     return () => {
//       try { if (instanceRef.current) instanceRef.current.destroy(); } catch {}
//       instanceRef.current = null;
//     };
//   }, [type, data, options]);

//   return <canvas ref={canvasRef} className={className} />;
// }
//new code 


import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function ChartWrapper({ type = 'bar', data, options = {}, className }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    // Destroy previous chart before creating new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, { type, data, options });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data]); // Recreate chart when data changes

  return (
    <canvas
      ref={canvasRef}
      className={className}
      key={JSON.stringify(data?.datasets ?? [])}
    />
  );
}
