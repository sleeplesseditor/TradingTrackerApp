import * as React from 'react';
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { priceFormatter, amountFormatter } from "@modules/ag-grid/formatter";
import { type Order } from "@modules/book/types/Order";
import { bidAmountRenderer, askAmountRenderer } from "./renderers";
import { useThrottle } from "@core/hooks/useThrottle";
import './book.scss';

export interface Props {
    orders: { bid: Order; ask: Order }[]
    isStale?: boolean
}

const Book = ({ orders }: Props) => {
    const throttledOrders = useThrottle<{ bid: Order; ask: Order }[]>(orders, 100);

    const columnDefs: ColDef[] = React.useMemo(() => [
        {
            headerName: "Bid Amount",
            field: "bid.amount",
            width: 145,
            valueFormatter: amountFormatter,
            cellRenderer: bidAmountRenderer,
        },
        {
            headerName: "Bid Price",
            field: "bid.price",
            width: 125,
            cellStyle: () => ({
                color: "#00AD08",
            }),
            type: "numericColumn",
            valueFormatter: priceFormatter,
        },
        {
            headerName: "Ask Price",
            field: "ask.price",
            width: 125,
            cellStyle: () => ({
                color: "#FF264D",
            }),
            valueFormatter: priceFormatter,
        },
        {
            headerName: "Ask Amount",
            field: "ask.amount",
            width: 145,
            valueFormatter: (params) => amountFormatter({ value: Math.abs(params.value) }),
            cellRenderer: askAmountRenderer,
        },
    ], []);

    const getRowId = React.useCallback(({ data }: any) => `${data.id}`, []);

    return (
        <div className="ag-theme-quartz-dark book-container">
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
                rowData={throttledOrders}
                suppressHorizontalScroll={true}
            />
        </div>
    )
}

export default Book;