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
import { connect, MapDispatchToProps } from 'react-redux';
import { Profile } from '@cfl/table-diff-service';
import { Option, TableMetadata } from '@cfl/table-rendering-service';
import { QueryableTablePage } from '@cfl/table-viewer';

import { tableRenderPageAction, processingStartAction, resultsDismissAction } from '../actions';
import { Phase, State } from '../state';
import App from '../components/app';
import AppBarContainer from '../corefiling/app-bar-container';

type OwnProps = Props<AppContainer>;

interface PropsFromState {
  comparisonId?: string;
  phase?: Phase;
  profiles?: Profile[];
  message?: string;
  tables?: TableMetadata[];
  metadata?: TableMetadata;
  zOptions?: Option[][];
  table?: QueryableTablePage;
}

interface PropsFromDispatch {
  onCheckingStart?: typeof processingStartAction;
  onResultsDismiss?: typeof resultsDismissAction;
  onTableRenderPage?: typeof tableRenderPageAction;
}

type AppContainerProps = OwnProps & PropsFromState & PropsFromDispatch;

class AppContainer extends Component<AppContainerProps> {
  render(): JSX.Element {
    const {
      phase, profiles, message, tables, metadata, zOptions, table,
      onTableRenderPage, onCheckingStart, onResultsDismiss,
    } = this.props;
    return (
      <div>
        <AppBarContainer className='app-App-appBar'/>
        <App
          phase={phase}
          profiles={profiles}
          error={message}
          onSubmit={onCheckingStart}
          onResultsDismiss={onResultsDismiss}
          tables={tables}
          metadata={metadata}
          zOptions={zOptions}
          table={table}
          onChangePage={(x, y, z) => onTableRenderPage && metadata && onTableRenderPage(metadata, x, y, z)}
          onChangeTable={newTable => onTableRenderPage && onTableRenderPage(newTable, 0, 0, 0)}
        />
      </div>
    );
  }
}

function propsFromState(state: State): PropsFromState {
  const {
    global: {phase, profiles, message},
    filing: {comparisonId, tables, selectedTable: metadata, zOptions, tableRendering: table},
  } = state;
  return {comparisonId, phase, profiles, message, tables, metadata, zOptions, table};
}

const propsFromDispatch: MapDispatchToProps<PropsFromDispatch, {}> = {
  onCheckingStart: processingStartAction,
  onResultsDismiss: resultsDismissAction,
  onTableRenderPage: tableRenderPageAction,
};

export default connect(propsFromState, propsFromDispatch)(AppContainer);
