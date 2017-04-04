const yacona = require( 'yacona' )
const utility = yacona.moduleLoader( 'utility' )

let app = 'spotlight'

yacona.setPrefix( app )
yacona.addClientModule( 'logo', './resources/img/icon.ico' )

yacona.addClientModule( 'base', './resources/css/base.css' )
yacona.addClientModule( 'fonts', './resources/css/fonts.css' )
yacona.addClientModule( 'quicksand', './resources/css/fonts/Quicksand/Quicksand-Regular.ttf' )

yacona.addClientModule( 'preload', './resources/js/preload.js' )
yacona.addClientModule( 'bind', './resources/js/bind.js' )
yacona.addClientModule( 'common', './resources/js/common.js' )

yacona.localAppLoader( utility.fixPath( __dirname, 'controller' ) )