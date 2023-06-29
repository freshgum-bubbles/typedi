CURRENT_BRANCH=$(git branch --show-current)
STABLE_BRANCH_NAME="master"
CURRENT_DEVELOP_NPM_VERSION=$(cat package.json | jq '.version')

# Ensure the script isn't being run from the stable branch.
# We wouldn't want to release stable to stable.
if [ "$CURRENT_BRANCH" -eq "stable" ]; then
    echo "This script cannot be run from the stable branch."
    exit 1
fi

# Also ensure we're not running from an alternate branch.
if [ "$CURRENT_BRANCH" -ne "develop" ]; then
    echo "This script cannot be run from a fork. Please checkout the develop branch and try again."
    exit 1
fi

# Now, time to push to stable.
git checkout $STABLE_BRANCH_NAME

if [ "$?" -ne "0" ]; then
    echo "Git checkout to stable failed. This may be because of an unclean working tree."
    exit 1
fi

CURRENT_STABLE_NPM_VERSION=$(cat package.json | jq '.version')

# Make sure the NPM version has been incremented, as otherwise NPM will refuse
# to push the package to the registry.
if [ "$CURRENT_STABLE_NPM_VERSION" -eq "$CURRENT_DEVELOP_NPM_VERSION" ]; then
    echo "The NPM version in the develop branch has not been updated."

    # Go back to the develop branch.
    git checkout develop

    exit 1
fi

# Make sure we're working with the most up-to-date version of develop.
git fetch origin develop

git merge --squash origin/develop --message "merge: Release $CURRENT_DEVELOP_NPM_VERSION as stable" -Xtheirs

# Finally, publish the package to the registry.
pnpm publish

# Go back to the develop branch.
# git checkout develop
