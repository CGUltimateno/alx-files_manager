import sha1 from 'sha1';

function hashPassword(password) {
    return sha1(password);
}
const Utils = {
    hashPassword,
};

export default Utils;