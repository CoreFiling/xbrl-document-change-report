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

import { User, App } from '../models';
import { AUTH_LOGOUT } from '../urls';
import AppSymbol from './app-symbol';
import CoreFilingLogo from './corefiling-logo';
import NavMenu, { MenuItem } from './nav-menu';

import './app-bar.less';

export interface AppBarProps extends Props<AppBar> {
  path: string;
  user?: User;
  apps?: App[];
  className?: string;
}

export default class AppBar extends Component<AppBarProps> {
  render(): JSX.Element {
    const { path, user, apps, className } = this.props;

    // Assemble the menu.
    const itemGroups: MenuItem[][] = [];
    if (apps) {
      const appItems = apps.filter(x => x.href !== path).map(x => ({label: x.name || x.id, href: x.href}));
      if (appItems.length > 0) {
        itemGroups.push(appItems);
      }
    }
    itemGroups.push([{label: 'Log out', href: AUTH_LOGOUT}]);

    return <header className={classNames('app-AppBar', className)}>
      <div className='app-AppBar-brand'>
        <a href={path} className='app-AppBar-appLogo'>
          <AppSymbol className='app-AppBar-appSymbol'/>
          XBRL Document Change Report
        </a>
        <CoreFilingLogo className='app-AppBar-corefilingLogo'/>
      </div>
      <nav className='app-AppBar-nav'>
        <ul className='app-AppBar-breadcrumbNav'>
          <li><a href='/' className='app-AppBar-breadcrumbLink'>Home</a></li>
        </ul>
        {user && <span className='app-AppBar-userName'>{user.email}</span>}
        <NavMenu itemGroups={itemGroups}/>
      </nav>
    </header>;
  }
}
