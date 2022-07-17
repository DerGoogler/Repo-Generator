export const workflow = (name: string, email: string, commit_msg: string) => {
  return `name: Generate JSON
on:
  push:
  workflow_dispatch:
  schedule:
    - cron: '0 * * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: actions/setup-python@v2
        with:
          python-version: '3.x'
          architecture: 'x64'

      - name: Setup Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install PyGithub

      - name: Generate JSON
        run: |
          export GIT_TOKEN="\${{ secrets.AUTH_KEY }}"
          python generate.py "\${{ secrets.GITHUB_TOKEN }}" > modules.json

      - name: Commit Changes
        run: |
          git config --global user.email "${email}"
          git config --global user.name "${name}"
          git add modules.json
          git commit -sm "${commit_msg}" || true
          git push || true`;
};
