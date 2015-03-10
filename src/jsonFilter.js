/* !
 * filterBox.js
 * https://github.com/kawasako/jsonFilter.js
 * > String.prototype.to_ff
 * > http://mashimonator.weblike.jp/storage/library/20110916_002/demo/convertKana/js/half2full.js
 *
 * Copyright (c) 2015 Kohei Kawasaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/MIT
 */

String.prototype.to_ff = function() {
  var str = '';
  var full = ['。', '、', '「', '」', '・', 'ー', '　',
    'ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ェ', 'エ', 'ォ', 'オ',
    'カ', 'ガ', 'キ', 'ギ', 'ク', 'グ', 'ケ', 'ゲ', 'コ', 'ゴ',
    'サ', 'ザ', 'シ', 'ジ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ',
    'タ', 'ダ', 'チ', 'ヂ', 'ッ', 'ツ', 'ヅ', 'テ', 'デ', 'ト', 'ド',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'バ', 'パ', 'ヒ', 'ビ', 'ピ', 'フ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', 'ヴ'
  ];
  var half = ['｡', '､', '｢', '｣', '･', 'ｰ', ' ',
    'ｧ', 'ｱ', 'ｨ', 'ｲ', 'ｩ', 'ｳ', 'ｪ', 'ｴ', 'ｫ', 'ｵ',
    'ｶ', 'ｶﾞ', 'ｷ', 'ｷﾞ', 'ｸ', 'ｸﾞ', 'ｹ', 'ｹﾞ', 'ｺ', 'ｺﾞ',
    'ｻ', 'ｻﾞ', 'ｼ', 'ｼﾞ', 'ｽ', 'ｽﾞ', 'ｾ', 'ｾﾞ', 'ｿ', 'ｿﾞ',
    'ﾀ', 'ﾀﾞ', 'ﾁ', 'ﾁﾞ', 'ｯ', 'ﾂ', 'ﾂﾞ', 'ﾃ', 'ﾃﾞ', 'ﾄ', 'ﾄﾞ',
     'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
     'ﾊ', 'ﾊﾞ', 'ﾊﾟ', 'ﾋ', 'ﾋﾞ', 'ﾋﾟ', 'ﾌ', 'ﾌﾞ', 'ﾌﾟ', 'ﾍ', 'ﾍﾞ', 'ﾍﾟ', 'ﾎ', 'ﾎﾞ', 'ﾎﾟ',
     'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
     'ｬ', 'ﾔ', 'ｭ', 'ﾕ', 'ｮ', 'ﾖ',
     'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ｦ', 'ﾝ', 'ｳﾞ'
  ];
  var reg = new RegExp('[' + half.join('') +']', 'g');
  var mapping = [];
  for (var i = 0, l = half.length; i < l; i++) {
    mapping[half[i]] = full[i];
  };
  for ( var i=0, len=this.length; i<len; i++ ) {
    if ( this.charCodeAt(i) >= 0x0021 && this.charCodeAt(i) <= 0x007e ) {
      str += String.fromCharCode(0xff01+(this.charCodeAt(i)-0x0021));
    } else {
      str += this.charAt(i);
    }
  }
  str = str.replace(reg, function(idx){
    return mapping[idx];
  }).replace(/[ぁ-ん]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
  return str.toUpperCase();
};

var JSONFilter = function() {};
JSONFilter.prototype = {
  init: function(data) {
    this.data = data;
    this.formatData = this.createFormatData();
  },
  createFormatData: function() {
    if(typeof this.data !== 'object') { return console.log('第一引数は配列である必要があります。'); }
    var prop;
    this.formatData = [];
    for(var i = this.data.length - 1; i >= 0; i--) {
      this.formatData[i] = {};
      for (prop in this.data[i]) {
        if (this.data[i].hasOwnProperty(prop)) {
          this.formatData[i][prop] = this.data[i][prop].to_ff();
        }
      }
    };
    return this.formatData;
  },
  filter: function(str) {
    if (!str) { return this.data; }
    var prop, target, data;
    var result = [];
    str = str.to_ff();
    // console.log(str); // :debug
    for (var i = this.formatData.length - 1; i >= 0; i--) {
      target = null;
      for (prop in this.data[i]) {
        // console.log(this.data[i].hasOwnProperty(prop)); // :debug
        if(this.data[i].hasOwnProperty(prop) && typeof this.data[i][prop] == 'string') {
          // console.log(str); // :debug
          // console.log(prop); // :debug
          // console.log(this.formatData[i][prop].indexOf(str)); // :debug
          if(-1 < this.formatData[i][prop].indexOf(str)) { target = prop; }
        }
      }
      if(target) {
        data = this.data[i];
        result.push(data);
      }
    };
    return result;
  },
  suggest: function(str) {
  },
  all: function() {
    return this.data;
  },
  full: function(item) {
    // :todo 並び順がある場合を考慮する
    var prop;
    var result = '';
    for(prop in item) {
      result += item[prop] + ' ';
    }
    return result;
  }
};
