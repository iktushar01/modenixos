"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductSizeChart } from "@/types/store.types";
import { DEFAULT_SIZE_CHART_COLUMNS } from "@/zod/product.validation";

interface SizeChartEditorProps {
  value?: ProductSizeChart;
  onChange: (chart: ProductSizeChart | undefined) => void;
}

const emptyChart = (): ProductSizeChart => ({
  note: "Size chart - In inches (Expected Deviation < 3%)",
  columns: [...DEFAULT_SIZE_CHART_COLUMNS],
  rows: [],
});

export function SizeChartEditor({ value, onChange }: SizeChartEditorProps) {
  const chart = value ?? emptyChart();

  const updateColumn = (index: number, text: string) => {
    const columns = [...chart.columns];
    columns[index] = text;
    onChange({ ...chart, columns });
  };

  const updateCell = (rowIndex: number, colIndex: number, text: string) => {
    const rows = chart.rows.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? text : cell)) : row,
    );
    onChange({ ...chart, rows });
  };

  const addRow = () => {
    onChange({
      ...chart,
      rows: [...chart.rows, chart.columns.map(() => "")],
    });
  };

  const removeRow = (index: number) => {
    onChange({ ...chart, rows: chart.rows.filter((_, i) => i !== index) });
  };

  if (!value && chart.rows.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Size chart</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange(emptyChart())}>
          <Plus className="mr-1 h-4 w-4" />
          Add size chart
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Size chart</Label>
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
          Remove chart
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {chart.columns.map((col, i) => (
                <th key={i} className="p-2">
                  <Input
                    value={col}
                    onChange={(e) => updateColumn(i, e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </th>
              ))}
              <th className="w-10 p-2" />
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, ri) => (
              <tr key={ri} className="border-b last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="p-2">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="h-8 text-xs"
                    />
                  </td>
                ))}
                <td className="p-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(ri)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-1 h-4 w-4" />
        Add row
      </Button>
      <Textarea
        rows={2}
        value={chart.note ?? ""}
        onChange={(e) => onChange({ ...chart, note: e.target.value })}
        placeholder="Footer note under the chart"
      />
    </div>
  );
}
