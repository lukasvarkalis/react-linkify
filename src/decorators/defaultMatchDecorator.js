// @flow

import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

const linkify = new LinkifyIt();
linkify.tlds(tlds)
.add('@', {
    validate: function (text, pos, self) {
        pos -= 2;

        if (/\B\@\[\@([A-Za-z0-9_-])+\]\(.{36}\)/.test(text)) {
            return text.match(/\B\@\[\@([A-Za-z0-9_-])+\]\(.{36}\)/)[0].length;
        }

        return 0;
    },
    normalize: function (match) {
        match.text = match.text.replace(/@\[/, '')
            .replace(/\[/, '')
            .replace(/\]\(.{36}\)/, '');
        
        match.url = match.url.replace(/@\[.*\(/, '/')
        .replace(/\)/, '');
    }
});

export default (text: string): Array<Object> => {
    return linkify.match(text);
};
