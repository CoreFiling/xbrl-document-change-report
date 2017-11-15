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
import { Component, Props } from 'react';
import { connect } from 'react-redux';

import { User, App } from '../models';
import { State } from '../state';
import AppBar from './app-bar';

export const HOME = `/${location.pathname.split('/')[1]}/`;

interface OwnProps extends Props<AppBarContainer> {
  className?: string;
}

interface PropsFromState {
  user?: User;
  apps?: App[];
}

type AppBarContainerProps = OwnProps & PropsFromState;

class AppBarContainer extends Component<AppBarContainerProps> {
  render(): JSX.Element {
    const { className, user, apps } = this.props;
    return <AppBar className={className} path={HOME} user={user} apps={apps}/>;
  }
}

const propsFromState = ({ global: { user, apps } }: State): PropsFromState => ({user, apps});

export default connect(propsFromState)(AppBarContainer);
