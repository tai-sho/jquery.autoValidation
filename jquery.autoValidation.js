 /**
  * jQuery autoValidation
  * @author ShoheiTai
  * @version 1.0
  * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
  * @link https://github.com/tai-sho/jquery.autoValidation
  */
;(function($) {
    //INPUTのバリデーションを行うイベント。複数設定する場合はスペースで区切る。
    var VALIDATE_EVENT = 'keyup blur';
    //エラー時に対象へ設定するクラス
    var INPUT_ERROR_CLASS = 'form-error';
    //エラークラス名
    var ERROR_CLASS = 'error';
    //エラーのセレクタ
    var ERROR_SELECTOR = '.' + ERROR_CLASS;
    //スクロールの速度
    var SCROLL_SPEED = 400;
    //スクロール先
    var SCROLL_TARGET = 'form';
    //エラー時に出力するタグ
    var ERROR_TAG = 'span';
    //フォームエラー時にダイアログを出力するか
    var ERROR_ALERT = true;

    //エラーメッセージ
    var msg = {
            'master': '入力に誤りがあります。入力内容をご確認ください。',
            'alphanumeric' : '半角英数字で入力してください。',
            'req' : '必須入力です。',
            'kana' : '全角カタカナで入力してください。',
            'mail' : 'メールアドレスの形式で入力してください。',
            'short' : '#STR1#字以上で入力してください。',
            'long' : '#STR1#字以下で入力してください。',
            'half_num' : '半角数字で入力してください。',
            'full_num' : '全角数字で入力してください。',
            'num' : '数字で入力してください。',
            'between' : '#STR1#字以上#STR2#字以下で入力してください。',
            'nosame' : '#STR1#と内容が一致しません。',
            '_nosame' : '値が一致しません。',
            'pattern' : '指定された形式と一致しません。',
            'func' : '入力に誤りがあります'
    };

    var valid = {
            /**
             * 値が入力されているかをチェックします。
             * 引数の文字列が存在する場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isInputted' : function(str) {return (str.length !== 0);},
            /**
             * 半角数字チェックを行います。
             * 引数の文字列が半角数字の場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isHalfNum' : function(str) {return (str.length === 0 || str.match(/^[0-9]+$/));},
            /**
             * 全角数字チェックを行います。
             * 引数の文字列が全角数字の場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isFullNum' : function(str) {return (str.length === 0 || str.match(/^[０-９]+$/));},
            /**
             * 半角カナチェックを行います。
             * 引数の文字列が全角カナの場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isHalfKana' : function(str) {return (str.length === 0 || str.match(/^[ｧ-ﾝﾞﾟ]+$/));},
            /**
             * 全角カナチェックを行います。
             * 引数の文字列が全角カナの場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isFullKana' : function(str) {return (str.length === 0 || str.match(/^[ァ-ー]+$/));},/* /^[ァ-ン]+$/ */
            /**
             * 間のスペースを許容する全角カナチェックを行います。
             * 引数の文字列が全角カナの場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isFullKanaName' : function(str) {return (str.length === 0 || str.match(/^[ァ-ヶー゛゜]*[　 ]*[ァ-ヶー゛゜]+$/));},
            /**
             * メールアドレスチェックを行います。
             * 引数の文字列がメールアドレスの形式の場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @returns {Boolean}
             */
            'isMail' : function(str) {return (str.length === 0 || str.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/));},
            /**
             * 数値が指定された範囲内であるかチェックします。
             * strがminからmaxまでの間の場合はtrue,そうでなければfalseを返します。
             * @param str 対象文字列
             * @param min 最小値
             * @param max 最大値
             * @returns {Boolean}
             */
            'isBetween' : function(str, min, max) {return (str.length === 0 || str.length >= min && max >= str.length);},
            /**
             * 数値が指定された値以上であるかチェックします。
             * @param str 対象文字列
             * @param min 最小値
             * @returns {Boolean}
             */
            'isShort' : function(str, min) {return (str.length === 0 || min <= str.length);},
            /**
             * 数値が指定された値以下であるかチェックします。
             * @param str 対象文字列
             * @param max 最大値
             * @returns {Boolean}
             */
            'isLong' : function(str, max) {return (str.length === 0 || str.length <= max);},
            /**
             * 2つの文字列が一致するかチェックします。
             * @param str1 文字列1
             * @param str2 文字列2
             * @returns {Boolean}
             */
            'isSame' : function(str1, str2) {return (str1 === str2);},
            /**
             * 半角英数字チェックを行います。
             * @param str1 文字列1
             * @returns {Boolean}
             */
            'isAlphanumeric' : function(str) {return (str.length === 0 || str.match(/^[a-zA-Z0-9]+$/));},
            /**
             * 正規表現によるチェックを行います。
             * @param str 文字列
             * @param reg 正規表現
             * @returns {Boolean}
             */
            'pattern' : function(str, reg) {return (str.length === 0 || str.match(new RegExp(reg)));}
    };

    /**
     * エラー用タグにテキストを埋め込み、入力ボックスの横に挿入します。
     * テキストに空文字を渡すとエラー用タグを削除します。
     * @param dom DOMエレメント
     * @param txt エラー文言
     */
    function toggleErrorHtml(dom, txt) {
        if(txt.length === 0) {
            //値がなければエラーなしとしてタグを削除
            dom.next(ERROR_SELECTOR).remove();
            dom.removeClass(INPUT_ERROR_CLASS);
        } else {
            if(dom.next(ERROR_SELECTOR).length) {
                //エラー用タグが存在する場合はテキストを更新する
                dom.next(ERROR_SELECTOR).html(txt);
            } else {
                //エラータグが存在しない場合はエラータグを追加する
                dom.after(getErrorHtml(txt));
            }
            dom.addClass(INPUT_ERROR_CLASS);
        }
        return true;
    }

    /**
     * 引数の文字列をエラー用タグで囲んで返却します。
     * 第二引数を渡すと置き換え文字列#STR#を置き換えます。
     * @param str エラー文言
     * @returns {String}
     */
    function getErrorHtml(str) {
        return '<' + ERROR_TAG + ' class="' + ERROR_CLASS + '">' + str + '</' + ERROR_TAG + '>';
    }

    /**
     * エラー文字列を取得します。
     * @param type msgオブジェクトのキー
     * @param replace 置き換え文字
     * @returns
     */
    function getErrorText(type, replace1, replace2) {
        var txt = msg[type];
        if(replace1) {
            txt = txt.replace('#STR1#', replace1);
        }
        if(replace2) {
            txt = txt.replace('#STR2#', replace2);
        }
        return txt;
    }

    /**
     * オブジェクトで渡されるバリデーションルールを読み込み、
     * バリデーションを行います。
     * 必須入力チェックを指定した場合は最優先で行います。
     * @param e イベントオブジェクト
     * @returns
     */
    function validate(e) {
        //Tabキーで予期しないタイミングのチェックを無効にする
        if(e.type === 'keyup' && e.keyCode === 9) return false;
        var txt = '';
        var str = $(this).val();
        var rules = e.data.rules;
        var requiredAllow = true;
        //必須入力チェックが設定されている場合は優先する
        if(rules.required !== undefined) {
            if(!valid.isInputted(str)) {
                // メッセージが設定されている場合
                if(rules.required && rules.required.msg) {
                    txt = rules.required.msg;
                } else {
                    txt = getErrorText('req');
                }
                requiredAllow = Boolean(txt);
            }
        }

        // 必須チェックが設定されていない場合または必須チェックをクリアした場合
        if(requiredAllow) {
            for(var rule in rules) {
                if(rules[rule] && rules[rule]['msg']) {
                    txt = rules[rule]['msg'];
                }
                //パラメータが必要なルール
                if(rules[rule]) {
                    switch(rule) {
                    case 'number': //数字チェック pitch
                        switch(rules[rule]['pitch']) {
                        case 'full': //全角
                            if(!valid.isFullNum(str)) {
                                txt = txt ? txt : getErrorText('full_num');
                            }
                            break;
                        case 'half': //半角
                            if(!valid.isHalfNum(str)) {
                                txt = txt ? txt : getErrorText('half_num');
                            }
                        break;
                        }
                        break;
                    case 'between': //範囲チェック min max
                        if(!valid.isBetween(str, rules[rule]['min'], rules[rule]['max'])) {
                            txt = txt ? txt : getErrorText('between', rules[rule]['min'], rules[rule]['max']);
                        }
                        break;
                    case 'long': //値の上限チェック max
                        if(!valid.isLong(str, rules[rule]['max'])) {
                            txt = txt ? txt : getErrorText('long',rules[rule]['max']);
                        }
                        break;
                    case 'short': //値の下限チェック min
                        if(!valid.isShort(str, rules[rule]['min'])) {
                            txt = txt ? txt : getErrorText('kana',rules[rule]['min']);
                        }
                        break;
                    case 'equals': //値が同じかどうかチェック target name
                        var _str = $(rules[rule]['target']).val();
                        if(!valid.isSame(str, _str)) {
                            if(rules[rule]['name']) {
                                txt = txt ? txt : getErrorText('nosame', rules[rule]['name']);
                            } else {
                                txt = txt ? txt : getErrorText('_nosame');
                            }
                        }
                        break;
                    case 'pattern': //正規表現と一致するかどうかチェック reg
                        if(!valid.pattern(str, rules[rule]['reg'])) {
                            txt = txt ? txt : getErrorText('pattern');
                        }
                        break;
                    default:
                        if(typeof(rules[rule]['rule']) === 'function') {
                            if(!(str.length === 0 || rules[rule]['rule'](str))) {
                                txt = txt ? txt : getErrorText('func');
                            }
                        }
                        break;
                    }
                } else {
                    //パラメータが不要なルール
                    switch(rule) {
                    case 'alphanumeric': //半角英数字チェック
                        if(!valid.isAlphanumeric(str)) {
                            txt = txt ? txt : getErrorText('alphanumeric');
                        }
                        break;
                    case 'email': //アドレスチェック
                        if(!valid.isMail(str)) {
                            txt = txt ? txt : getErrorText('mail');
                        }
                        break;
                    case 'kana': //カタカナチェック
                        if(!valid.isFullKana(str)) {
                            txt = txt ? txt : getErrorText('kana');
                        }
                        break;
                    case 'name_kana': //カタカナ名前チェック
                        if(!valid.isFullKanaName(str)) {
                            txt = txt ? txt : getErrorText('kana');
                        }
                        break;
                    }
                }
            }
        }
        toggleErrorHtml($(this), txt);
    }
    /**
     * ライブラリ本体
     */
    $.fn.autoValidation = function(valid_opt, setting) {
        //設定
        for(var type in setting) {
            switch(type) {
            case 'errorInputClass'://エラー入力項目のクラス
                INPUT_ERROR_CLASS = setting[type];
                break;
            case 'errorMsgClass'://エラーメッセージのクラス
                ERROR_CLASS = setting[type];
                ERROR_SELECTOR = '.' + ERROR_CLASS;
                break;
            case 'scrollSpeed'://submitチェックの際のスクロール速度
                SCROLL_SPEED = setting[type];
                break;
            case 'errorTag'://エラー時に出力するタグ
                ERROR_TAG = setting[type];
                break;
            case 'scrollTarget'://submitチェックの際のスクロール先(falseの場合はスクロールしない)
                SCROLL_TARGET = setting[type];
                break;
            case 'alert'://submitチェックの際のダイアログ設定
                if(setting[type]['out'] === false) {
                    ERROR_ALERT = false;
                } else if(setting[type]['msg']) {
                    msg.master = setting[type]['msg'];
                }
            }
        }
        //バリデーションのバインド
        if(valid_opt) {
            for(var sel in valid_opt) {
                $(sel).bind(VALIDATE_EVENT, {'rules' : valid_opt[sel]}, validate);
            }
        } else {
            console.error('the setting was not found.');
        }

        /**
         * フォームの送信前にバリデーション用のイベントを発生させ、チェックを行います。
         * グローバル変数で定義したエラーセレクタがdocumentに存在している場合は
         * エラーとし、送信を中断します。
         */
        this.bind('submit', function() {
            //バリデーション用イベントを発生させる
            var events = VALIDATE_EVENT.split(' ');
            $('form input').trigger(events[0]);
            var err = $(ERROR_SELECTOR);
            if(err.length > 0) {
                if(ERROR_ALERT) {
                    alert(msg.master);
                }
                if(SCROLL_TARGET) {
                    // 移動先を数値で取得
                    var position = $(SCROLL_TARGET).offset().top;
                    // スムーススクロール
                    $('body,html').animate({scrollTop:position}, SCROLL_SPEED, 'swing');
                }
                return false;
            }
        });
        return this;
    };
}) (jQuery);