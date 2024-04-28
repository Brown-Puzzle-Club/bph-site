import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";

type TransformData = (header: string, data: Record<string, unknown>) => string | number;
type ExtractKey = (data: Record<string, unknown>) => string | number;

interface SortableTableProps {
  data: Record<string, unknown>[];
  headers: string[];
  transformData: TransformData;
  extractKey: ExtractKey;
}

const sortData = (
  data: Record<string, unknown>[],
  transformData: TransformData,
  sortColumn: string,
  sortAscending: boolean,
) => {
  return [...data].sort((a, b) => {
    const valueA = transformData(sortColumn, a).toString();
    const valueB = transformData(sortColumn, b).toString();

    return sortAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
};

export const SortableTable = ({ data, headers, transformData, extractKey }: SortableTableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [values, setValues] = useState<Record<string, unknown>[]>(data);

  useEffect(() => {
    setValues(sortColumn ? sortData(data, transformData, sortColumn, sortAscending) : data);
  }, [data, sortColumn, sortAscending, transformData]);

  return (
    <table className="table-auto">
      <thead>
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
                setSortAscending(true);
              }}
            >
              {header}
              <span>{sortColumn === header && (sortAscending ? "▲" : "▼")}</span>
            </th>
          ))}
        </tr>
      </thead>
      <Reorder.Group as="tbody" values={values} onReorder={setValues}>
        {values.map((row, index) => (
          <Reorder.Item as="tr" key={extractKey(values[index])} value={values[index]}>
            {headers.map((header, index) => (
              <td className="px-4" key={index}>
                {transformData(header, row)}
              </td>
            ))}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </table>
  );
};
