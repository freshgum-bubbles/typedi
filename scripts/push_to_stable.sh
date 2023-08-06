CURRENT_BRANCH=$(git branch --show-current)
DEVELOP_BRANCH_NAME="develop"
STABLE_BRANCH_NAME="master"
CURRENT_DEVELOP_NPM_VERSION=$(cat package.json | jq '.version')

# Ensure the script isn't being run from the stable branch.
# We wouldn't want to release stable to stable.
if [[ "$CURRENT_BRANCH" == "$STABLE_BRANCH_NAME" ]]; then
    echo "This script cannot be run from the stable branch."
    exit 1
fi

# Also ensure we're not running from an alternate branch.
if [[ "$CURRENT_BRANCH" != "$DEVELOP_BRANCH_NAME" ]]; then
    echo "This script cannot be run from a fork. Please checkout the develop branch and try again."
    exit 1
fi

# Now, time to push to stable.
git checkout $STABLE_BRANCH_NAME

if [[ "$?" != "0" ]]; then
    echo "Git checkout to stable failed. This may be because of an unclean working tree."
    exit 1
fi

CURRENT_STABLE_NPM_VERSION=$(cat package.json | jq '.version')

# Make sure the NPM version has been incremented, as otherwise NPM will refuse
# to push the package to the registry.
if [[ "$CURRENT_STABLE_NPM_VERSION" == "$CURRENT_DEVELOP_NPM_VERSION" ]]; then
    echo "The NPM version in the develop branch has not been updated."

    # Go back to the develop branch.
    git checkout $DEVELOP_BRANCH_NAME

    exit 1
fi

# Make sure we're working with the most up-to-date version of develop.
git fetch origin $DEVELOP_BRANCH_NAME

# The "theirs" part automatically resolves merge conflicts by accepting the changes from develop.
# Remember that, in this context, we're in the master branch, so "theirs" refers to the develop branch.
git merge -s recursive -X theirs origin/$DEVELOP_BRANCH_NAME

# Unstage the package.json file, so we can commit it into a separate commit.
# This makes it easier to delineate releases in the commit log.
git reset -- package.json
git reset -- pnpm-lock.yaml

git commit -m "release(npm): release TypeDI v$CURRENT_DEVELOP_NPM_VERSION"

git checkout $DEVELOP_BRANCH_NAME
