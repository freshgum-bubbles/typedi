cp LICENSE build/LICENSE
cp README.md build/README.md   

jq 'del(.devDependencies) | del(.scripts)' package.json > build/package.json
pnpm publish --access public --no-git-checks --force
