"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface PriceDataPoint {
  id: string;
  price: number;
  created_at: string;
}

interface PriceHistoryChartProps {
  data: PriceDataPoint[];
  targetPrice?: number | null;
  lowestPrice?: number | null;
}

export function PriceHistoryChart({
  data,
  targetPrice,
  lowestPrice,
}: PriceHistoryChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((point) => ({
        date: format(new Date(point.created_at), "MMM d"),
        fullDate: format(new Date(point.created_at), "MMM d, yyyy h:mm a"),
        price: point.price,
      }))
      .reverse(); // Show oldest to newest
  }, [data]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 100 };
    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1 || max * 0.1;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No price history yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-500">{data.fullDate}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${data.price.toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {targetPrice && (
            <ReferenceLine
              y={targetPrice}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: `Target: $${targetPrice}`,
                position: "right",
                fill: "#10b981",
                fontSize: 12,
              }}
            />
          )}
          {lowestPrice && (
            <ReferenceLine
              y={lowestPrice}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              label={{
                value: `Lowest: $${lowestPrice}`,
                position: "left",
                fill: "#3b82f6",
                fontSize: 12,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#059669" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
