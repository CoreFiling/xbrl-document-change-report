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
import { ReactNode, CSSProperties } from 'react';

import './form.less';

interface FormProps {
  className?: string;
  style?: CSSProperties;
  onSubmit?: () => void;
  children: ReactNode;
}

export function Form({className, style, onSubmit, children}: FormProps): JSX.Element {
  return <form className={classNames('app-Form', className)} style={style}
    onSubmit={onSubmit ? e => { e.preventDefault(); onSubmit(); } : undefined}
  >{children}</form>;
}

interface FormItemProps {
  className?: string;
  children: ReactNode;
}

export function FormItem({className, children}: FormItemProps): JSX.Element {
  return <div className={classNames('app-FormItem', className)}>{children}</div>;
}

interface FormActionListProps {
  className?: string;
  children: ReactNode;
}

export function FormActionList({className, children}: FormActionListProps): JSX.Element {
  return <div className={classNames('app-FormActionList', className)}>{children}</div>;
}

interface FormActionProps {
  className?: string;
  primary?: boolean;
  enabled?: boolean;
  children: ReactNode;
}

export function FormAction({className, enabled, primary, children}: FormActionProps): JSX.Element {
  return <button
    className={classNames('app-FormAction', className, {'app-FormAction-primary': primary})}
    disabled={!enabled}>{children}</button>;
}
