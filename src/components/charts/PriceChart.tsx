import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CartesianChart, Line, Area, useChartPressState } from 'victory-native';
import { Circle } from '@shopify/react-native-skia';
import { Colors } from '@/constants/colors';
import type { ChartPoint } from '@/types/stock';

// CartesianChart requires Record<string, unknown> — add index signature
type ChartDatum = ChartPoint & { [key: string]: unknown };

interface PriceChartProps {
  data: ChartPoint[];
  isPositive: boolean;
  height?: number;
}

export function PriceChart({ data, isPositive, height = 220 }: PriceChartProps) {
  const lineColor = isPositive ? Colors.gain : Colors.loss;
  const areaColor = isPositive ? Colors.gainMuted : Colors.lossMuted;

  // isActive is a plain boolean in victory-native v42 (triggers re-renders)
  const { state, isActive } = useChartPressState({ x: 0, y: { close: 0 } });

  const chartData = useMemo<ChartDatum[]>(
    () => data.map((p) => ({ ...p })),
    [data],
  );

  if (data.length < 2) return <View style={{ height }} />;

  return (
    <View style={{ height }}>
      <CartesianChart<ChartDatum, 'timestamp', 'close'>
        data={chartData}
        xKey="timestamp"
        yKeys={['close']}
        domainPadding={{ top: 30, bottom: 0, left: 0, right: 8 }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => (
          <>
            <Area
              points={points.close}
              y0={chartBounds.bottom}
              color={areaColor}
            />
            <Line
              points={points.close}
              color={lineColor}
              strokeWidth={2}
            />
            {isActive && (
              <Circle
                cx={state.x.position}
                cy={state.y.close.position}
                r={5}
                color={lineColor}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
