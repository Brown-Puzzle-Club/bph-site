import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/utils/utils";

type TransformData<T> = (header: string, data: T) => string | number;
type RenderData<T> = (header: string, data: T) => React.ReactNode;
type ExtractKey<T> = (data: T) => React.Key;

interface SortableTableProps<TData, THeader extends string> {
  data: TData[];
  headers: THeader[];
  transformData: TransformData<TData>;
  extractKey: ExtractKey<TData>;
  renderData: RenderData<TData>;
  defaultSortColumn?: THeader;
}

const sortData = <T,>(
  data: T[],
  transformData: TransformData<T>,
  sortColumn: string,
  sortAscending: boolean,
) => {
  return [...data].sort((a, b) => {
    const valueA = transformData(sortColumn, a);
    const valueB = transformData(sortColumn, b);

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortAscending ? valueA - valueB : valueB - valueA;
    }

    const valueAString = valueA.toString();
    const valueBString = valueB.toString();

    return sortAscending
      ? valueAString.localeCompare(valueBString)
      : valueBString.localeCompare(valueAString);
  });
};

export const SortableTable = <TData, THeader extends string>({
  data,
  headers,
  transformData,
  extractKey,
  renderData,
  defaultSortColumn,
}: SortableTableProps<TData, THeader>) => {
  const [sortColumn, setSortColumn] = useState<THeader | undefined>(defaultSortColumn);
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [values, setValues] = useState<TData[]>(data);

  useEffect(() => {
    setValues(sortColumn ? sortData(data, transformData, sortColumn, sortAscending) : data);
  }, [data, sortColumn, sortAscending, transformData]);

  return (
    <table className="table-auto">
      <thead className="border-b">
        <tr>
          {headers.map((header, index) => (
            <th
              className="px-4 cursor-pointer"
              key={index}
              onClick={() => {
                if (sortColumn === header) {
                  setSortAscending(!sortAscending);
                  return;
                }
                setSortColumn(header);
                setSortAscending(false);
              }}
            >
              <div className="flex gap-2">
                {header}
                <span className={cn(sortColumn === header ? "visible" : "invisible")}>
                  {sortAscending ? "▲" : "▼"}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <Reorder.Group as="tbody" values={values} onReorder={setValues}>
        {values.map((row, index) => (
          <Reorder.Item
            as="tr"
            key={extractKey(values[index])}
            value={values[index]}
            dragListener={false}
            className="border-t border-b"
          >
            {headers.map((header, index) => (
              <td className="px-4" key={index}>
                {renderData(header, row)}
              </td>
            ))}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </table>
  );
};
