"use strict";

var assert = require( "assert" );
var colors = require( "../lib" );
var path = require( "path" );


describe( "TrueColors", function ()
{
    it( "should convert colors", function ()
    {
        assert.equal( colors.convertColor( "#FFCCAAFF" ), "#FFCCAA" );
        assert.equal( colors.convertColor( "#FFFE1000" ), "rgba(255,254,16,0)" );
    } );

    it( "should slugify", function ()
    {
        assert.equal( colors.slugify( [ "Primary", "Button*Text", "&Thing" ] ), "primary-button-text-thing" );
    } );

    it( "should process a file", function ( done )
    {
        var fontString = ".full-med-text() {\n"
            + "\tfont-family: Cantarell-Regular;\n"
            + "\tfont-size: @global-font-lg;\n"
            + "\tcolor: @white;\n"
            + "}";

        var assetPath = path.join( process.cwd(), "./test/assets/ht.truecolors" );
        colors.translatePath( assetPath, function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result.indexOf( ".user-cards-geoteriary-text() {" ) !== -1, true );
            assert.equal( result.indexOf( "@framework: #1898F6;" ) !== -1, true  );
            assert.equal( result.indexOf( "@global-font-reg: 14px;" ) !== -1, true  );
            assert.equal( result.indexOf( fontString ) !== -1, true  );
            done();
        } );
    } );

    it( "should have err callback when file is missing", function ( done )
    {
        colors.translatePath( "/readme.md", function ( err )
        {
            assert( !!err );
            done();
        } );
    } );
} );
