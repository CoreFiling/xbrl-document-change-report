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

import * as classNames from 'classnames';
import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';

export interface FileReferenceIconProps extends Props<FileReferenceIcon> {
  className?: string;
  style?: CSSProperties;
  type: 'OLD' | 'NEW';
}

export default class FileReferenceIcon extends Component<FileReferenceIconProps> {
  render(): JSX.Element {
    const { className, style, type } = this.props;

    // Flip icon on vertical axis for NEW.
    // Translation isn't quite right... it seems to be about 0.25 pixels off by eye in Chrome.
    const transform1 = type === 'OLD' ? '' : 'scale(-1, 1) translate(-50, 0)';
    const transform2 = type === 'OLD' ? '' : 'scale(-1, 1) translate(-630, 0)'; // Bogus WTF coordinates in SVG.

    const width = 50;
    const height = 64;
    /* tslint:disable */
    return <div className='app-FileReferenceIcon'>
        <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox="0 0 51 64" className={classNames('app-FileReferenceIcon-info', className)} style={style}>
            <g stroke="none" strokeWidth="1" fill="#" fillRule="evenodd">
                <path transform={transform1} d="M2.13519706,18.5785353 C2.13519706,17.7451333 2.81035818,17.0699721 3.64587008,17.0699721 L15.5582442,17.0699721 C16.3916462,17.0699721 17.0668073,16.394811 17.0668073,15.561409 L17.0668073,3.64692502 C17.0668073,2.813523 17.7440783,2.13836188 18.5774803,2.13836188 L46.4890632,2.13836188 C47.3245751,2.13836188 47.9997363,2.813523 47.9997363,3.64692502 L47.9997363,60.3583497 C47.9997363,61.1896418 47.3245751,61.8669128 46.4890632,61.8669128 L3.64587008,61.8669128 C2.81035818,61.8669128 2.13519706,61.1896418 2.13519706,60.3583497 L2.13519706,18.5785353 Z M14.9379399,14.1435706 C14.9379399,14.5803155 14.5855902,14.9347751 14.1488453,14.9347751 L5.55320026,14.9347751 C4.84850083,14.9347751 4.49615112,14.084494 4.99408245,13.5865627 L13.5918374,4.99091763 C14.0876589,4.49087642 14.9379399,4.84322614 14.9379399,5.54792556 L14.9379399,14.1435706 Z M0,16.1838232 L0,62.4935467 C0,63.3269488 0.675161125,64 1.50856314,64 L48.6263702,64 C49.4597722,64 50.1370432,63.3269488 50.1370432,62.4935467 L50.1370432,1.50961808 C50.1370432,0.678325943 49.4597722,0.00105493926 48.6263702,0.00105493926 L16.186988,0.00105493926 C15.7882209,0.00105493926 15.4042231,0.161405707 15.1193895,0.444129428 L0.44096461,15.1162246 C0.158240889,15.3989484 0,15.7850561 0,16.1838232 L0,16.1838232 Z"></path>
                <text fontFamily="Roboto-Bold, Roboto" fontSize="14" fontWeight="bold" style={ { textAnchor: 'middle'} }>
                    <tspan x="25" y="43">{type}</tspan>
                </text>
            </g>
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox="290 263 51 64" className={classNames('app-FileReferenceIcon-del', className)} style={style}>
            <g stroke="none" strokeWidth="1" fillRule="evenodd" fill="#2D5578">
                <path transform={transform2} d="M321.15709,304.626479 C321.62971,305.09699 321.62971,305.858669 321.15709,306.329179 C320.922889,306.56549 320.614842,306.683645 320.306795,306.683645 C319.996637,306.683645 319.6907,306.56549 319.45439,306.329179 L315.06788,301.94267 L310.68137,306.329179 C310.44717,306.56549 310.139122,306.683645 309.831075,306.683645 C309.520918,306.683645 309.21498,306.56549 308.98078,306.329179 C308.508159,305.858669 308.508159,305.09699 308.98078,304.626479 L313.36729,300.23997 L308.98078,295.85135 C308.508159,295.380839 308.508159,294.619161 308.98078,294.14865 C309.449181,293.676029 310.212969,293.676029 310.68137,294.14865 L315.06788,298.53516 L319.45439,294.14865 C319.9249,293.676029 320.686579,293.676029 321.15709,294.14865 C321.62971,294.619161 321.62971,295.380839 321.15709,295.85135 L316.77058,300.23997 L321.15709,304.626479 Z M304.938186,277.142749 C304.938186,277.579501 304.585831,277.933966 304.149079,277.933966 L295.553292,277.933966 C294.848581,277.933966 294.496225,277.081561 294.996275,276.585732 L303.592061,267.987835 C304.087891,267.489895 304.938186,267.842251 304.938186,268.544852 L304.938186,277.142749 Z M338.627172,263 L306.187255,263 C305.788481,263 305.404477,263.160353 305.119639,263.440972 L290.440972,278.117529 C290.160353,278.398147 290,278.782151 290,279.183035 L290,325.493522 C290,326.326938 290.675172,327 291.508588,327 L338.627172,327 C339.460587,327 340.13787,326.326938 340.13787,325.493522 L340.13787,264.508588 C340.13787,263.677282 339.460587,263 338.627172,263 L338.627172,263 Z"></path>
            </g>
        </svg>
    </div>
    /* tslint:enable */
  }
}
