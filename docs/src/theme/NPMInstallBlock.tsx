import React, { memo } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export interface Props {
  packageName: string;
  global?: boolean;
}

export interface PackageManager {
  readonly format: (props: Props) => string;
  readonly name: string;
  readonly storageKey: string;
}

const packageManagers: PackageManager[] = [
  {
    name: 'NPM',
    format({ packageName, global }) {
      const flags = [];

      if (global) {
        flags.push('-g');
      }

      let command = `npm install ${packageName}`;

      if (flags.length > 0) {
        command += ` ${flags.join(' ')}`;
      }

      return command;
    },
    storageKey: 'npm',
  },
  {
    name: 'Yarn',
    format({ packageName, global }) {
      if (global) {
        return `yarn global add ${packageName}`;
      }

      return `yarn add ${packageName}`;
    },
    storageKey: 'yarn',
  },
  {
    name: 'PNPM',
    format(props) {
      // This is identical to NPM, but we include a "p" at the start.
      return `p${packageManagers[0].format(props)}`;
    },
    storageKey: 'pnpm',
  },
];

export function NPMInstallBlock(props: Props) {
  function renderPackageManager(packageManager: PackageManager) {
    const { storageKey, format, name } = packageManager;
    const formattedCommand = format(props);

    return (
      <TabItem value={storageKey} label={name} key={storageKey}>
        <CodeBlock>$ {formattedCommand}</CodeBlock>
      </TabItem>
    );
  }

  return <Tabs groupId="package_manager" children={packageManagers.map(renderPackageManager)} />;
}
