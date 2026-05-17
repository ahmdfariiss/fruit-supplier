'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Scale,
  Fan,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

// Mock data
const mockData = {
  apel: {
    suhu: 4.5,
    kelembapan: 85.2,
    gas: 120, // ppm ekuivalen
    berat: 5400, // gram
    kualitas: 92, // %
    sisaUmur: 14, // hari
    statusKualitas: 'baik' as const,
    coolingFan: { on: true, mode: 'auto' as const },
    exhaustFan: { on: false, mode: 'auto' as const },
  },
  pisang: {
    suhu: 14.2,
    kelembapan: 88.5,
    gas: 310,
    berat: 4250,
    kualitas: 75,
    sisaUmur: 5,
    statusKualitas: 'sedang' as const,
    coolingFan: { on: false, mode: 'auto' as const },
    exhaustFan: { on: true, mode: 'auto' as const },
  },
};

export default function MonitoringPage() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [historyApel, setHistoryApel] = useState<any[]>(Array.from({length: 10}, (_, i) => ({ time: `-${10-i}s`, suhu: mockData.apel.suhu, hum: mockData.apel.kelembapan, gas: mockData.apel.gas })));
  const [historyPisang, setHistoryPisang] = useState<any[]>(Array.from({length: 10}, (_, i) => ({ time: `-${10-i}s`, suhu: mockData.pisang.suhu, hum: mockData.pisang.kelembapan, gas: mockData.pisang.gas })));

  // Fetch telemetry secara berkala (Polling)
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/iot/telemetry/latest`,
        );
        const json = await res.json();

        if (json.success && json.data) {
          const { apel, pisang } = json.data;

          const now = new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

          setHistoryApel((prev) => {
            const h = [...prev, { time: now, suhu: apel?.tempC ?? apel?.temperatureC ?? prev[prev.length - 1].suhu, hum: apel?.humPct ?? apel?.humidityPct ?? prev[prev.length - 1].hum, gas: apel?.gasPpm ?? apel?.gasValue ?? prev[prev.length - 1].gas }];
            return h.slice(-10);
          });
          setHistoryPisang((prev) => {
            const h = [...prev, { time: now, suhu: pisang?.tempC ?? pisang?.temperatureC ?? prev[prev.length - 1].suhu, hum: pisang?.humPct ?? pisang?.humidityPct ?? prev[prev.length - 1].hum, gas: pisang?.gasPpm ?? pisang?.gasValue ?? prev[prev.length - 1].gas }];
            return h.slice(-10);
          });

          setData((prev) => ({
            ...prev,
            apel: {
              ...prev.apel,
              suhu: apel?.tempC ?? apel?.temperatureC ?? prev.apel.suhu,
              kelembapan:
                apel?.humPct ?? apel?.humidityPct ?? prev.apel.kelembapan,
              gas: apel?.gasPpm ?? apel?.gasValue ?? prev.apel.gas,
              berat: apel?.weightGram ?? prev.apel.berat,
              coolingFan: {
                on: apel?.coolingFanOn ?? prev.apel.coolingFan.on,
                mode: apel?.fanMode ?? prev.apel.coolingFan.mode,
              },
              exhaustFan: {
                on: apel?.exhaustFanOn ?? prev.apel.exhaustFan.on,
                mode: apel?.fanMode ?? prev.apel.exhaustFan.mode,
              },
            },
            pisang: {
              ...prev.pisang,
              suhu: pisang?.tempC ?? pisang?.temperatureC ?? prev.pisang.suhu,
              kelembapan:
                pisang?.humPct ?? pisang?.humidityPct ?? prev.pisang.kelembapan,
              gas: pisang?.gasPpm ?? pisang?.gasValue ?? prev.pisang.gas,
              berat: pisang?.weightGram ?? prev.pisang.berat,
              coolingFan: {
                on: pisang?.coolingFanOn ?? prev.pisang.coolingFan.on,
                mode: pisang?.fanMode ?? prev.pisang.coolingFan.mode,
              },
              exhaustFan: {
                on: pisang?.exhaustFanOn ?? prev.pisang.exhaustFan.on,
                mode: pisang?.fanMode ?? prev.pisang.exhaustFan.mode,
              },
            },
          }));
        }
      } catch (error) {
        console.error('Gagal mengambil data dari BE:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); // Poll setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  const toggleFan = async (
    fruit: 'apel' | 'pisang',
    fanType: 'coolingFan' | 'exhaustFan',
    key: 'on' | 'mode',
  ) => {
    // 1. Optimistic Update UI
    setData((prev) => {
      const current = prev[fruit][fanType];
      return {
        ...prev,
        [fruit]: {
          ...prev[fruit],
          [fanType]: {
            ...current,
            [key]:
              key === 'mode'
                ? current.mode === 'auto'
                  ? 'manual'
                  : 'auto'
                : !current.on,
          },
        },
      };
    });

    // 2. Kirim update state control ke Backend REST API
    try {
      const deviceId = fruit === 'pisang' ? 'ESP32-PISANG-01' : 'ESP32-APEL-01';
      const currentData = data[fruit];

      const newMode =
        key === 'mode'
          ? currentData[fanType].mode === 'auto'
            ? 'manual'
            : 'auto'
          : currentData[fanType].mode;
      const newOn =
        key === 'on' ? !currentData[fanType].on : currentData[fanType].on;

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/iot/control/${deviceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fanMode: newMode,
            [fanType === 'coolingFan' ? 'coolingFanOn' : 'exhaustFanOn']: newOn,
          }),
        },
      );
    } catch (err) {
      console.error('Gagal mengirim perintah ke hardware', err);
    }
  };

  const getStatusColor = (kualitas: string) => {
    if (kualitas === 'baik') return 'text-g1 bg-g6 border-g4/50';
    if (kualitas === 'sedang') return 'text-gold bg-gold/10 border-gold/30';
    return 'text-red bg-red/10 border-red/30';
  };

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    unit,
    alert = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: number;
    unit: string;
    alert?: boolean;
  }) => (
    <div
      className={`p-4 rounded-xl border ${alert ? 'border-red/30 bg-red/5' : 'border-black/5 bg-white'} shadow-sm flex items-center gap-4 transition-all hover:bg-g6/30`}
    >
      <div
        className={`p-3 rounded-xl ${alert ? 'bg-red/10 text-red' : 'bg-g6 text-g1 border border-g5'}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[0.75rem] text-muted font-bold tracking-wide uppercase">
          {label}
        </p>
        <p className="text-xl font-extrabold text-ink flex items-baseline gap-1">
          {value}{' '}
          <span className="text-sm font-semibold text-muted lowercase">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );

  const FruitSection = ({
    title,
    fruitType,
    stats,
    history,
  }: {
    title: string;
    fruitType: 'apel' | 'pisang';
    stats: typeof mockData.apel | typeof mockData.pisang;
    history: any[];
  }) => (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-black/5 bg-white shadow-kpi h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-ink flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${fruitType === 'apel' ? 'bg-red/5 text-red border-red/10' : 'bg-gold/5 text-gold border-gold/10'}`}
          >
            {fruitType === 'apel' ? '🍎' : '🍌'}
          </div>
          {title}
        </h2>
        <div
          className={`px-3 py-1.5 rounded-full border text-[0.7rem] font-extrabold uppercase flex items-center gap-1.5 tracking-wide ${getStatusColor(stats.statusKualitas)}`}
        >
          {stats.statusKualitas === 'baik' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          STATUS: {stats.statusKualitas}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={Thermometer}
          label="Suhu"
          value={stats.suhu}
          unit="°C"
        />
        <MetricCard
          icon={Droplets}
          label="Kelembapan"
          value={stats.kelembapan}
          unit="%"
        />
        <MetricCard
          icon={Wind}
          label="Gas (MQ135)"
          value={stats.gas}
          unit="ppm"
          alert={stats.gas > 200}
        />
        <MetricCard icon={Scale} label="Berat" value={stats.berat} unit="g" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-auto">
        {/* ML Predictions */}
        <div className="p-4 rounded-xl border border-blue/10 bg-blue/5">
          <div className="flex items-center gap-2 mb-4 text-blue">
            <Activity className="w-4 h-4" />
            <h3 className="font-bold text-[0.75rem] tracking-wide uppercase">
              AI Predictions
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[0.75rem] mb-1.5 text-muted font-bold">
                <span>Skor Kualitas Udara</span>
                <span
                  className={`font-extrabold ${stats.kualitas > 80 ? 'text-g1' : stats.kualitas > 60 ? 'text-gold' : 'text-red'}`}
                >
                  {stats.kualitas}%
                </span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stats.kualitas > 80 ? 'bg-g3' : stats.kualitas > 60 ? 'bg-gold' : 'bg-red'}`}
                  style={{ width: `${stats.kualitas}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-3 border-t border-blue/10 flex justify-between items-center">
              <span className="text-[0.75rem] font-bold text-muted uppercase tracking-wide">
                Est. Tahan Simpan
              </span>
              <span className="font-extrabold text-lg text-ink">
                {stats.sisaUmur} Hari
              </span>
            </div>
          </div>
        </div>

        {/* Actuators Control */}
        <div className="p-4 rounded-xl border border-black/5 bg-[#faf8f3]">
          <div className="flex items-center gap-2 mb-4 text-gold">
            <Zap className="w-4 h-4" />
            <h3 className="font-bold text-[0.75rem] tracking-wide uppercase">
              Fan Control
            </h3>
          </div>

          <div className="space-y-3">
            {/* Cooling Fan */}
            <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-3">
                <Fan
                  className={`w-4 h-4 ${stats.coolingFan.on ? 'text-blue animate-spin-slow' : 'text-muted/40'}`}
                />
                <div className="flex-1">
                  <p className="text-[0.8rem] font-extrabold text-ink leading-none">
                    Cooling Fan
                  </p>
                  <p className="text-[0.6rem] text-muted font-bold tracking-wider uppercase mt-1">
                    {stats.coolingFan.mode} MODE
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggleFan(fruitType, 'coolingFan', 'mode')}
                  className={`flex-1 py-1.5 text-[0.65rem] rounded-md font-extrabold border transition-colors ${stats.coolingFan.mode === 'auto' ? 'bg-g4/20 text-g1 border-g4/50' : 'bg-white text-muted border-black/10'}`}
                >
                  {stats.coolingFan.mode === 'auto' ? 'AUTO' : 'MANUAL'}
                </button>
                <button
                  disabled={stats.coolingFan.mode === 'auto'}
                  onClick={() => toggleFan(fruitType, 'coolingFan', 'on')}
                  className={`flex-1 py-1.5 text-[0.65rem] rounded-md font-extrabold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${stats.coolingFan.on ? 'bg-g1 text-white border-g1' : 'bg-white text-muted border-black/10 hover:bg-black/5'}`}
                >
                  {stats.coolingFan.on ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Exhaust Fan */}
            <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-3">
                <Wind
                  className={`w-4 h-4 ${stats.exhaustFan.on ? 'text-red animate-pulse' : 'text-muted/40'}`}
                />
                <div className="flex-1">
                  <p className="text-[0.8rem] font-extrabold text-ink leading-none">
                    Exhaust Fan
                  </p>
                  <p className="text-[0.6rem] text-muted font-bold tracking-wider uppercase mt-1">
                    {stats.exhaustFan.mode} MODE
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggleFan(fruitType, 'exhaustFan', 'mode')}
                  className={`flex-1 py-1.5 text-[0.65rem] rounded-md font-extrabold border transition-colors ${stats.exhaustFan.mode === 'auto' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-white text-muted border-black/10'}`}
                >
                  {stats.exhaustFan.mode === 'auto' ? 'AUTO' : 'MANUAL'}
                </button>
                <button
                  disabled={stats.exhaustFan.mode === 'auto'}
                  onClick={() => toggleFan(fruitType, 'exhaustFan', 'on')}
                  className={`flex-1 py-1.5 text-[0.65rem] rounded-md font-extrabold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${stats.exhaustFan.on ? 'bg-g1 text-white border-g1' : 'bg-white text-muted border-black/10 hover:bg-black/5'}`}
                >
                  {stats.exhaustFan.on ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div className="p-4 rounded-xl border border-black/5 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[0.8rem] tracking-wide uppercase mb-4 text-ink">Suhu & Kelembapan</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
                    <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                    <Line yAxisId="left" type="monotone" dataKey="suhu" stroke="#E11D48" strokeWidth={2} dot={false} name="Suhu (°C)" />
                    <Line yAxisId="right" type="monotone" dataKey="hum" stroke="#3B82F6" strokeWidth={2} dot={false} name="Kelembapan (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[0.8rem] tracking-wide uppercase mb-4 text-ink">Kadar Gas (MQ135)</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                    <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} width={35} />
                    <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                    <Line type="monotone" dataKey="gas" stroke="#F59E0B" strokeWidth={2} dot={false} name="Gas (ppm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-black/5 bg-white shadow-sm overflow-x-auto">
          <h3 className="font-bold text-[0.8rem] tracking-wide uppercase mb-3 text-ink">Log Pembaruan (10 Terakhir)</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-black/5">
                <th className="pb-2">Waktu</th>
                <th className="pb-2">Suhu</th>
                <th className="pb-2">Kelembapan</th>
                <th className="pb-2">Gas</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((row, i) => (
                <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors">
                  <td className="py-2 text-ink font-medium">{row.time}</td>
                  <td className="py-2 text-red font-medium">{row.suhu}°C</td>
                  <td className="py-2 text-blue font-medium">{row.hum}%</td>
                  <td className="py-2 text-gold font-medium">{row.gas} ppm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-5 rounded-2xl border border-black/5 shadow-sm">
        <div>
          <h1 className="text-[1.35rem] font-extrabold text-ink tracking-tight">
            Monitoring Sensor & AI
          </h1>
          <p className="text-[0.82rem] font-medium text-muted mt-0.5">
            Real-time status kualitas dan umur simpan kompartimen berdasar
            telemetri suhu
          </p>
        </div>
        <div className="flex items-center gap-2 text-[0.75rem] font-extrabold text-g1 bg-g6 px-4 py-2 rounded-xl border border-g4/30 whitespace-nowrap">
          <div
            className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-gold animate-pulse' : 'bg-g2 animate-pulse'}`}
          />
          {loading ? 'MENYAMBUNGKAN...' : 'SISTEM AKTIF'}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <FruitSection
          title="Kompartimen Apel"
          fruitType="apel"
          stats={data.apel}
          history={historyApel}
        />
        <FruitSection
          title="Kompartimen Pisang"
          fruitType="pisang"
          stats={data.pisang}
          history={historyPisang}
        />
      </div>

      {/* Recommended Actions Panel */}
      <div className="p-6 rounded-2xl border border-black/5 bg-white shadow-sm">
        <h2 className="text-[1.05rem] font-extrabold mb-5 flex items-center gap-2.5 text-ink">
          <Activity className="w-5 h-5 text-blue" />
          Insights & Rekomendasi
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-red/5 border border-red/10 text-red flex items-start gap-4">
            <div className="bg-red/10 p-2 rounded-lg mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-[0.85rem]">
                Peringatan: Gas Etilen Pisang Tinggi (310 ppm)
              </p>
              <p className="text-[0.8rem] mt-1.5 font-medium text-ink/70 leading-relaxed">
                Sistem otomatis menyalakan Exhaust Fan untuk membuang gas
                etilen. Pematangan terdeteksi lebih cepat dari ekspektasi.{' '}
                <span className="font-bold text-ink">
                  Saran: Distribusikan dalam 5 hari.
                </span>
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-g6 border border-g5 text-g1 flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg mt-0.5 border border-g5 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-[0.85rem]">
                Kompartimen Apel Optimal (Skor AI: 92%)
              </p>
              <p className="text-[0.8rem] mt-1.5 font-medium text-ink/70 leading-relaxed">
                Suhu stabil di 4.5°C dengan kelembapan 85.2%. Model memprediksi
                apel aman untuk disimpan hingga 14 hari ke depan dengan
                efisiensi Cooling Fan optimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4"></div>
    </div>
  );
}
