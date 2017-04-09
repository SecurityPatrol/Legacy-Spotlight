if( document.getElementById( 'profile' ) !== null ){
    socket.emit( 'getMyProfile' )
    socket.on( 'myProfile', profile => {
        document.getElementById( 'profile-icon' ).src = profile.icon
        document.getElementById( 'user_name' ).innerHTML = profile.name
        document.getElementById( 'screen_name' ).innerHTML = '@' + profile.screen_name
        document.getElementById( 'profile-area' ).className = 'fadeIn'
    } )
}

socket.on( 'confirm', ( options ) => {
    if( confirm( options.message + '\nOverwrite ?' ) === true ){
        socket.emit( 'installRequest', { url: options.url, overwrite: true } )
        addLog( options.message )
        addLog( 'Overwrite ? : Yes' )
        addLog( 'Retrying...' )
    } else {
        addLog( options.message )
        addLog( 'Overwrite ? : No' )
        addLog( 'Canceled' )
        addLog( 'Rejected : ' + options.message )
    }
} )

socket.on( 'complete', () => {
    setTimeout( () => {
        if( confirm( 'Application was installed. Reflash ?' ) === true ) window.location.reload()
    }, 1500 )
} )

socket.on( 'log', message => addLog( message ) )

let log = document.getElementById( 'log' )

let log_field = document.getElementById( 'log_field' )
let install_field = document.getElementById( 'install_field' )
log_field.className = 'hide'

const addLog = ( message ) => log.innerHTML += message + '<br>'

let isInstall = false

const install = () => {
    let appPath = document.getElementById( 'url' ).value
    if( appPath === '' ) return false
    install_field.className = 'fadeOut'
    setTimeout( () => {
        install_field.className = 'hide'
        log_field.className = 'show fadeIn'
    }, 1500 )
    addLog( 'Request : ' + appPath )
    socket.emit( 'installRequest', { url: appPath } )
}