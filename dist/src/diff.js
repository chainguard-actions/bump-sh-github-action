import { bumpDiffComment, shaDigest } from './common.js';
export async function run(diff, repo) {
    const digestContent = [diff.markdown];
    if (diff.public_url) {
        digestContent.push(diff.public_url);
    }
    const digest = shaDigest(digestContent);
    const body = buildCommentBody(repo.docDigest, diff, digest);
    return repo.createOrUpdateComment(body, digest);
}
function buildCommentBody(docDigest, diff, digest) {
    const emptySpace = '';
    const poweredByBump = '> _Powered by [Bump.sh](https://bump.sh)_';
    const text = diff.markdown || 'No structural change, nothing to display.';
    return [title(diff)]
        .concat([emptySpace, text])
        .concat([viewDiffLink(diff), poweredByBump, bumpDiffComment(docDigest, digest)])
        .join('\n');
}
function title(diff) {
    const structureTitle = '🤖 API structural change detected:';
    const contentTitle = 'ℹ️ API content change detected:';
    const breakingTitle = '🚨 Breaking API change detected:';
    if (diff.breaking) {
        return breakingTitle;
    }
    else if (diff.markdown) {
        return structureTitle;
    }
    else {
        return contentTitle;
    }
}
function viewDiffLink(diff) {
    if (diff.public_url) {
        return `
[Preview documentation](${diff.public_url})
`;
    }
    else {
        return '';
    }
}
//# sourceMappingURL=diff.js.map