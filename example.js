/**
* Copyright (c) Luana Becker da Luz 2026
* 
* Luana Becker da Luz
* luanabeckerdaluz@gmail.com
* ___________________________________________________________________
* 
* This code contains 3 examples of how to use GIF label funcitonality
*
* You can adapt these examples to create gifs using image properties
* labels!
*/

// Region of Interest (ROI)
var ROI_FC = ee.FeatureCollection("projects/ee-luanabeckerdaluz/assets/paper2NPP/shapefiles/shpMesoregionRS")
var ROI = ROI_FC.geometry()
Map.centerObject(ROI)
Map.addLayer(ROI, {}, 'ROI')

// Set geometry where gif label will be placed
var coord_label_position = ee.Geometry.Point([-52.0333, -27.1757]);
Map.addLayer(coord_label_position, {}, 'coord_label_position')

// Set scale (m/px) for using when reprojecting
var SCALE_M_PX = 250

// Create a ROI mask to use updateMask() inside map
// ...function instead of use clip() function 
var ROIMask = ee.Image.constant(1).clip(ROI)

print("------- Collections -------")

// NDVI collection
var collectionNDVI = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterBounds(ROI)
  .filterDate('2018-01-01', '2019-11-18')
  .select('NDVI')
  .map(function(img){
    return img
      .multiply(0.0001)     // Apply band scale
      .reproject('EPSG:4326', null, SCALE_M_PX)
      .updateMask(ROIMask)  // Apply ROI mask
      .clip(ROI.bounds())   // Clip tile to ROI.bounds()
      .set("date", img.date().format("yyyy-MM-dd"))
  })
print("collectionNDVI", collectionNDVI)
Map.addLayer(collectionNDVI.first(), {}, 'collectionNDVI img1')


/*---------------------------------------------------------
  Example 1:
    Visualize using black background with unmask(0) and
    ... set this 0 value as 'black' inside palette.
---------------------------------------------------------*/
var col_black_background = collectionNDVI.map(function(img){
    return img
      .unmask(0)
      .visualize({
        min:0,
        max:1.0,
        palette:['black', 'lightgreen','darkgreen','yellow','orange','red','darkred']
      })
      .copyProperties(img)
  })
var blackBackgroundTextColor = "white"
print("col_black_background", col_black_background)
Map.addLayer(col_black_background.first(), {}, 'col_black_background img1')


/*---------------------------------------------------------
  Example 2:
    Visualize using white background with unmask(0) and
    ... set this 0 value as 'white' inside palette.
    
    WARNING:
      Sometimes, the GEE gif generator can add yellow borders
      ... to the GIF. To overcome this problem, you can set 
      ... background color to "#fcfcfc" instead of "white" 
      ... (#ffffff). This will reduce yellow borders!
---------------------------------------------------------*/
var col_white_background = collectionNDVI.map(function(img){
    return img
      .unmask(0)
      .visualize({
        min:0,
        max:1.0,
        palette:['white', 'lightgreen','darkgreen','yellow','orange','red','darkred']
      })
      .copyProperties(img)
  })
var whiteBackgroundTextColor = "black"
print("col_white_background", col_white_background)
Map.addLayer(col_white_background.first(), {}, 'col_white_background img1')


/*---------------------------------------------------------
  Example 3:
    If you do not use unmask(0) and also not specify this 
    ... color inside palette, the GIF also works!
---------------------------------------------------------*/
var col_no_background = collectionNDVI.map(function(img){
    return img
      .visualize({
        min:0.2,
        max:1.0,
        palette:['lightgreen','darkgreen','yellow','orange','red','darkred']
      })
      .copyProperties(img)
  })
var no_bg_TextColor = "white"
print("col_no_background", col_no_background)
Map.addLayer(col_no_background.first(), {}, 'col_no_background img1')


/*---------------------- IMPORTANT ------------------------

-> The GIF will be generated the same way you generate a 
   ... normal gif, except it contains a label placed in 
   ... the point coordinate you specify in the variable
   ... 'coord_label_position'. 
-> This collections must be already applied visualize().
-> We reccomend you to Map.addLayer the first image of 
   .. your collection before create gif. This will help
   ... you to check if the image bounds are correct and 
   ... if the visualize() function worked perfectly.
-> You can set gif bounds inside variable 'gifParams.region'.

---------------------------------------------------------*/

print("----------- GIFs -----------")
var utils = require('users/luanabeckerdaluz/GEEtools:gif_label')

// ----------------------------------------
// Gif for collection with black background
// ----------------------------------------
print("Black background GIF:")
utils.gif_label({
  col: col_black_background,
  coord_label_position: coord_label_position,
  fontScale: 250,
  col_label_attribute: "date",
  labelParams: {
    fontType: 'Arial',
    // Here you can set text and outline colors
    textColor: blackBackgroundTextColor,
    outlineColor: 'black',
    outlineWidth: 1,
    outlineOpacity: 0.7
  },
  gifParams: {
    dimensions: 768,
    framesPerSecond: 10,
    crs: "EPSG:4326",
    region: ROI.bounds()
  }
})

// ------------------------------------------
// Gif for collection with "white" background
// ------------------------------------------
print("White background GIF:")
utils.gif_label({
  col: col_white_background,
  coord_label_position: coord_label_position,
  fontScale: 250,
  col_label_attribute: "date",
  labelParams: {
    fontType: 'Arial', 
    // Here you can set text and outline colors
    textColor: whiteBackgroundTextColor,
    outlineColor: 'black',
    outlineWidth: 1,
    outlineOpacity: 0.7
  },
  gifParams: {
    dimensions: 768,
    framesPerSecond: 10,
    crs: "EPSG:4326",
    region: ROI.bounds()
  }
})

// ------------------------------------------
// Example using "gif_label_return" function, 
// ... which returns a variable.
// ------------------------------------------
var no_bg_gif = utils.gif_label_return({
  col: col_no_background,
  coord_label_position: coord_label_position,
  fontScale: 250,
  col_label_attribute: "date",
  labelParams: {
    fontType: 'Arial', 
    // Here you can set text and outline colors
    textColor: no_bg_TextColor,
    outlineColor: 'black',
    outlineWidth: 1,
    outlineOpacity: 0.7
  },
  gifParams: {
    dimensions: 768,
    framesPerSecond: 10,
    crs: "EPSG:4326",
    region: ROI.bounds()
  }
})
print("GIF using gif_label_return function",
      "...and no background:", 
      no_bg_gif)
