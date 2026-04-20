import * as React from 'react';
import TickerContainer from "../Ticker/TickerContainer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './tickers.scss';

export type ScrollDirection = "left" | "right";

export interface Props {
    currencyPairs: string[]
    selectedCurrencyPair?: string
}

const Tickers = ({ currencyPairs, selectedCurrencyPair }: Props) => {
    const sliderRef = React.useRef<Slider | null>(null);

    const settings = {
        centerMode: true,
        centerPadding: "60px",
        dots: true,
        // fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    React.useEffect(() => {
        if (selectedCurrencyPair) {
            const selectedIndex = currencyPairs.findIndex((pair) => pair === selectedCurrencyPair);
            if (selectedIndex >= 0) {
                sliderRef.current?.slickGoTo(selectedIndex);
            }
        }
    }, [selectedCurrencyPair, currencyPairs]);

    const handleSlideClick = (index: number) => {
        sliderRef.current?.slickGoTo(index);
    };

    return (
        <div className="tickers__container">
            <Slider ref={sliderRef} {...settings} >
                {currencyPairs.map((currencyPair, index) => {
                    return (
                        <TickerContainer
                            key={currencyPair}
                            currencyPair={currencyPair}
                            onClick={() => handleSlideClick(index)}
                        />
                    )
                })}
            </Slider>
        </div>
    )
}

export default Tickers;