/*
 *  Copyright 2017 CoreFiling S.A.R.L.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * The App Symbol.
 */

import * as classNames from 'classnames';
import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';

export interface AppSymbolProps extends Props<AppSymbol> {
  className?: string;
  style?: CSSProperties;
}

export default class AppSymbol extends Component<AppSymbolProps> {
  render(): JSX.Element {
    const { className, style } = this.props;

    const height = 24;
    const width = 43;
    const r = height / 2;
    return <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        className={classNames('app-AppLogo', className)} style={style}>
      <circle cx={r} cy={r} r={r}/>
      <circle cx={width - r} cy={r} r={r}/>
    </svg>;
  }
}
