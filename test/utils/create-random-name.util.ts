const UID_PREFIX = 'uid-';
let counter = 0;

export function createRandomUid () {
    return `${UID_PREFIX}${counter++}`;
}
