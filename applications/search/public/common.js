socket.on( 'saved', () => {
    alert( 'Saved' )
    operationBlocker.hide()
} )

socket.on( 'reject', () => {
    alert( 'Already in use' )
    operationBlocker.hide()
} )

const save = () => {

    let name = document.getElementById( 'list_name' ).value
    if( name === '' || name.indexOf( '/' ) !== -1 ) return false

    operationBlocker.show()
    socket.emit( 'save', {
        name: name,
        raw: raw,
        flag: flag,
        meta: meta,
        statuses: statuses
    } )

}

const saveToggle = () => {
    let e = document.getElementById( 'save_field' )
    let s = document.getElementById( 'search_field' )
    let m = document.getElementById( 'toggle' )
    let a = document.getElementById( 's' )
    if( e.style.display === 'block' ){
        m.className = 'menu'
        a.className = 'isRunning'
        e.style.display = 'none'
        s.style.display = 'block'
    } else if( e.style.display === 'none' ){
        m.className = 'menu selected'
        a.className = 'isRunning active'
        e.style.display = 'block'
        s.style.display = 'none'
    }
}

const change = ( num, id ) => {
    let e = document.getElementById( 'n' + num )
    let f = e.getAttribute( 'flag' )
    if( f === 'clean' ){
        flag[num] = 'danger'
        e.style.borderColor = 'rgba( 2, 159, 218, 1 )'
        e.setAttribute( 'flag', 'danger' )
    } else if( f === 'danger' ){
        flag[num] = 'clean'
        e.style.borderColor = 'rgba( 126, 211, 33, 1 )'
        e.setAttribute( 'flag', 'clean' )
    }
}

let raw      = [],
    meta     = [],
    statuses = [],
    flag     = []

let archive = document.getElementById( 'archive' )
let count = -1

socket.on( 'result', result => {
    raw.push( result )

    let isOverlap
    meta.push( result.search_metadata )

    for( let i=0; i<result.statuses.length; i++ ){
        isOverlap = false
        for( let j=0; j<statuses.length; j++ ){
            if( result.statuses[i].id === statuses[j].id ){
                isOverlap = true
                meta[meta.length-1].count--
            }
        }

        if( isOverlap ) continue

        count++
        flag.push( 'danger' )
        statuses.push( result.statuses[i] )

        archive.innerHTML = '<div class="content clearfix" id="n' + count + '" onclick="change( ' + count + ', ' + result.statuses[i].id + ' )" flag="danger">' +
            '<div class="left float_l">' +
            '<img src="' + result.statuses[i].user.profile_image_url + '">' + 
            '</div>' + 
            '<div class="right float_r">' + 
            '<div class="name">' + result.statuses[i].user.name + '</div>' +
            '<div class="screen_name">@' + result.statuses[i].user.screen_name+'</div>' + 
            '<div class="text">' + result.statuses[i].text + '</div>' + 
            '</div>' + 
            '</div>' + archive.innerHTML
    }

    archive.innerHTML = '<div class="title">' + decodeURIComponent( result.search_metadata.query ).replace( /\+/g, ' ' ) + '</div>' + archive.innerHTML
    document.getElementById( 'result' ).style.display = 'block'
    operationBlocker.hide()
} )