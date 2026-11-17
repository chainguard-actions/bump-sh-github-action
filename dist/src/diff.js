import { bumpDiffComment, shaDigest } from './common.js';
export async function run(diff, repo) {
    const digestContent = [diff.markdown];
    if (diff.public_url) {
        digestContent.push(diff.public_url);
    }
    const digest = shaDigest(digestContent);
    const body = buildCommentBody(repo, diff, digest);
    return repo.createOrUpdateComment(body, digest);
}
function buildCommentBody(repo, diff, digest) {
    const emptySpace = '';
    const poweredByBump = '###### _Powered by [Bump.sh](https://bump.sh)_';
    let text = 'No structural change, nothing to display.';
    if (diff.markdown) {
        text = `<details open><summary>Structural change details</summary>

${diff.markdown}

</details>`;
    }
    return [title(diff, docName(diff, repo.doc, repo.hub, repo.branch))]
        .concat([viewDiffLink(diff)])
        .concat([text, emptySpace])
        .concat([poweredByBump, bumpDiffComment(repo.docDigest, digest)])
        .join('\n');
}
function title(diff, docName) {
    const structureTitle = `### 🤖 ${docName} API structural change detected`;
    const contentTitle = `### ℹ️ ${docName} API content change detected`;
    const breakingTitle = `### 🚨 Breaking ${docName} API change detected`;
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
function docName(diff, doc, hub, branch) {
    const docNameFromDiff = diff.doc_name;
    let name;
    if (docNameFromDiff) {
        name = docNameFromDiff;
    }
    else {
        name = [hub, doc].filter((e) => e).join('/');
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    if (branch) {
        name = `${name} (branch: ${branch})`;
    }
    return name;
}
//# sourceMappingURL=diff.js.map