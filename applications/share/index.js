const request = require( 'request' )

module.exports = yacona => {
    
    const yaml = yacona.moduleLoader( 'yaml' )
    
    yacona.addRoute( './public' )
    yacona.createWindow( {
        setMenu: null,
        isResizable: false,
        openDevTools: false,
        width: 800
    } )
    
    const checkConfig = () => yacona.config.check( yacona.getName(), 'config.yaml' )
    const loadConfig  = () => yaml.parser( yacona.config.load( 'config.yaml' ) )
    
    yacona.setSocket( 'getMyProfile', socket => {
        yacona.emit( 'api/twitter/profile', profile => {
            if( profile.profile_image_url.indexOf( '_normal' ) !== -1 )
                profile.profile_image_url = profile.profile_image_url.replace( /_normal/, '' )
                socket.emit( 'myProfile', {
                    name       : profile.name,
                    id         : profile.id_str,
                    screen_name: profile.screen_name,
                    icon       : profile.profile_image_url
                } )
        } )
    } )
    
    yacona.setSocket( 'getUrl', socket => {
        if( checkConfig() )
            socket.emit( 'url', loadConfig() )
        else
            socket.emit( 'url', { server_url: 'http://localhost:3000' } )
    } )
    
    yacona.setSocket( 'saveUrl', ( socket, value ) => {
        let config = {}
        if( checkConfig() )
            config = loadConfig()
        config.server_url = value
        let status = yacona.config.save( 'config.yaml', yaml.dump( config ) )
        
        if( status.status === true ) 
            socket.emit( 'saved', true )
        else 
            socket.emit( 'reject', true )
    } )
    
    yacona.setSocket( 'getList', socket => {
        let list = []
        let l = yacona.documents.list( 'log', './' )
        for( let i=0; i<l.length; i++ )
            if( l[i].toLowerCase() !== '.ds_store' && l[i].toLowerCase() !== 'thumbs.db' ) 
                list.push( l[i] )
        socket.emit( 'list', list )
    } )
    
    yacona.setSocket( 'share', ( socket, value ) => {
        
        const unknown = () => socket.emit( 'reject', 'Unknown server. Please check server setting' )
        
        if( checkConfig() ){
            let server_url = loadConfig().server_url
            if( server_url ){
                server_url += '/report'
                
                let user = yacona.emit( 'api/twitter/me' )
                let data = {
                    user: {
                        screen_name: user.screen_name,
                        id: user.id
                    },
                    identifier: yacona.emit( 'api/share/getIdentifier' ),
                    data: JSON.parse( yacona.documents.load( 'log', value + '/statuses.json' ) )
                }
                
                request.post( {
                    uri: server_url,
                    form: JSON.stringify( data ),
                    json: false
                }, ( error, response, body ) => {
                    if( error !== null || response.statusCode !== 200 ){
                        yacona.emit( 'api/notify', 'Rejected' )
                        socket.emit( 'reject', 'Bad request' )
                    } else {
                        yacona.emit( 'api/notify', 'Shared' )
                        socket.emit( 'shared', true )
                    }
                } )
            } else unknown()
        } else unknown()

    } )
    
}