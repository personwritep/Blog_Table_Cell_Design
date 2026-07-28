// ==UserScript==
// @name        Blog Table ⭐ Cell Design
// @namespace        http://tampermonkey.net/
// @version        0.6
// @description        個別のtable-cellのデザインを指定する「Ctrl+F3」
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/entry/srventry*
// @exclude        https://blog.ameba.jp/ucs/entry/srventrylist.do*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameblo.jp
// @grant        none
// @updateURL        https://github.com/personwritep/Blog_Table_Cell_Design/raw/main/Blog_Table_Cell_Design.user.js
// @downloadURL        https://github.com/personwritep/Blog_Table_Cell_Design/raw/main/Blog_Table_Cell_Design.user.js
// ==/UserScript==



let retry=0;
let interval=setInterval(wait_target, 100);
function wait_target(){
    retry++;
    if(retry>10){ // リトライ制限 10回 1sec
        clearInterval(interval); }
    let target=document.getElementById('cke_1_contents'); // 監視 target
    if(target){
        clearInterval(interval);
        main(); }}



function main(){
    let ua=0; // Chromeの場合のフラグ
    let agent=window.navigator.userAgent.toLowerCase();
    if(agent.indexOf('firefox') > -1){ ua=1; } // Firefoxの場合のフラグ

    let task=0; // 起動1・更新3・終了0

    let btcd_bg=sessionStorage.getItem('BTCD_bg');
    if(!btcd_bg){
        btcd_bg='#F4F4F4'; }
    sessionStorage.setItem('BTCD_bg', '#F4F4F4');


    let SVG_align_l;
    let SVG_align_c;
    let SVG_align_r;



    let target=document.getElementById('cke_1_contents'); // 監視 target
    let monitor=new MutationObserver( catch_key );
    monitor.observe(target, {childList: true, attributes: true}); // ショートカット待受け開始

    catch_key();

    function catch_key(){
        if(document.querySelector('.cke_wysiwyg_frame') !=null){ //「通常表示」から実行開始
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            let iframe_doc=editor_iframe.contentWindow.document;

            iframe_doc.addEventListener('keydown', check_key);
            document.addEventListener('keydown', check_key);

            function check_key(event){
                if(event.keyCode==13 && iframe_doc.hasFocus()){
                    remove_mark(); } // 改行入力が連続マークとなるのを抑止

                let gate=-1;
                if(event.ctrlKey==true){
                    if(event.keyCode==114){
                        event.preventDefault(); gate=1; }
                    if(gate==1){
                        event.stopImmediatePropagation();
                        do_task(); }}}

            function do_task(){
                if(task==0){
                    task=1;
                    table_panel();
                    enhanced(); }
                else{
                    task=0;
                    remove_t_panel();
                    remove_mark_all(); }}}

        before_end();

    } // catch_key()



    function table_panel(){

        let SVG_bold=
            '<svg class="bold" viewBox="0 0 256 256">'+
            '<path style="fill: currentColor;" d="M43 22L43 37C52 37 62 36 65 47C'+
            '67 52 66 59 66 64L66 95L66 173C66 185 68 200 65 211C62 221 52 221 43'+
            ' 221L43 235L126 235C147 235 170 235 188 223C213 206 221 164 199 141C'+
            '186 128 164 123 147 122C162 117 178 115 190 103C211 81 204 42 176 29'+
            'C159 22 138 22 120 22L43 22M111 115L111 63C111 57 109 47 113 42C115 '+
            '39 120 39 124 39C134 39 144 40 151 48C155 53 156 60 157 66C159 81 15'+
            '7 101 143 110C133 116 122 115 111 115M111 132C124 132 139 131 150 13'+
            '9C164 148 164 164 164 179C164 189 163 200 156 208C149 218 138 218 12'+
            '6 218C122 218 117 219 114 216C109 210 111 199 111 192L111 132z"></pa'+
            'th>'+
            '</svg>';

        SVG_align_l=
            '<svg class="align_l" viewBox="0 0 256 256">'+
            '<path style="fill: rgb(0, 0, 0);" d="M24 28.6C11.5 31.8 10.3 51.3 23'+
            ' 55.3C27 56.6 31.8 56 36 56L59 56L138 56L164 56C168.6 56 173.8 56.5 '+
            '177.9 53.9C188.1 47.6 184.8 30.2 173 28.2C162.9 26.5 151.3 28 141 28'+
            'L77 28L42 28C36.3 28 29.6 27.1 24 28.6M23 85.7C11.2 89.7 11 108.4 23'+
            ' 112.2C31 114.7 41.7 113 50 113L105 113C113.5 113 127.3 115.6 135 11'+
            '1.5C146.2 105.6 143.3 87.7 131 85.3C123.1 83.8 114 85 106 85L57 85L3'+
            '5 85C31.1 85 26.7 84.4 23 85.7M24 142.6C11.5 145.8 10.3 165.3 23 169'+
            '.3C30.6 171.8 41.1 170 49 170L105 170C113.7 170 127 172.4 135 168.4C'+
            '146.2 162.8 143.3 144.3 131 142.2C123.7 141 115.4 142 108 142L63 142'+
            'L38 142C33.5 142 28.4 141.4 24 142.6M23 199.7C11.2 203.7 11 222.4 23'+
            ' 226.2C27.1 227.5 31.8 227 36 227L60 227L139 227L165 227C169.3 227 1'+
            '74.1 227.5 177.9 225C188.1 218.4 184.8 201.6 173 199.3C162 197.2 149'+
            '.2 199 138 199L69 199L38 199C33.3 199 27.5 198.2 23 199.7z"></path>'+
            '</svg>';

        SVG_align_c=
            '<svg class="align_c" viewBox="0 0 256 256">'+
            '<path style="fill: rgb(0, 0, 0);" d="M53 28.6C40.5 31.8 39.3 51.3 52'+
            ' 55.3C56 56.6 60.8 56 65 56L88 56L167 56L193 56C197.6 56 202.8 56.5 '+
            '206.9 53.9C217.1 47.6 213.8 30.2 202 28.2C191.9 26.5 180.3 28 170 28'+
            'L106 28L71 28C65.3 28 58.6 27.1 53 28.6M72 85.7C60.2 89.7 60 108.4 7'+
            '2 112.2C80 114.7 90.7 113 99 113L154 113C162.5 113 176.3 115.6 184 1'+
            '11.5C195.2 105.6 192.3 87.7 180 85.3C172.1 83.8 163 85 155 85L106 85'+
            'L84 85C80.1 85 75.7 84.4 72 85.7M73 142.6C60.5 145.8 59.3 165.3 72 1'+
            '69.3C79.6 171.8 90.1 170 98 170L154 170C162.7 170 176 172.4 184 168.'+
            '4C195.2 162.8 192.3 144.3 180 142.2C172.7 141 164.4 142 157 142L112 '+
            '142L87 142C82.5 142 77.4 141.4 73 142.6M52 199.7C40.2 203.7 40 222.4'+
            ' 52 226.2C56.1 227.5 60.8 227 65 227L89 227L168 227L194 227C198.3 22'+
            '7 203.1 227.5 206.9 225C217.1 218.4 213.8 201.6 202 199.3C191 197.2 '+
            '178.2 199 167 199L98 199L67 199C62.3 199 56.5 198.2 52 199.7z"></pat'+
            'h>'+
            '</svg>';

        SVG_align_r=
            '<svg class="align_r" viewBox="0 0 256 256">'+
            '<path style="fill: rgb(0, 0, 0);" d="M81 28.6C68.5 31.8 67.3 51.3 80'+
            ' 55.3C84 56.6 88.8 56 93 56L116 56L195 56L221 56C225.6 56 230.8 56.5'+
            ' 234.9 53.9C245.1 47.6 241.8 30.2 230 28.2C219.9 26.5 208.3 28 198 2'+
            '8L134 28L99 28C93.3 28 86.6 27.1 81 28.6M122 85.7C110.2 89.7 110 108'+
            '.4 122 112.2C130 114.7 140.7 113 149 113L204 113C212.5 113 226.3 115'+
            '.6 234 111.5C245.2 105.6 242.3 87.7 230 85.3C222.1 83.8 213 85 205 8'+
            '5L156 85L134 85C130.1 85 125.7 84.4 122 85.7M123 142.6C110.5 145.8 1'+
            '09.3 165.3 122 169.3C129.6 171.8 140.1 170 148 170L204 170C212.7 170'+
            ' 226 172.4 234 168.4C245.2 162.8 242.3 144.3 230 142.2C222.7 141 214'+
            '.4 142 207 142L162 142L137 142C132.5 142 127.4 141.4 123 142.6M80 19'+
            '9.7C68.2 203.7 68 222.4 80 226.2C84.1 227.5 88.8 227 93 227L117 227L'+
            '196 227L222 227C226.3 227 231.1 227.5 234.9 225C245.1 218.4 241.8 20'+
            '1.6 230 199.3C219 197.2 206.2 199 195 199L126 199L95 199C90.3 199 84'+
            '.5 198.2 80 199.7z"></path>'+
            '</svg>';

        let SVG_cm=
            '<svg class="copy_memo" viewBox="-45 -20 540 540">'+
            '<path fill="#fff" d="M416 208H272V64c0-18-14-32-32-32h-32c-18 '+
            '0-32 14-32 32v144H32c-18 0-32 14-32 32v32c0 18 14 32 32 32h144v '+
            '144c0 18 14 32 32 32h32c18 0 32-14 32-32V304h144c18 0 32-14 '+
            '32-32v-32c0-18-14-32-32-32z"></path></svg>';

        let SVG_pm=
            '<svg class="paste_memo" viewBox="0 -10 256 256">'+
            '<path style="fill:#fff" d="M102 136L72 136C67 136 61 136 58 141C54 148 '+
            '59 153 63 158C72 169 82 180 91 191C100 201 109 212 118 222C122 226 '+
            '126 232 132 232C138 232 142 226 146 222C155 211 164 201 173 190C182 '+
            '179 192 169 201 158C205 153 210 148 207 142C203 136 198 136 192 '+
            '136L162 136C162 108 157 79 145 54C139 43 132 31 121 24C102 13 79 '+
            '13 58 17C53 18 39 20 38 27C37 31 49 29 51 29C67 27 85 32 96 45C102 53 '+
            '104 63 105 72C108 94 105 114 102 136z"/></svg>';

        let SVG_prow=
            '<svg class="paste_row" viewBox="0 0 279 256">'+
            '<path style="fill: currentColor;" d="M109 28L11 126C16 133.1 22.9 13'+
            '8.9 29 145L60 176L91 207C97.1 213.1 102.9 220 110 225L110 153L167 15'+
            '3L167 225C179.6 216.1 190.1 202.9 201 192L266 127C261 119.9 254.1 11'+
            '4.1 248 108L217 77L186 46C179.9 39.9 174.1 33 167 28L167 100L110 100'+
            'L110 51C110 44 111.7 34.4 109 28z"></path>'+
            '</svg>';

        let SVG_pcol=
            '<svg class="paste_col" viewBox="0 0 279 256">'+
            '<path style="fill: currentColor;" d="M139 10L74 75C62.8 86.2 49.1 97'+
            '.1 40 110L112 110L112 149L40 149C49.1 161.9 62.8 172.8 74 184L139 24'+
            '9C146.1 244 151.9 237.1 158 231L190 199L221 168C227.1 161.9 234 156.'+
            '1 239 149L167 149L167 110L239 110C234 102.9 227.1 97.1 221 91L189 59'+
            'L158 28C151.9 21.9 146.1 15 139 10z"></path>'+
            '</svg>';

        let SVG_plain=
            '<svg  class="plain" viewBox="0 0 24 16">'+
            '<rect x="1" y="1" width="22" height="14" fill="none" stroke="black" '+
            'stroke-width="1" /></svg>';

        let panel=
            '<div id="tcd_panel">'+
            '<span class="tcd_label">背景色</span>'+
            '<input id="cell_bg" type="text" autocomplete="off">'+
            '<span class="tcd_label">Padding </span>'+
            '<div class="tcd_wpx pad"><input id="padd_t" type="number" min="0" max="40" value="2"></div>'+
            '<span class="tcd_label"></span>'+
            '<div class="tcd_wpx pad"><input id="padd_lr" type="number" min="0" max="40" value="6"></div>'+
            '<span class="tcd_label"></span>'+
            '<div class="tcd_wpx"><input id="padd_b" type="number" min="0" max="40" value="0"></div>'+
            '<span class="tcd_label">文字サイズ</span>'+
            '<div class="tcd_wpx"><input id="cell_fz" type="number" min="6" max="32" value="16"></div>'+
            '<span class="tcd_label">行間隔</span>'+
            '<div class="tcd_wpx"><input id="cell_lh" type="number" min="10" max="40" value="20"></div>'+
            '<span class="tcd_label">太字</span>'+
            '<span id="bold">'+ SVG_bold +'</span>'+
            '<span class="tcd_label">配置</span>'+
            '<span id="align">'+ SVG_align_l +'</span>'+
            '<span class="tcd_label">登録</span>'+
            '<span id="copy_memo">'+ SVG_cm +'</span>'+
            '<span id="paste_memo">'+ SVG_pm +'</span>'+
            '<span id="paste_row">'+ SVG_prow +'</span>'+
            '<span id="paste_col">'+ SVG_pcol +'</span>'+
            '<span id="tcd_plain">'+ SVG_plain +'</span>'+
            '<span id="tcd_test"></span>'+

            '<div id="tcd_first">'+
            '<span id="tcd_help">？</span>'+
            '<div class="tcd_help1">'+
            'デザインを指定するセルを<b>「Ctrl+左Click」</b>で指定してください</div>'+
            '</div>'+

            '<style>'+
            '#tcd_panel { position: fixed; top: 15px; left: calc(50% - 490px); width: 954px; '+
            'font-size: 14px; padding: 6px 12px; overflow: hidden; '+
            'border: 1px solid #ccc; border-radius: 4px; background: #eff5f6; z-index: 10; }'+
            '#tcd_panel * { user-select: none; }'+
            '#tcd_panel input { position: relative; margin-right: 10px; padding-top: 2px; '+
            'height: 27px; box-sizing: border-box; border: thin solid #aaa; }'+
            '#tcd_panel input[type="number"] { padding-right: 2px; margin-right: 0; }'+
            '#tcd_panel input[type="number"]:focus, #tcd_panel input[type="submit"]:focus '+
            '{ box-shadow: none; }'+
            '.tcd_label { margin: 0 3px 0 0; }'+

            '#padd_t, #padd_lr, #padd_b, #cell_fz, #cell_lh { width: 44px; text-align: center; }'+

            '.tcd_wpx { position: relative; display: inline-block; }'+
            '.tcd_wpx { margin-right: 10px; }'+
            '.tcd_wpx.pad { margin-right: 0; }'+
            '.tcd_wpx::after { content: "px"; }'+
            '.tcd_wpx::after { position: absolute; right: 2px; top: 2px; '+
            'padding: 3px 0 0; width: 17px; background: #fff; }'+
            '.tcd_wpx:hover::after { content: ""; }'+

            '#cell_bg { width: 100px; padding: 2px 0 0 22px; cursor: pointer; }'+
            '#cell_bg:focus { cursor: text; }'+

            '#bold, #align { margin: 0 10px 0 0; }'+
            '#copy_memo, #paste_memo { margin: 0 4px; }'+
            '#bold:hover, #align:hover, #copy_memo:hover, #paste_memo:hover, '+
            '#tcd_plain:hover { filter: invert(1); }'+

            '#tcd_panel .align_l, #tcd_panel .align_c, #tcd_panel .align_r, #tcd_panel .bold { '+
            'width: 22px; height: 22px; padding: 2px; outline: 1px solid #aaa; border-radius: 2px; '+
            'background: #fff; vertical-align: -8px; cursor: pointer; }'+
            '#tcd_panel .copy_memo, #tcd_panel .paste_memo { '+
            'width: 22px; height: 22px; padding: 2px; border-radius: 3px; '+
            'background: #000; vertical-align: -8px; cursor: pointer; }'+

            '#paste_row, #paste_col { padding: 4px 2px 1px; border-radius: 3px; '+
            'color: #fff; background: #2196F3; vertical-align: -1px; cursor: pointer; }'+
            '#paste_row { margin-left: 15px; }'+
            '#paste_col { margin-left: 8px; }'+
            '#tcd_panel .paste_row, #tcd_panel .paste_col { '+
            'width: 28px; height: 24px; vertical-align: -6px; cursor: pointer; }'+
            '#paste_row:hover, #paste_col:hover { color: #000; background: #fff; }'+

            '#tcd_plain .plain { width: 20px; height: 15px; padding: 5px 4px; margin-left: 15px; '+
            'outline: 1px solid #aaa; border-radius: 2px; background: #fff; vertical-align: -8px; '+
            'cursor: pointer; }'+

            '#tcd_first { position: absolute; top: 0; left: 0; color: #fff; background: #2196f3; '+
            'width: 100%; padding: 10px 0; font-size: 16px; text-align: center; }'+
            '#tcd_help { position: absolute; top: 11px; right: 25px; padding: 2px 1px 0; '+
            'line-height: 16px; font-weight: bold; border-radius: 30px; '+
            'color: #2196f3; background: #fff; cursor: pointer; }'+
            '.tcd_help1 { text-align: left; margin-left: 60px; }'+

            '#tcd_test { display: none; }'+
            '#cke_42, #cke_43 { top: 60px !important; left: calc( 50% - 45px) !important; }';

        if(ua==1){
            panel +=
                '.tcd_wpx::after { padding: 3px 1px 0; }'; }

        panel +=
            '</style>'+
            '</div>';

        if(!document.querySelector('#tcd_panel')){
            document.body.insertAdjacentHTML('beforeend', panel); }

    } // table_panel()



    function enhanced(){
        let target_r=document.getElementById('cke_1_contents'); // 監視 target
        let monitor_r=new MutationObserver(select);
        monitor_r.observe(target_r, {childList: true}); // ショートカット待受け開始

        select();

        function select(){
            if(document.querySelector('.cke_wysiwyg_frame') !=null){ //「通常表示」から実行開始
                remove_mark_all(); // Html編集後のリセット
                show_first(1);
                let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
                let iframe_doc=editor_iframe.contentWindow.document;
                if(iframe_doc){
                    let style_tcd_if=
                        '<style id="style_tcd_if">'+
                        '.tcd_active { box-shadow: #fff -4px 0px, #2196f3 -8px 0px !important; }'+
                        '.cell_active { outline: 2px solid #2196f3; outline-offset: 3px; }'+
                        '</style>';

                    if(!iframe_doc.head.querySelector('#style_tcd_if')){
                        iframe_doc.head.insertAdjacentHTML('beforeend', style_tcd_if); }

                    let editor=iframe_doc.querySelector('.cke_editable');
                    if(editor){
                        editor.onclick=function(event){
                            event.stopImmediatePropagation();

                            if(event.ctrlKey){
                                remove_mark_all();
                                if(task==1 || task==3){
                                    let elm=iframe_doc.elementFromPoint(event.clientX, event.clientY);
                                    if(elm.closest('table')!=null){
                                        let table_=elm.closest('table');
                                        if(table_.id && table_.id.includes('ambt')){
                                            table_.parentNode.classList.add('tcd_active');
                                            show_first(0);
                                            task=3;
                                            let td_=elm.closest('td');
                                            td_.classList.add('cell_active');
                                            edit_table(table_, td_); } //「セルをデザイン」
                                        else{
                                            remove_mark(); } //「選択終了」
                                    }}}
                        }}}}} // select()

    } // enhanced()



    function pick_color(){
        let set_color;
        let color_label;
        let icon_button;

        if(ua==0){
            color_label=document.querySelector('#cke_16_label');
            icon_button=document.querySelector('#cke_17'); }
        else if(ua==1){
            color_label=document.querySelector('#cke_15_label');
            icon_button=document.querySelector('#cke_16'); }

        let target_p=color_label; // 監視 アイコンのカラーラベル
        let monitor_p=new MutationObserver(get_copy);

        let trust_color;
        let color_input=document.querySelector('#cell_bg');


        color_input.onmousedown=function(event){ // 🟡
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            let iframe_doc=editor_iframe.contentWindow.document;
            iframe_doc.getSelection().removeAllRanges();

            if(event.ctrlKey==true){
                event.preventDefault();
                event.stopImmediatePropagation(); // 🟡
                icon_button.click();
                monitor_p.observe(target_p, {attributes: true}); }
            else if(event.shiftKey==true){
                event.preventDefault();
                if(test_colorE(hex_bright(color_input.value))){
                    color_input.value=hex_bright(color_input.value); // 明度を上げる
                    sticky_color(color_input); }}}



        color_input.addEventListener('change', function(event){
            event.preventDefault();
            if(test_colorE(color_input.value)){
                color_input.value=hex_8_6(trust_color);
                sticky_color(color_input); }
            else{
                if(color_input.value==''){
                    color_input.style.boxShadow='inset 0 0 0 1px black'; }
                else{
                    color_input.style.boxShadow='inset 0 0 0 1px black'; // 担保コード
                    color_input.style.boxShadow=
                        'inset 0 0 0 1px black, inset 17px 0 ' + color_input.value+
                        ', inset 18px 0 #aaa'; }}});



        function test_colorE(color){
            let test=document.querySelector('#tcd_test');
            test.style.color='#000001';
            if(color!=''){
                test.style.color=color; } // 入力枠が空の場合はNG判定
            let colorR=window.getComputedStyle(test).color;
            if(colorR){
                trust_color=rgb_hex(colorR); // 適正値を6桁16進で返す

                if(colorR!='rgb(0, 0, 1)'){
                    return true; } // 正常な色
                else{
                    if(color=='rgb(0, 0, 1)' || color=='#000001' || color=='#000001ff'){
                        return true; } //「#000001」をテストした場合は 例外処理
                    else{
                        return false; }}}
            else{
                return false; }}



        document.addEventListener('mousedown', function(){ // 🟡
            monitor_p.disconnect(); }); // カラー取得終了



        if(document.querySelector('.cke_wysiwyg_frame') !=null){
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            let iframe_doc=editor_iframe.contentWindow.document;
            iframe_doc.addEventListener('mousedown', function(){ // 🟡
                monitor_p.disconnect(); }); } // カラー取得終了



        function get_copy(){
            set_color=color_label.getAttribute('data-color');
            color_input.value='#'+ set_color.toLowerCase();
            sticky_color(color_input);

            monitor_p.disconnect(); } // カラー取得終了



        let target_body=document.querySelector('.l-body'); // 監視 target
        let monitor_generator=new MutationObserver(stealth);
        monitor_generator.observe(target_body, {childList: true, subtree: true});

        function stealth(){
            let color_generator=document.querySelector('.ck-l-colorGenerator');
            if(color_generator){
                color_generator.addEventListener('mousedown', function(event){ // 🟡
                    event.stopImmediatePropagation(); }); }}

    } // pick_color()



    function sticky_color(box){
        box.style.boxShadow='inset 17px 0 '+ box.value +', inset 18px 0 #aaa'; }



    function edit_table(table_, td_){
        let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        let iframe_doc=editor_iframe.contentWindow.document;

        let color_input=document.querySelector('#cell_bg'); // 背景色
        let padd_t=document.querySelector('#padd_t'); // padding-top
        let padd_lr=document.querySelector('#padd_lr'); // padding-left/right
        let padd_b=document.querySelector('#padd_b'); // padding-bottom
        let cell_fz=document.querySelector('#cell_fz'); // 文字サイズ
        let cell_lh=document.querySelector('#cell_lh'); // 行間隔
        let bold=document.querySelector('#bold'); // ボールド
        let align=document.querySelector('#align'); // 配置
        let copy_memo=document.querySelector('#copy_memo'); // コピーボタン
        let paste_memo=document.querySelector('#paste_memo'); // ペーストボタン

        if(task==3){
            pick_color();
            memo_td(td_);
            paste_row_td(td_);
            paste_col_td(td_);
            back_to_plain(td_);

            table_.parentNode.style.overflowY='hidden'; // 高さ減少時のスクロールバーを抑止



            let bg=getComputedStyle(td_).backgroundColor;
            color_input.value=rgb_hex(bg);
            sticky_color(color_input);
            let default_color=color_input.value;

            color_input.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(color_input.value!=default_color){
                        td_.style.backgroundColor=color_input.value; }
                    else{
                        td_.style.backgroundColor=''; }}}



            let pt=getComputedStyle(td_).paddingTop;
            pt=pt.replace('px', '');
            padd_t.value=Math.round(pt);
            let default_pt=padd_t.value;

            padd_t.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(padd_t.value!=default_pt){
                        td_.style.paddingTop=padd_t.value +'px'; }
                    else{
                        td_.style.paddingTop=''; }}}



            let plr=getComputedStyle(td_).paddingLeft;
            plr=plr.replace('px', '');
            padd_lr.value=Math.round(plr);
            let default_plr=padd_lr.value;

            padd_lr.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(padd_lr.value!=default_plr){
                        td_.style.paddingLeft=padd_lr.value +'px';
                        td_.style.paddingRight=padd_lr.value +'px'; }
                    else{
                        td_.style.paddingLeft='';
                        td_.style.paddingRight=''; }}}



            let pb=getComputedStyle(td_).paddingBottom;
            pb=pb.replace('px', '');
            padd_b.value=Math.round(pb);
            let default_pb=padd_b.value;

            padd_b.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(padd_b.value!=default_pb){
                        td_.style.paddingBottom=padd_b.value +'px'; }
                    else{
                        td_.style.paddingBottom=''; }}}



            let fz=getComputedStyle(td_).fontSize;
            fz=fz.replace('px', '');
            cell_fz.value=Math.round(fz);
            let default_fz=cell_fz.value;

            cell_fz.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(cell_fz.value!=default_fz){
                        td_.style.fontSize=cell_fz.value +'px'; }
                    else{
                        td_.style.fontSize=''; }}}



            let lh=getComputedStyle(td_).lineHeight;
            if(lh=='normal'){
                lh=fz*(1.5); }
            else if(lh.indexOf('em')!=-1){
                lh=lh.replace('em', '');
                lh=lh*fz; }
            else if(lh.indexOf('px')!=-1){
                lh=lh.replace('px', ''); }
            cell_lh.value=Math.round(lh);
            let default_lh=cell_lh.value;

            cell_lh.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(event.altKey){
                    if(cell_lh.value!=default_lh){
                        td_.style.lineHeight=cell_lh.value +'px'; }
                    else{
                        td_.style.lineHeight=''; }}}



            let t_bold=getComputedStyle(td_).fontWeight;
            if(t_bold==400){
                bold.style.color='#aaa'; }
            else{
                bold.style.color='#000'; }

            bold.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                t_bold=getComputedStyle(td_).fontWeight;
                if(event.altKey){
                    if(t_bold==400){
                        td_.style.fontWeight='bold';
                        bold.style.color='#000'; }
                    else{
                        td_.style.fontWeight='';
                        bold.style.color='#aaa'; }}}



            let t_align=getComputedStyle(td_).textAlign;
            if(t_align=='start' || t_align=='left'){
                align.innerHTML=SVG_align_l; }
            else if(t_align=='center'){
                align.innerHTML=SVG_align_c; }
            else if(t_align=='end' || t_align=='right'){
                align.innerHTML=SVG_align_r; }

            align.onclick=function(event){
                event.preventDefault();
                event.stopImmediatePropagation();
                t_align=getComputedStyle(td_).textAlign;
                if(event.altKey){
                    if(t_align=='start' || t_align=='left'){
                        td_.style.textAlign='center';
                        align.innerHTML=SVG_align_c; }
                    else if(t_align=='center'){
                        td_.style.textAlign='right';
                        align.innerHTML=SVG_align_r; }
                    else if(t_align=='end' || t_align=='right'){
                        td_.style.textAlign='left';
                        align.innerHTML=SVG_align_l; }}}

        } // if(task==3)



        function memo_td(td_){
            copy_memo.onclick=function(){
                let yes=window.confirm(
                    "　🔵 選択したセルの設定をコピーします");
                if(yes){
                    let td_style=td_.getAttribute('style');
                    sessionStorage.setItem('BTCD_style', td_style);
                    sessionStorage.setItem('BTCD_bg', color_input.value);
                }} // ストレージ 保存

            paste_memo.onclick=function(event){
                if(!event.shiftKey){ // 変更値のみ適用
                    td_.setAttribute('style', sessionStorage.getItem('BTCD_style')); }
                else{
                    td_.setAttribute('style', sessionStorage.getItem('BTCD_style'));
                    color_input.value=sessionStorage.getItem('BTCD_bg');
                    sticky_color(color_input);
                    td_.style.background=color_input.value; }} // 背景色の適用を追加
        } // memo_td()



        function paste_row_td(td_){
            let paste_row=document.querySelector('#paste_row'); // 行全体に設定適用
            paste_row.onclick=function(event){
                let td_style=td_.getAttribute('style');
                let bg=getComputedStyle(td_).backgroundColor;

                let td_tr=td_.closest('tr');
                let td_all=td_tr.querySelectorAll('td');

                if(!event.shiftKey){
                    for(let k=0; k<td_all.length; k++){
                        td_all[k].setAttribute('style', td_style); }} // 変更値の適用
                else{
                    for(let k=0; k<td_all.length; k++){
                        td_all[k].setAttribute('style', td_style); // 変更値の適用
                        td_all[k].style.background=bg; }} // 背景色の適用を追加

            }} //  paste_row_td()



        function paste_col_td(td_){
            let paste_col=document.querySelector('#paste_col'); // 列全体に設定適用
            paste_col.onclick=function(event){
                let td_style=td_.getAttribute('style');
                let bg=getComputedStyle(td_).backgroundColor;

                let tr_all=table_.querySelectorAll('tr');
                let colIndex=td_.cellIndex;

                if(!event.shiftKey){
                    for(let k=1; k<tr_all.length; k++){
                        let col_tr=tr_all[k].querySelectorAll('td')[colIndex];
                        if(col_tr){
                            col_tr.setAttribute('style', td_style); }}} // 変更値の適用
                else{
                    for(let k=1; k<tr_all.length; k++){
                        let col_tr=tr_all[k].querySelectorAll('td')[colIndex];
                        if(col_tr){
                            col_tr.setAttribute('style', td_style); // 変更値の適用
                            col_tr.style.background=bg; }}} // 背景色の適用を追加

            }} //  paste_col_td()



        function back_to_plain(td_){
            let tcd_plain=document.querySelector('#tcd_plain');
            tcd_plain.onclick=function(){
                td_.removeAttribute('style'); }}

    } // edit_table()



    function remove_t_panel(){
        document.querySelector('#tcd_panel').remove(); }



    function remove_mark(){
        if(document.querySelector('.cke_wysiwyg_frame') !=null){ //「通常表示」から実行開始
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            let iframe_doc=editor_iframe.contentWindow.document;

            let item=iframe_doc.querySelectorAll('.tcd_active');
            for(let k=0; k<item.length; k++){
                item[k].classList.remove('tcd_active'); }}}


    function remove_mark_cell(){
        if(document.querySelector('.cke_wysiwyg_frame') !=null){ //「通常表示」から実行開始
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            let iframe_doc=editor_iframe.contentWindow.document;

            let item=iframe_doc.querySelectorAll('.cell_active');
            for(let k=0; k<item.length; k++){
                item[k].classList.remove('cell_active'); }}}


    function remove_mark_all(){
        remove_mark();
        remove_mark_cell(); }



    function show_first(n){
        let first=document.querySelector('#tcd_first');
        let tcd_help1=document.querySelector('.tcd_help1');
        if(first){
            if(n==0){
                first.style.display='none'; }
            else{
                first.style.display='block';
                tcd_help1.style.display='block'; }}

        let tcd_help=document.querySelector('#tcd_help');
        if(tcd_help){
            tcd_help.onclick=function(){
                let url='https://ameblo.jp/personwritep/entry-12842271491.html';
                window.open(url, target="_blank"); }}}



    function equal_color(R, G, B, A){ // RGBは整数 Aは小数が必須 ➔ 等価 6桁hexコードに変換
        return '#'
            + tohex(upColor(R, A))
            + tohex(upColor(G, A))
            + tohex(upColor(B, A));

        function upColor(value, A){
            let color_value=value*A + 255*(1 - A);
            return Math.floor(color_value); }

        function tohex(value){
            return ('0'+ value.toString(16)).slice(-2); }}



    function hex_bright(hex){ // 明度を段階的に変換
        if(hex.slice(0, 1)=='#'){
            hex=hex.slice(1); }
        if(hex.length==3){
            hex=hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) +
                hex.slice(2,3) + hex.slice(2,3); }
        // 透過度 0.6 とした色値に変更
        let R=parseInt(hex.slice(0, 2), 16);
        let G=parseInt(hex.slice(2, 4), 16);
        let B=parseInt(hex.slice(4, 6), 16);

        return equal_color(R, G, B, 0.6); } // 非透過色値に変更



    function hex_8_6(hex){ // 8桁hex値を6桁hexに変換
        if(hex.length!=9 || hex.slice(0, 1)!='#'){
            return hex; }
        else{
            hex=hex.slice(1);

            let R=parseInt(hex.slice(0, 2), 16);
            let G=parseInt(hex.slice(2, 4), 16);
            let B=parseInt(hex.slice(4, 6), 16);
            let A=hex.slice(6, 8);
            // 16進の「A値」を透過度（小数）に変更
            let alp=0;
            for(let i=0; i<2; i++){
                alp +=Math.pow(16, -(i + 1))*parseInt(A[i], 16); }

            return equal_color(R, G, B, alp); }} // 非透過色値に変更



    function rgb_hex(color){ // rgb or rgba 表記をhex6桁表記に変換
        if(color.includes('#')){ // hex表記の場合
            return color; }
        else{ // rgb表記の場合
            color=color.split('(')[1].split(')')[0].replace(/ /g, '');
            let rgb_ar=color.split(',');

            let R=parseInt(rgb_ar[0], 10);
            let G=parseInt(rgb_ar[1], 10);
            let B=parseInt(rgb_ar[2], 10);
            let A;
            if(rgb_ar.length==3){
                A=1; }
            else if(rgb_ar.length==4){
                A=parseFloat(rgb_ar[3]); }

            return equal_color(R, G, B, A); }} // 非透過色値に変更



    function before_end(){
        let submitButton=document.querySelectorAll('.js-submitButton');
        submitButton[0].addEventListener('mousedown', all_clear, false);
        submitButton[1].addEventListener('mousedown', all_clear, false);

        function all_clear(){
            let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            if(!editor_iframe){ //「HTML表示」編集画面の場合
                alert("⛔　Blog Table が処理を終了していません\n\n"+
                      "　　 通常表示画面に戻り 編集を終了してください");
                event.stopImmediatePropagation();
                event.preventDefault(); }
            if(editor_iframe){ //「通常表示」編集画面の場合
                remove_mark_all(); } // table編集のマークを削除
        }} // before_end(

} // main()
