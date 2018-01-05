// @flow

import * as React from 'react';
import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

export const linkify = new LinkifyIt();
linkify.tlds(tlds);

type Props = {
  children: React.Node,
  className: string,
  component: any,
  properties: Object,
  urlRegex: Object,
  emailRegex: Object,
};

class Linkify extends React.Component<Props, {}> {
  static defaultProps = {
    className: 'Linkify',
    component: 'a',
    properties: {},
  };

  static MATCH = 'LINKIFY_MATCH';
  parseCounter = 0;

  getMatches(string: string) {
    return linkify.match(string);
  }

  parseString(string: string) {
    let elements = [];
    if (string === '') {
      return elements;
    }

    const matches = this.getMatches(string);
    if (!matches) {
      return string;
    }

    let lastIndex = 0;
    matches.forEach((match, idx) => {
      // Push the preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index));
      }
      // Shallow update values that specified the match
      let props = {href: match.url, key: `parse${this.parseCounter}match${idx}`};
      for (let key in this.props.properties) {
        let val = this.props.properties[key];
        if (val === Linkify.MATCH) {
          val = match.url;
        }

        props[key] = val;
      }
      elements.push(React.createElement(
        this.props.component,
        props,
        match.text
      ));
      lastIndex = match.lastIndex;
    });

    if (lastIndex < string.length) {
      elements.push(string.substring(lastIndex));
    }

    return (elements.length === 1) ? elements[0] : elements;
  }

  parse(children: any) {
    if (typeof children === 'string') {
      return this.parseString(children);
    } else if (React.isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
      return React.cloneElement(
        children,
        {key: `parse${++this.parseCounter}`},
        this.parse(children.props.children)
      );
    } else if (children instanceof Array) {
      return children.map((child) => {
        return this.parse(child);
      });
    }

    return children;
  }

  render() {
    this.parseCounter = 0;
    const parsedChildren = this.parse(this.props.children);

    return <span className={this.props.className}>{parsedChildren}</span>;
  }
}

export default Linkify;