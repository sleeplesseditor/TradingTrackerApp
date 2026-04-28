# Trading Tracker App

#### Table of Contents
- [Description](#description)
- [Example Screenshots](#example-screenshots)
- [Changes from Original Project](#changes-from-original-project)
- [Local Setup Instructions](#local-setup-instructions)

## Description

A refresher app as part of [online coursework (created by Ricardo Saumeth)](https://www.udemy.com/course/build-a-real-time-crypto-app-with-react-19-typescript), built using React 19, TypeScript, Redux Toolkit, WebSockets, Highcharts, AG Grid and the Bitfinex WebSocket API.

The app is live and available to view [here](https://sleeplesseditor.github.io/TradingTrackerApp/) via GithHub Pages. Additional updates are forthcoming.

## Example Screenshots

<img width="1436" height="676" alt="Screenshot 2026-04-22 at 10 34 30" src="https://github.com/user-attachments/assets/8928a243-a6f9-4884-9369-96ae46488812" />
Example of active dashboard with candlestick plot tooltips

<img width="1439" height="676" alt="Screenshot 2026-04-22 at 10 34 38" src="https://github.com/user-attachments/assets/94ec14f1-c510-4584-b460-491fcba36a0e" />
Example of diagnostics popover displayed

<img width="1100" height="472" alt="IMG_3856" src="https://github.com/user-attachments/assets/e15a9f73-9a7c-4a1d-8f39-d37510fe5f48" />

<img width="586" height="1085" alt="IMG_3855" src="https://github.com/user-attachments/assets/9c7103c5-cc65-488e-920b-eb4bc26b6c26" />
Examples of active dashboard on mobile device in landscape and portrait modes

## Changes from Original Project
- Use of custom SASS rather than Styled Components for easier debugging
    - Additionally, minor changes in colour palette for better legibility
- Revised custom tooltip styling, content and layout for Highcharts
- Revised Tickers component to use a slider setup (provided by [React-Slick](https://react-slick.neostack.com/) for better UX
- Improvements to mobile responsiveness for viewing on smaller devices
- Expansion of unit test coverage using Vitest and Testing-Library/React, as well as improvement of Playwright tests
- Updated performanceMonitor to use a custom React Hook (usePopover) and only appear when run locally in Dev mode. The menu display is triggered by clicking on the 'gear icon' in Header
- Use of media queries to use overflow scrolling and a sticky header for mobile UX

## Local Setup Instructions
1. CD into the project folder
2. Run `npm install`
3. Run `npm run dev`
