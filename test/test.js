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

    it( "should process a file", function ( done )
    {
        var fontString = ".fullMedText {\n"
            + "\tfont-family: Cantarell-Regular;\n"
            + "\tfont-size: globalFontLg;\n"
            + "\tcolor: White;\n"
            + "}";

        var assetPath = path.join( process.cwd(), "./test/assets/ht.truecolors" );
        colors.translatePath( assetPath, function ( err, result )
        {
            assert( !err );
            assert.equal( result.indexOf( "@Framework: #1898F6;" ) !== -1, true  );
            assert.equal( result.indexOf( "@globalFontReg: 14px;" ) !== -1, true  );
            assert.equal( result.indexOf( fontString ) !== -1, true  );
            done();
        } );
    } );
} );
