var text = require('users/gena/packages:text')
var style = require('users/gena/packages:style')
  
exports.gif_label = function(params){
  // Verify if params has all keys
  var requiredKeys = [
    'col', 'ROI', 'geom_label_top_left', 'vis_params',
    'sensorScale', 'fontScale', 'col_label_attribute',
    'labelParams', 'gifParams'
  ];
  var allKeysPresent = requiredKeys.every(function(key) {
    return params.hasOwnProperty(key);
  });
  if (!allKeysPresent) {
    throw new Error('Error: params needs to have all the following keys: col, ROI, geom_label_top_left, vis_params, sensorScale, fontScale, col_label_attribute, labelParams, gifParams');
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
      .reproject('EPSG:4326', null, params.sensorScale)
      .visualize(params.vis_params)
      
    var label = text.draw(
      img.get(params.col_label_attribute),
      params.geom_label_top_left, 
      params.fontScale,
      params.labelParams
    )
    
    return vis_img
      .blend(label)
      .copyProperties(img, [params.col_label_attribute])
  })
  
  // Generate GIF
  print(
    ui.Thumbnail({
      image: blended_col, 
      params: params.gifParams
    })
  )
}
