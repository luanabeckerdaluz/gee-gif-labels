var text = require('users/gena/packages:text')
var style = require('users/gena/packages:style')
  
exports.gif_label = function(params){
  // Verify if params has all keys
  var requiredKeys = [
    'col', 'ROI', 'geom_label_position', 'vis_params',
    'backgroundColor', 'backgroundValue', 'sensorScale',
    'proj', 'fontScale', 'col_label_attribute', 
    'labelParams', 'gifParams'
  ];
  var allKeysPresent = requiredKeys.every(function(key) {
    return params.hasOwnProperty(key);
  });
  if (!allKeysPresent) {
    throw new Error('ERROR: params needs to have all the following keys: ' + requiredKeys.join(', '));
  }

  /* Force fontSize = 64
    This is done in order to have a good resolution font. 
    Its size is actually controlled by fontSize parameter 
    (which is the 'scale' parameter in text.draw function)
  */
  params.labelParams.fontSize = 64
  
  // For each col image, apply visualize and blend with label
  var blended_col = params.col.map(function(img){
    var vis_img = img
      .reproject(params.proj, null, params.sensorScale)
      .visualize(params.vis_params)
      
    var label = text.draw(
      img.get(params.col_label_attribute),
      params.geom_label_position, 
      params.fontScale,
      params.labelParams
    )
    
    return vis_img
      .blend(label)
      .copyProperties(img, [params.col_label_attribute])
  })
  
  // Force set same proj on gif params
  params.gifParams.crs = params.proj
  // Force set same ROI gif params
  params.gifParams.ROI = params.geom_label_position
  
  // Generate GIF
  print(
    ui.Thumbnail({
      image: blended_col, 
      params: params.gifParams
    })
  )
}
