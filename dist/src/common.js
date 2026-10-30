import * as fs from 'fs';
import crypto from 'crypto';
function bumpDiffRegexp(docDigest) {
    return new RegExp(`<!-- Bump.sh.*digest=([^\\s]+)(?: doc=${docDigest})? -->`);
}
function bumpDiffComment(docDigest, digest) {
    return `<!-- Bump.sh digest=${digest} doc=${docDigest} -->`;
}
function extractBumpDigest(docDigest, body) {
    return (body.match(bumpDiffRegexp(docDigest)) || []).pop();
}
function shaDigest(texts) {
    const hash = crypto.createHash('sha1');
    texts.forEach((text) => text && hash.update(text, 'utf8'));
    return hash.digest('hex');
}
async function fsExists(fsPath) {
    try {
        await fs.promises.stat(fsPath);
    }
    catch (err) {
        if (err && err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
    return true;
}
export { bumpDiffComment, extractBumpDigest, fsExists, shaDigest };
//# sourceMappingURL=common.js.map