/*
kintone内のデータを外部APIに投げてPDFファイルをダウンロードするプログラム
*/
(function () {
    "use strict";

    // 詳細画面を表示した際にイベント発火する
    // ※別に一覧画面にイベントを設置してもOK。
    kintone.events.on('app.record.detail.show', function(event) {

        // PDF出力用のボタンを作成
        var button = document.createElement('button');
        button.id = 'pdf_button'; // IDは何でもいいです
        button.innerHTML = 'PDF出力'; // お好きなボタンの表示名
        button.onclick = function() { // PDF出力ボタンをクリックするとPDFファイルをダウンロード

            // 詳細画面で表示しているレコード情報を取得
            // ※ここでデータをごにょごにょして、外部APIに投げる用のデータを作成する感じです
            var data = kintone.app.record.get().record;

            export_pdf('https://[外部APIのURLもしくはIPアドレス]', data); // PDFファイル出力(※export_pdf.jsの関数を呼ぶ)
        };

        // PDF出力用ボタンをkintone上のヘッダの箇所に表示する
        // ※基本的にヘッダ部分がスペースとして空いているため。
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(button);
    });
})();
