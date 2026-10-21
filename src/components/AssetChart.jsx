import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

/**
 * AssetChart – real 7-day sparkline chart via lightweight-charts v5.
 *
 * Props:
 *   title        – asset name   (e.g. "Bitcoin")
 *   symbol       – ticker       (e.g. "BTC")
 *   theme        – 'light' | 'dark'
 *   sparklineData – number[]  (168 hourly prices from CoinGecko markets call)
 */
export default function AssetChart({ title, symbol, theme, sparklineData }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [changePercent, setChangePercent] = useState(null);
  const [status, setStatus] = useState('waiting'); // 'waiting' | 'ok' | 'error'

  // Build chart once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const textColor = '#93c5fd';
    const gridColor = 'rgba(255,255,255,0.06)';

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 150,
      layout: {
        background: { type: 'Solid', color: 'transparent' },
        textColor,
        fontSize: 11,
        fontFamily: "'DM Sans', sans-serif",
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)', textColor },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        textColor,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: false,
      handleScroll: false,
    });

    chartRef.current = chart;
    seriesRef.current = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastValueVisible: true,
      priceLineVisible: false,
    });

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Feed data whenever sparklineData arrives or changes
  useEffect(() => {
    if (!sparklineData || !sparklineData.length || !seriesRef.current) return;

    try {
      // CoinGecko sparkline gives ~168 hourly prices.
      // Generate timestamps: now - 168h, now - 167h, …
      const now = Math.floor(Date.now() / 1000);
      const HOUR = 3600;
      const count = sparklineData.length;

      const chartData = sparklineData.map((price, i) => ({
        time: now - (count - 1 - i) * HOUR,
        value: parseFloat(price.toFixed(8)),
      }));

      seriesRef.current.setData(chartData);
      chartRef.current?.timeScale().fitContent();

      // 7-day % change
      const first = chartData[0].value;
      const last = chartData[chartData.length - 1].value;
      const pct = ((last - first) / first) * 100;
      setChangePercent(pct);

      // Green if up, red if down
      seriesRef.current.applyOptions({
        color: last >= first ? '#22c55e' : '#ef4444',
      });

      setStatus('ok');
    } catch (e) {
      console.warn('AssetChart render error:', e);
      setStatus('error');
    }
  }, [sparklineData]);

  return (
    <div className="asset-chart">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>{title}</span>
          <span style={{
            fontSize: 11, color: '#60a5fa', fontWeight: 700,
            background: 'rgba(96,165,250,0.15)', borderRadius: 6, padding: '2px 7px',
          }}>{symbol}</span>
        </div>
        {changePercent !== null ? (
          <span style={{
            fontSize: 12, fontWeight: 800,
            color: changePercent >= 0 ? '#22c55e' : '#ef4444',
          }}>
            {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
            <span style={{ color: '#60a5fa', fontWeight: 400, marginLeft: 4 }}>7d</span>
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#60a5fa' }}>7d chart</span>
        )}
      </div>

      {/* Chart area with loading / error overlay */}
      <div style={{ position: 'relative' }}>
        <div
          ref={containerRef}
          style={{ opacity: status === 'ok' ? 1 : 0.25, transition: 'opacity .4s' }}
        />
        {status !== 'ok' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: status === 'error' ? '#f87171' : '#60a5fa',
          }}>
            {status === 'error' ? 'Chart data unavailable' : 'Loading chart…'}
          </div>
        )}
      </div>
    </div>
  );
}
