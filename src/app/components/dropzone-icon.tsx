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

import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';

export type DropzoneIconType = 'OLD' | 'NEW';

export interface DropzoneIconProps extends Props<DropzoneIcon> {
  className?: string;
  style?: CSSProperties;
  type: DropzoneIconType;
}

export default class DropzoneIcon extends Component<DropzoneIconProps> {
  render(): JSX.Element {
    const { className, style, type } = this.props;

    const width = 44;
    const height = 61;
    /* tslint:disable */
    return <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox={`0 0 44 67`}
      className={className} style={style}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path d="M21.9800426,41 C21.6234296,41 21.2761397,40.9297143 20.9463309,40.7914857 C20.6270108,40.6602857 20.3344948,40.4658286 20.0862642,40.2163143 L10.7805283,30.8624571 C9.73865882,29.8023143 9.74098963,28.0943714 10.7805283,27.0506286 C11.2874782,26.5410571 11.9599152,26.2610857 12.6743067,26.2610857 C13.3875328,26.2610857 14.0599699,26.5398857 14.5669198,27.0471143 L19.3007832,31.8031143 L19.3007832,2.69545714 C19.3007832,1.21008571 20.5011473,0 21.9765464,0 C23.4554417,0 24.6581367,1.21008571 24.6581367,2.69545714 L24.6581367,31.8042857 L29.4281275,27.0143143 C29.9304158,26.5059143 30.6028528,26.2259429 31.3184097,26.2259429 C32.0491169,26.2259429 32.7273809,26.5117714 33.2308346,27.0295429 C33.7226343,27.5250571 34,28.1998 34,28.9190571 C33.9988346,29.6406571 33.7191381,30.3165714 33.2121882,30.8238 L23.8784827,40.2116286 C23.6279212,40.4634857 23.3319091,40.6602857 22.9974387,40.7973429 C22.6827801,40.9297143 22.3366557,41 21.9800426,41" fill="#69BEAB" transform="translate(22.000000, 20.500000) rotate(-180.000000) translate(-22.000000, -20.500000) "></path>
        <g transform="translate(22.000000, 45.500000) rotate(-180.000000) translate(-22.000000, -45.500000) translate(0.000000, 24.000000)">
          <path d="M31.8409474,42.8386316 C30.5001053,42.8386316 29.4082105,41.7502105 29.4082105,40.4105263 C29.4082105,39.0696842 30.5001053,37.9801053 31.8409474,37.9801053 L38.9017895,37.9801053 L38.9017895,4.86315789 L4.85968421,4.86315789 L4.85968421,37.9801053 L11.9263158,37.9801053 C13.2671579,37.9801053 14.3578947,39.0696842 14.3578947,40.4105263 C14.3578947,41.7502105 13.2671579,42.8386316 11.9263158,42.8386316 L2.55315789,42.8386316 C1.14515789,42.8386316 0,41.6934737 0,40.2854737 L0,2.55315789 C0,1.14515789 1.14515789,0 2.55315789,0 L41.2141053,0 C42.6221053,0 43.7672632,1.14515789 43.7672632,2.55315789 L43.7672632,40.2854737 C43.7672632,41.6934737 42.6221053,42.8386316 41.2141053,42.8386316 L31.8409474,42.8386316 Z" fill="#69BEAB"></path>
        </g>
        <text fontFamily="Roboto-Bold, Roboto" font-size="14" fontWeight="bold" fill="#69BEAB" style={{ textAnchor: 'middle' }}>
          <tspan x="22" y="57">{type}</tspan>
        </text>
      </g>
    </svg>;
    /* tslint:enable */
  }
}
