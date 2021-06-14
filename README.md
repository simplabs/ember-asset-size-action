# Ember Asset Size

This action will calculate the diff in asset size for your main JS files and CSS files for each PR. It will then comment with the change in asset size on each PR.

## Example usage

Create a file named `.github/workflows/ember-assets.yml` in your repo and add the following:

```yaml
name: Ember Asset Sizes

on: [pull_request]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    - uses: simplabs/ember-asset-size-action@v2
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

By default `ember-asset-size-action` will update the existing comment when the PR has been updated in any way.

If you want to disable this behaviour and have the action create a new comment every time, you can pass the input `update-comments` with a value `false`.

```yaml
- uses: simplabs/ember-asset-size-action@v2
  with:
    repo-token: "${{ secrets.GITHUB_TOKEN }}"
    update-comments: "no" # apparently booleans don't work as expected
```

Note: as this action requires access to the "base" commit of a PR branch we need to fetch the whole repo by adding `fetch-depth: 0` to the `actions/checkout` configuration.

If you would like to follow discussion on this problem you can find the issue on github here: https://github.com/actions/checkout/issues/93

### Running Github Action on demand with labels

If running this Github Action on every push is not suitable, you can configure it to run only when a certain label is attached to pull request, for example when you add the `ember-asset-size` label:

```yaml
on:
  pull_request:
    types: [opened, synchronize, labeled] # necessary to watch for when the label is added

jobs:
  build:
    if: ${{ contains(github.event.pull_request.labels.*.name, 'ember-asset-size') }}

    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    - uses: simplabs/ember-asset-size-action@v2
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

This technique isn't anything special to ember-asset-size-tracking, it is a feature of GitHub actions, and you can read more about it in [their official documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif)

### Configuring your private npm package registry token

If your app depends on private npm packages, you will need to make sure that you have the correct NPM_TOKEN available to your repo so that the `npm install` or `yarn install` step will succeed.

More details on how to [configure your npm registry token](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow#create-and-check-in-a-project-specific-npmrc-file).

The following example allows you to **not** commit the `.npmrc` to your repo, and instead creates it just before it is needed.

```yaml
name: Ember Asset Sizes

on: [pull_request]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    - run: echo //registry.npmjs.org/:_authToken=$\{NPM_TOKEN\} >> .npmrc
    - uses: simplabs/ember-asset-size-action@v2
      env:
        NPM_TOKEN: "${{ secrets.YOUR_REPO_NPM_TOKEN }}"
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### Displaying total asset sizes

If you'd like the PR comment to display total asset sizes for the PR's build, not just the diff compared to the base branch, you can use the `show-totals` option:

```yaml
- uses: simplabs/ember-asset-size-action@v1
  with:
    repo-token: "${{ secrets.GITHUB_TOKEN }}"
    show-totals: "yes"
```

## License

Ember Simple Auth is developed by and &copy; [simplabs GmbH](http://simplabs.com) and contributors. It is released under the [MIT License](LICENSE).