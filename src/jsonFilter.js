/* !
 * jsonFilter.js
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

// Class::JSONFilter

var JSONFilter = function() {};
JSONFilter.prototype = {
  init: function(data, kana) {
    this.data = data;
    this.kana = kana ? kana : {};
    this.formatData = this.createFormatData();
    this.result = [];
  },
  setKana: function(basePropName, kanaPropName) {
    this.kana['kanaPropName'] = basePropName;
    return this.kana;
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
  createResultData: function(item, score, keys) {
    var data = [];
    return {
      data: item,
      score: score,
      keys: keys
    }
  },
  sortByScore: function(list) {
    return list.sort(function(a, b){
      return (a.score > b.score);
    });
  },
  spaceSplit: function(str) {
    str = str.replace(/\　/g, ' ');
    str = str.replace(/\ $/, '');
    str = str.split(' ');
    return str;
  },
  filter: function(str) {
    if (!str) { return this.data; }
    var prop, keys, data, count;
    this.result = [];
    str = str.to_ff();
    str = this.spaceSplit(str);

    // console.log(str); // :debug
    for (var i = this.formatData.length - 1; i >= 0; i--) {
      keys = [];
      count = 0;
      for (var j = str.length - 1; j >= 0; j--) {
        for (prop in this.data[i]) {
          // console.log(this.data[i].hasOwnProperty(prop)); // :debug
          if(this.data[i].hasOwnProperty(prop) && typeof this.data[i][prop] == 'string') {
            // console.log(str); // :debug
            // console.log(prop); // :debug
            // console.log(this.formatData[i][prop].indexOf(str)); // :debug
            if(str[j] && 0 == this.formatData[i][prop].indexOf(str[j])) {
              if(prop in this.kana) { prop = this.kana[prop]; }
              keys.push(prop);
              count++;
            }
            // :todo 検索位置も加味したscore評価にする
          };
        }
      }
      if(str.length <= count) {
        data = this.createResultData(this.data[i], count, keys);
        this.result.push(data);
      }
    };
    this.result = this.sortByScore(this.result);
    return this.result;
  },
  all: function() {
    return this.data;
  },
  full: function(item) {
    // :todo 並び順がある場合を考慮する
    var prop;
    var result = '';
    for(prop in item.data) {
      result += item.data[prop] + ' ';
    }
    return result;
  }
};

// Class::AutoComplete

var AutoComplete = function() {};
AutoComplete.prototype = {
  init: function(jf, target, input, template) {
    if(typeof template == 'undefined') {
      this.template = '<div class="auto-complete-item">{{text}}</div>';
    } else {
      this.template = template;
    }
    this.jf = jf;
    this.target = target;
    this.input = input;
    this.items = [];
    this.create();
    this.setEvent();
    this.currentIndex = -1;
  },
  create: function() {
    var _this = this;
    this.list = document.createElement('div');
    this.list.className = 'auto-complete-list';
    // this.list.style.border = '1px solid #eee';
    this.list.style.position = 'absolute';
    this.list.style.zIndex = 99;
    this.list.style.fontSize = '12px';
    this.list.style.background = '#fff';
    this.list.style.boxShadow = '1px 1px 3px rgba(0,0,0,0.5)';
    this.hide();
    this.target.appendChild(this.list);
  },
  setEvent: function() {
    var _this = this;
    // hide list
    this.list.onclick = function() { _this.hide(); }
    if(typeof document.addEventListener !== 'undefined') {
      document.addEventListener('click', function(){　_this.hide();　});
    }
    // cursor list
    this.input.onkeyup = function() {
      // console.log(event.keyCode);
      if (event.keyCode == 40 && _this.currentIndex < _this.items.length) {
        if(_this.currentIndex in _this.items) { _this.items[_this.currentIndex].style.backgroundColor = '#fff'; }
        _this.currentIndex++;
        if(_this.currentIndex in _this.items) { _this.items[_this.currentIndex].style.backgroundColor = '#cef'; }
        return false;
      }else if (event.keyCode == 38 && _this.currentIndex > -1) {
        if(_this.currentIndex in _this.items) { _this.items[_this.currentIndex].style.backgroundColor = '#fff'; }
        _this.currentIndex--;
        if(_this.currentIndex in _this.items) { _this.items[_this.currentIndex].style.backgroundColor = '#cef'; }
        return false;
      }else if (event.keyCode == 13 && _this.currentIndex in _this.items){
        _this.items[_this.currentIndex].onclick();
      }else {
        var str, result;
        str = _this.jf.spaceSplit(this.value);
        str = str[str.length-1];
        result = _this.jf.filter(str);
        _this.render(result);
      }
    }
  },
  hide: function() {
    this.list.style.display = 'none';
  },
  render: function(items) {
    if (!items) { return false; }
    if (items.length < 1) { return false; }
    if (!('keys' in items[0])) { return false; }
    var item, count;
    var _this = this;
    this.items = [];
    this.currentIndex = -1;
    count = 0;
    this.list.innerHTML = '';
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; items[i].keys.length > j; j++) {
        item = document.createElement('div');
        item.className = 'auto-complete-item item-'+ i + '-' + j;
        item.style.padding = '5px';
        if(count%2 == 1) { item.style.background = '#eee' };
        item.innerHTML = items[i].data[items[i].keys[j]];
        item.data = items[i].data[items[i].keys[j]];
        item.onclick = function() {
          var result;
          result = _this.jf.spaceSplit(_this.input.value)
          result[result.length-1] = this.data;
          _this.input.value = result.join('\ ');
          _this.hide();
        }
        this.items.push(item);
        this.list.appendChild(item);
        count++;
      };
    };
    this.list.style.display = 'block';
  }
};
