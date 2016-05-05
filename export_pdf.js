/*
PDFファイルを出力する関数
(jQueryだとバイナリファイルのダウンロードが上手くいかないので、仕方なくXMLHttpRequestを使用している)
*/
function export_pdf(url, post_data) {

    // aタグを作成するのがコツみたい。後のコードでここで作成したaタグをクリックする。
    // 参照: http://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    // バイナリファイルをJavaScriptでダウンロードする方法
    // 参照: http://www.html5rocks.com/en/tutorials/file/xhr2/
    window.URL = window.URL || window.webkitURL;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'arraybuffer'; // バイナリで読み込むようにレスポンスタイプを指定(重要！)

    xhr.onload = function(e) {
        if (this.status == 200) { // レスポンスステータスが200(成功)の時だけ実行する

            // ファイル名をレスポンスヘッダのContent-Dispositionから取得しているだけ。
            // Content-Disposition: attachment; filename=[ファイル名]
            // arraybufferで指定しているためか、以下のように頑張って取得するしかないみたい。。。
            var filename = "default.pdf"; // 念のためデフォルトのファイル名を設定（※すぐ下で上書きされる）
            var disposition = this.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, ''); // ファイル名があったら上書きする
                }
            }

            // PDFファイルをダウンロードする
            var response_data = this.response;
            var file = new Blob([response_data], {type: 'application/pdf'});
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url); // 別タブで開いてPDFファイルを表示する
        }
    };

    xhr.send(JSON.stringify(post_data)); // POSTする前に、投げるデータをstringifyして文字列として渡すこと
}
