function existsOrError(value, msg) {
    if (!value) throw msg
    if (Array.isArray(value) && value.length === 0) throw msg
    if (typeof value === 'string' && !value.trim()) throw msg
}

function notExistsOrError(value, msg) {
    try {
        existsOrError(value, msg)
    } catch (msg) {
        return
    }
    throw msg
}

function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg
}
function notEqualsOrError(valueA, valueB, msg) {
    if (valueA === valueB) throw msg
}
function checksTheUser (user, id) {
    if (user.admin || !id) {
        return true
    }
    if (user.id !== id) {
        return false
    }
    return true
}
module.exports = {
    equalsOrError, 
    notEqualsOrError, 
    existsOrError, 
    notExistsOrError, 
    checksTheUser 
}