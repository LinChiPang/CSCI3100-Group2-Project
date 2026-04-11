import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAnalytics, type AnalyticsData } from "../services/api";
import Navbar from "../components/Navbar";

const CHART_W = 600;
const CHART_H = 160;
const PAD = { top: 16, right: 16, bottom: 32, left: 48 };

function LineChart({
  labels,
  values,
  color,
  formatValue,
}: {
  labels: string[];
  values: number[];
  color: string;
  formatValue?: (v: number) => string;
}) {
  if (labels.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">No data yet.</p>;
  }

  const fmt = formatValue ?? ((v: number) => String(v));
  const safeValues = values.map((v) => (typeof v === "number" && isFinite(v) ? v : 0));
  const max = Math.max(...safeValues, 1);
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const toX = (i: number) =>
    PAD.left + (labels.length === 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW);
  const toY = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const points = labels.map((_, i) => `${toX(i)},${toY(safeValues[i])}`).join(" ");

  // y-axis ticks (0, mid, max)
  const yTicks = [0, max / 2, max];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ minWidth: 300, maxHeight: 200 }}
      >
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={CHART_W - PAD.right}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={toY(tick) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#9ca3af"
            >
              {fmt(Math.round(tick))}
            </text>
          </g>
        ))}

        {/* Shaded area under line */}
        <polygon
          points={`${toX(0)},${PAD.top + innerH} ${points} ${toX(labels.length - 1)},${PAD.top + innerH}`}
          fill={color}
          fillOpacity={0.1}
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points + tooltips */}
        {labels.map((label, i) => (
          <g key={`${label}-${i}`}>
            <circle cx={toX(i)} cy={toY(safeValues[i])} r={4} fill={color} />
            <title>{`${label}: ${fmt(safeValues[i])}`}</title>
            {/* X-axis label */}
            <text
              x={toX(i)}
              y={CHART_H - 6}
              textAnchor="middle"
              fontSize={9}
              fill="#9ca3af"
            >
              {label.slice(5)} {/* MM-DD */}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  // Determine back destination: came from a community page or fall back to "/"
  const backTo = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (loading) return; // wait until auth is restored from localStorage
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    getAnalytics()
      .then(setData)
      .catch((err: unknown) => {
        const msg =
          typeof err === "object" && err !== null && "response" in err
            ? ((err as { response?: { data?: { error?: string } } }).response?.data?.error ?? "Failed to load analytics.")
            : "Failed to load analytics.";
        setError(msg);
      });
  }, [user, loading, navigate]);

  // While auth is being restored, show nothing to avoid flash-redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-8 text-gray-500">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-8 text-red-600">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-8 text-gray-500">Loading analytics…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p className="text-sm text-gray-600">
        Showing data for <span className="font-medium text-gray-900">{data.community_name}</span>{" "}
        <span className="text-gray-400">({data.community_slug})</span>
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p className="text-4xl font-bold text-blue-600">{data.total_transactions}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total GMV</p>
          <p className="text-4xl font-bold text-green-600">
            HK${data.total_gmv_hkd.toLocaleString("en-HK", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Daily transaction count line chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Transactions</h2>
        <LineChart
          labels={data.daily_labels}
          values={data.daily_counts}
          color="#3b82f6"
        />
      </div>

      {/* Daily GMV line chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Daily GMV (HKD)</h2>
        <LineChart
          labels={data.daily_labels}
          values={data.daily_gmv_hkd}
          color="#22c55e"
          formatValue={(v) => `$${v}`}
        />
      </div>

      {/* Recent transactions table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        {data.recent_transactions.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 text-center">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Item</th>
                  <th className="px-6 py-3 text-right">Amount (HKD)</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recent_transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{tx.item_name}</td>
                    <td className="px-6 py-3 text-right text-green-700 font-medium">
                      HK${tx.amount_hkd.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{tx.created_at}</td>
                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">{tx.provider_ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
