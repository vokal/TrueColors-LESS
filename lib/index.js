"use strict";

var fs = require( "fs" );
var zip = require( "adm-zip" );

var colors = {};

module.exports = colors;

colors.translatePath = function ( filePath, callback )
{
    var zipFile = new zip( filePath );
    var zipEntries = zipFile.getEntries();

    var flatFiles = zipEntries.filter( function ( entry )
    {
        return !!entry.entryName.match( /flat-data\.json/ );
    } );

    if( flatFiles.length === 1 )
    {
        var flatData = JSON.parse( flatFiles[ 0 ].getData().toString( "utf8" ) );
        return colors.translate( flatData, callback );
    }

    callback( new Error( "Couldn't parse file" ) );
};

colors.translate = function ( flatData, callback )
{
    var doc = new colors.lessModel();

    doc.children.push( "/* True Colors Conversion */" );
    doc.children.push( "\n/* Colors */" );

    flatData.colors.forEach( function ( color )
    {
        var property = new colors.lessModel();
        property.name = "@" + color.name;
        property.value = colors.convertColor( color.rgba );
        doc.children.push( property );
    } );

    doc.children.push( "\n/* Metrics */" );

    flatData.metrics.forEach( function ( metric )
    {
        var property = new colors.lessModel();
        property.name = "@" + metric.name;
        property.value = metric.value + "px";
        doc.children.push( property );
    } );

    doc.children.push( "\n/* Fonts */" );

    flatData.fonts.forEach( function ( font )
    {
        var cls = new colors.lessModel();
        cls.name = "." + font.name;
        doc.children.push( cls );

        var family = new colors.lessModel();
        family.name = "font-family";
        family.value = font.font_name;
        cls.children.push( family );

        if( font.size_path.length )
        {
            var size = new colors.lessModel();
            size.name = "font-size";
            size.value = font.size_path[ 0 ];
            cls.children.push( size );
        }

        if( font.color_path.length )
        {
            var color = new colors.lessModel();
            color.name = "color";
            color.value = font.color_path[ 0 ];
            cls.children.push( color );
        }
    } );

    callback( null, doc.toString( 0 ) );
};

colors.convertColor = function ( hex )
{
    if( hex.substring( 7 ) === "FF" )
    {
        return hex.substring( 0, 7 );
    }

    var red = parseInt( hex.substring( 1, 3 ), 16 ).toString();
    var green = parseInt( hex.substring( 3, 5 ), 16 ).toString();
    var blue = parseInt( hex.substring( 5, 7 ), 16 ).toString();
    var alpha = parseInt( hex.substring( 7, 9 ), 16 ).toString() / 256;

    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
};

colors.lessModel = function ()
{
    this.name = "";
    this.value = "";
    this.children = [];

    var acc = [];

    this.toString = function ( level )
    {
        if( this.value )
        {
            acc.push( tabs( level ) + this.name + ": " + this.value + ";" );
        }
        else if( this.children.length )
        {
            if( level )
            {
                acc.push( this.name + " {" );
            }

            this.children.forEach( function ( child )
            {
                acc.push( child.toString( level + 1 ) );
            } );

            if( level )
            {
                acc.push( "}" );
            }
        }

        return acc.join( "\n" );
    };
};

var tabs = function ( length )
{
    var acc = [];

    for(var i = 1; i < length; i++ )
    {
        acc.push( "\t" );
    }

    return acc.join( "" );
};
