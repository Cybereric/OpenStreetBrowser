var OverpassLayer = require('overpass-layer')
var translations = null
var tagLang = null

OverpassLayer.twig.extendFunction('tagTrans', function () {
  return tagTranslationsTrans.apply(this, arguments)
})
OverpassLayer.twig.extendFunction('tagTransList', function () {
  return tagTranslationsTransList.apply(this, arguments)
})
OverpassLayer.twig.extendFunction('localizedTag', function (tags, id) {
  if (tagLang && id + ':' + tagLang in tags) {
    return tags[id + ':' + tagLang]
  }

  return tags[id]
})

function tagTranslationsTrans () {
  var ret = null
  var fallback = null

  tag = arguments[0]
  value = undefined
  count = undefined
  if (arguments.length > 1) {
    value = typeof arguments[1] === 'undefined' ? null : arguments[1]
  }
  if (arguments.length > 2) {
    count = arguments[2]
  }

  if (typeof value === 'undefined') {
    return lang('tag:' + tag, count)
  } else {
    return lang('tag:' + tag + '=' + value, count)
  }
}

function tagTranslationsTransList (key, values) {
  if (typeof values === 'undefined') {
    return null
  }

  values = values.split(';')

  values = values.map(function (key, value) {
    return tagTranslationsTrans(key, value.trim())
  }.bind(this, key))

  if (values.length > 1)
    return values.slice(0, -1).join(', ') + ' and ' + values.slice(-1)[0]


  return values[0]
}

module.exports = {
  trans: tagTranslationsTrans,
  setTagLanguage: function (lang) {
    tagLang = lang
  }
}