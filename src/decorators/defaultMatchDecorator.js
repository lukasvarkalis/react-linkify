// @flow

import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

const linkify = new LinkifyIt();
linkify.tlds(tlds)
.add('@', {
  validate: function (text, pos, self) {
    var tail = text.slice(pos);

    if (!self.re.twitter) {
      self.re.twitter =  new RegExp(
        '^([a-zA-Z0-9_]){1,15}(?!_)(?=$|' + self.re.src_ZPCc + ')'
      );
    }
    if (self.re.twitter.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === '@') {
        return false;
      }
      return tail.match(self.re.twitter)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url = '/' + match.url.replace(/^@/, '');
  }
});

export default (text: string): Array<Object> => {
  return linkify.match(text);
};
