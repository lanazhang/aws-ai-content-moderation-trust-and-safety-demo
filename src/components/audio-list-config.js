// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { CollectionPreferences, StatusIndicator, Link } from '@cloudscape-design/components';
import { addColumnSortLabels } from '../common/labels';

export const COLUMN_DEFINITIONS = addColumnSortLabels([
  {
    id: 'name',
    sortingField: 'name',
    header: 'Job name',
    cell: item => item.name,
    minWidth: 180,
  },
  {
    id: 'status',
    sortingField: 'status',
    header: 'Status',
    cell: item => (
      <StatusIndicator type={item.status === 'COMPLETED' ? 'success' : item.status === 'FAILED'? 'error': 'info' }>{item.status}</StatusIndicator>
    ),
    minWidth: 120,
  },
  {
    id: 'created',
    sortingField: 'created',
    cell: item => item.created,
    header: 'Created',
    minWidth: 160,
  },
]);

const VISIBLE_CONTENT_OPTIONS = [
  {
    label: 'Transcription jobs',
    options: [
      { id: 'name', label: 'Job name', editable: false },
      { id: 'status', label: 'Status' },
      { id: 'created', label: 'Created' },
    ],
  },
];

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Jobs' },
  { value: 30, label: '30 Jobs' },
  { value: 50, label: '50 Jobs' },
];

export const DEFAULT_PREFERENCES = {
  pageSize: 30,
  visibleContent: ['name', 'status', 'created'],
  wrapLines: false,
  stripedRows: false,
};

export const Preferences = ({
  preferences,
  setPreferences,
  disabled,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  visibleContentOptions = VISIBLE_CONTENT_OPTIONS,
}) => (
  <CollectionPreferences
    title="Preferences"
    confirmLabel="Confirm"
    cancelLabel="Cancel"
    disabled={disabled}
    preferences={preferences}
    onConfirm={({ detail }) => setPreferences(detail)}
    pageSizePreference={{
      title: 'Page size',
      options: pageSizeOptions,
    }}
    wrapLinesPreference={{
      label: 'Wrap lines',
      description: 'Check to see all the text and wrap the lines',
    }}
    stripedRowsPreference={{
      label: 'Striped rows',
      description: 'Check to add alternating shaded rows',
    }}
    visibleContentPreference={{
      title: 'Select visible columns',
      options: visibleContentOptions,
    }}
  />
);