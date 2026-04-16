import * as React from 'react';
import { useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi, IRowNode } from "ag-grid-community";
import { priceFormatter, volumeFormatter } from "@modules/ag-grid/formatter";
import { type Ticker } from "@modules/tickers/types/Ticker";
import type { AppDispatch } from "@modules/redux/store";
import { selectCurrencyPair } from "@modules/selection/slice";
import PriceChartRenderer from "./PriceChartRenderer";
import { formatCurrencyPair } from "@modules/reference-data/utils";
import PriceRenderer from "./PriceRenderer";
import './market.scss';

export interface Props {
    selectedCurrencyPair?: string
    tickers: (Ticker & { currencyPair: string; prices: number[] })[]
}

const Market = ({ tickers, selectedCurrencyPair }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [gridApi, setGridApi] = React.useState<GridApi | undefined>();

    const columnDefs: ColDef[] = [
        {
            headerName: "Ccy",
            field: "currencyPair",
            valueFormatter: (params) => formatCurrencyPair(params.value),
            width: 100,
        },
        {
            cellRenderer: "priceRenderer",
            cellStyle: () => ({
                color: "#00AD08",
                display: "flex",
                justifiedContent: "flex-end",
            }),
            headerName: "Bid Price",
            field: "bid",
            type: "numericColumn",
            valueFormatter: priceFormatter,
            width: 95,
        },
        {
            cellRenderer: "priceRenderer",
            cellStyle: () => ({
                color: "#FF264D",
            }),
            field: "ask",
            headerName: "Ask Price",
            valueFormatter: priceFormatter,
            width: 95,
        },
        {
            field: "volume",
            headerName: "Volume",
            valueFormatter: volumeFormatter,
            width: 95,
        },
        {
            cellRenderer: "priceChartRenderer",
            cellStyle: () => ({
                paddingLeft: 0,
                paddingRight: 0,
            }),
            field: "prices",
            headerName: "",
            valueFormatter: () => "",
            width: 66,

        },
    ];

    React.useEffect(() => {
        if (gridApi) {
            const nodesToRefresh: IRowNode[] = [];
            gridApi.forEachNode(function (node) {
                const shouldSelect = node.data.currencyPair === selectedCurrencyPair
                if (node.isSelected() || shouldSelect) {
                    nodesToRefresh.push(node)
                }
                node.setSelected(shouldSelect);
            })
            gridApi.redrawRows({
                rowNodes: nodesToRefresh,
            })
        }
    }, [gridApi, selectedCurrencyPair])

    const rowClassRules = {
        "selected-row": (params: any) => params.data.currencyPair === selectedCurrencyPair,
    }

    return (
        <div className="ag-theme-quartz-dark market-container">
            <AgGridReact
                columnDefs={columnDefs}
                components={{
                    priceChartRenderer: PriceChartRenderer,
                    priceRenderer: PriceRenderer,
                }}
                getRowId={(params) => params.data.currencyPair}
                onGridReady={(event) => {
                    setGridApi(event.api)
                }}
                onRowClicked={(event) => {
                    dispatch(selectCurrencyPair({ currencyPair: event.data.currencyPair }))
                }}
                rowData={tickers}
                rowClassRules={rowClassRules}
                suppressHorizontalScroll={true}
            />
        </div>
    )
}

export default Market;