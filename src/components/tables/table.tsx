import { Column, FilterFn, RowData } from "@tanstack/react-table";
import { ReactSelect } from "../ui/react-select";

declare module '@tanstack/react-table' {

  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: {
      type: 'select' | 'multi-select'
      options: { value: string | number | boolean, label: string }[]
    }
  }
}


export const filterInArray: FilterFn<any> = (row, columnId, value: any[]) => {
  if (!value || value.length === 0) return true
  return value.some(v => v === row.getValue(columnId))
}

export function ColumnFilter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()

  return filterVariant?.type === 'multi-select' || filterVariant?.type === 'select' ?
    <ReactSelect
      className="min-w-52"
      isMulti={filterVariant.type === 'multi-select'}
      isSearchable={false}
      options={filterVariant.options}
      value={columnFilterValue}
      onChange={column.setFilterValue} />
    : <div className="" />


}
