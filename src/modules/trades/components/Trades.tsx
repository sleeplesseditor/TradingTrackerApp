import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Trade } from "../types/Trade";
import { amountFormatter, priceFormatter, timeFormatter } from "@modules/ag-grid/formatter";
import { useThrottle } from "@core/hooks/useThrottle";
import "./trades.scss";

export interface Props {
    trades: Trade[]
};

const Trades = React.memo(({ trades }: Props) => {
    const throttledTrades = useThrottle<Trade[]>(trades, 100)
    const columnDefs: ColDef[] = React.useMemo(() => [
        {
            headerName: "Id",
            field: "id",
            hide: true,
        },
        {
            headerName: "Amount",
            field: "amount",
            width: 160,
            valueFormatter: (params) => amountFormatter({ value: Math.abs(params.value) }),
        },
        {
            headerName: "Price",
            field: "price",
            width: 160,
            cellStyle: (params) => {
                return {
                    color: params.value < 0 ? "#FF264D" : "#00AD08",
                }
            },
            valueFormatter: priceFormatter,
        },
        {
            headerName: "Time",
            field: "timestamp",
            width: 160,
            valueFormatter: timeFormatter,
            cellStyle: () => ({
                color: "rgba(245, 245, 245, 0.64)",
            }),
        },
    ],
    []);

    const getRowId = React.useCallback((params: any) => `${params.data.id}`, []);

    return (
        <div className="trades-container ag-theme-quartz-dark">
            <AgGridReact
                columnDefs={columnDefs}
                getRowId={getRowId}
                gridOptions={{ 
                    localeText: { noRowsToShow: "Loading..." },
                    onGridReady: (params) => {
                        params.api.sizeColumnsToFit(); 
                    },
                    onGridSizeChanged: (params) => {
                        params.api.sizeColumnsToFit();
                    }
                }}
                rowData={throttledTrades}
                suppressHorizontalScroll={true}
            />
        </div>
    )
});

export default Trades