export function packInteger(integer, size = 4, direction = false) {
    let data = ''
    for(var idx = 0; idx < size; idx++) {
        if(direction) {
            data+= String.fromCharCode((integer >> ((size - idx - 1) * 8)) & 0xff)
        } else {
            data+= String.fromCharCode((integer >> (idx * 8)) & 0xff)
        }
    }
    return data
}
/*
export function unpackInteger(str, direction = false) {
    let integer = 0
    for(var idx = 0; idx < str.length; idx++) {
        if(direction) {
            integer+= str.charCodeAt(-1 * (idx + 1))
        }
    }
}*/