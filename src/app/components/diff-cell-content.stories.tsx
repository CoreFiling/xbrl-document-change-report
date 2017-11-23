import * as React from 'react';
import { storiesOf } from '@storybook/react';
import DiffCellContent from './diff-cell-content';

storiesOf('DiffCellContent', module)
  .addDecorator(story => <div style={{
    margin: 'auto',
    maxWidth: '300px',
    padding: '40px',
    color: 'rgba(0, 0, 0, 0.85)',
    background: 'repeating-linear-gradient(-45deg, #F7F7F7 0, #F7F7F7 10px, #FFF 10px, #FFF 20px)',
  }}>{story()}</div>)
  .add('NOP', () => <DiffCellContent
    cell={{
      facts: [
        {id: 13, stringValue: 'VALUE'},
      ],
      issues: [],
    }}
    diffCell={{
      diffStatus: 'NOP',
      facts: [
        {
          diffStatus: 'NOP',
          from: {id: 69, sourceId: 13, source: 'FROM'},
          to: {id: 70, sourceId: 13, source: 'TO'},
        },
      ],
    }}
  />)
  .add('DEL', () => <DiffCellContent
    cell={{
      facts: [
        {id: 13, stringValue: 'VALUE'},
      ],
      issues: [],
    }}
    diffCell={{
      diffStatus: 'DEL',
      facts: [
        {
          diffStatus: 'DEL',
          from: {id: 69, sourceId: 13, source: 'FROM'},
        },
      ],
    }}
  />)
  .add('ADD', () => <DiffCellContent
    cell={{
      facts: [
        {id: 13, stringValue: 'VALUE'},
      ],
      issues: [],
    }}
    diffCell={{
      diffStatus: 'ADD',
      facts: [
        {
          diffStatus: 'ADD',
          to: {id: 69, sourceId: 13, source: 'TO'},
        },
      ],
    }}
  />)
  .add('CHG', () => <DiffCellContent
    cell={{
      facts: [
        {id: 13, stringValue: 'OLD VALUE'},
        {id: 42, stringValue: 'NEW VALUE'},
      ],
      issues: [],
    }}
    diffCell={{
      diffStatus: 'CHG',
      facts: [
        {
          diffStatus: 'CHG',
          from: {id: 69, sourceId: 13, source: 'FROM'},
          to: {id: 70, sourceId: 42, source: 'TO'},
        },
      ],
    }}
  />)
  .add('Wild', () => <DiffCellContent
    cell={{
      issues: [],
      facts: [{
        id: 75,
        stringValue: '£7,834,190.00',
      }],
    }}
    diffCell={{
      diffStatus: 'CHG',
      facts: [
        {
          diffStatus: 'CHG',
          from: {
            id: 15,
            source: 'FROM',
            sourceId: 15,
          },
          to: {
            id: 75,
            source: 'TO',
            sourceId: 19,
          },
        },
    ],
  }}
  />)
;
