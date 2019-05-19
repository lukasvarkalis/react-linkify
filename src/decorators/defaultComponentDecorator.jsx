// @flow

import * as React from 'react';

export default (decoratedHref: string, decoratedText: string, key: number, className): React.Node => {
  return (
    <a href={decoratedHref} key={key} className={className}>
      {decoratedText}
    </a>
  );
};
