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
 * App bar with user name and menu. Simplified down from the brand bar + app bar of the CoreFiling UI framework.
 */

import * as classNames from 'classnames';
import * as React from 'react';
import { Component, Props } from 'react';

export interface MenuItem {
  label: string;
  href: string;
}

export interface NavMenuProps extends Props<NavMenu> {
  itemGroups: (MenuItem[] | MenuItem)[];
  className?: string;
}

interface State {
  isActive: boolean;
}

export default class NavMenu extends Component<NavMenuProps, State> {
  constructor(props: NavMenuProps) {
    super(props);

    this.state = {
      isActive: false,
    };
  }

  render(): JSX.Element {
    const { itemGroups, className } = this.props;
    const { isActive } = this.state;

    return <div className={classNames('app-NavMenu', className)}>
      <span className={classNames('app-NavMenu-btn', {'app-NavMenu-activeBtn': isActive})}
          onClick={() => this.setState({isActive: !isActive})}>
        <svg className='app-NavMenu-btnIcon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 10'>
          <rect x='0' y='0' width='14' height='2'/>
          <rect x='0' y='4' width='14' height='2'/>
          <rect x='0' y='8' width='14' height='2'/>
        </svg>
      </span>
      {isActive &&
        <ul className='app-NavMenu-menu'>
          {itemGroups.map((x, i) => <li key={i} className='app-NavMenu-itemGroup'>
            {isSingleton(x)
            ? <MenuItemLink {...x}/>
            : <ul>
                {x.map((it, j) => <li key={j}><MenuItemLink {...it}/></li>)}
              </ul>
            }
          </li>)}
        </ul>
      }
    </div>;
  }
}

// tslint:disable-next-line:variable-name
const MenuItemLink = ({label, href}: MenuItem): JSX.Element => <a className='app-NavMenu-link' href={href}>{label}</a>;

const isSingleton = (x: MenuItem | MenuItem[]): x is MenuItem => 'label' in x;
