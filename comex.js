/// <reference path="../../Default.aspx" />
/// <reference path="../jquery/jquery.js" />
/// <reference path="../jqueryui/jquery-ui.js" />
/// <reference path="../livequery/livequery.min.js" />
/// <reference path="../moment/moment.js" />
/// <reference path="../contextMenu/contextMenu.js" />
/// <reference path="../autosize/autosize.js" />
/// <reference path="../tsv/tsv.js" />

//comex.js v3.00B (12/08/2014)
(function ($) {
    "use strict";
    var nullundef = [null, undefined, ""];
    $.fn.resetform = function () {
        this[0].reset();
    };
    moment.fn.compare = function (b) {
        if (!this.isValid() || nullundef.contains(b) || !b.isValid()) { return; }
        return (+this).compare(+b);
    };
    moment.fn.toJSON = function () {
        return this.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    };
    moment.fn.toString = function () {
        return this.format('DD/MM/YYYY HH:mm');
    };
    moment.duration.fn.toJSON = function () {
        //return this.toIsoString();
        return this.asMilliseconds();
    };
    moment.duration.fn.format = function (input) {
        var output = input;
        var milliseconds = this.asMilliseconds();
        var totalMilliseconds = 0;
        var replaceRegexps = {
            years: /Y(?!Y)/g,
            months: /M(?!M)/g,
            weeks: /W(?!W)/g,
            days: /D(?!D)/g,
            hours: /H(?!H)/g,
            minutes: /m(?!m)/g,
            seconds: /s(?!s)/g,
            milliseconds: /S(?!S)/g
        };
        var matchRegexps = {
            years: /Y/g,
            months: /M/g,
            weeks: /W/g,
            days: /D/g,
            hours: /H/g,
            minutes: /m/g,
            seconds: /s/g,
            milliseconds: /S/g
        };
        for (var r in replaceRegexps) {
            if (replaceRegexps[r].test(output)) {
                var as = 'as' + r.charAt(0).toUpperCase() + r.slice(1);
                var value = Math.floor(moment.duration(milliseconds - totalMilliseconds)[as]()).toString();
                var replacements = output.match(matchRegexps[r]).length - value.length;
                output = output.replace(replaceRegexps[r], value);
                while (replacements > 0 && replaceRegexps[r].test(output)) {
                    output = output.replace(replaceRegexps[r], '0');
                    replacements--;
                }
                output = output.replace(matchRegexps[r], '');

                var temp = {};
                temp[r] = value;
                totalMilliseconds += moment.duration(temp).asMilliseconds();
            }
        }
        return output;
    };
    moment.duration.fn.compare = function (b) {
        if (nullundef.contains(b)) { return; }
        return (+this).compare(+b);
    };
    moment.duration.fn.multiplication = function (b) {
        if (nullundef.contains(b)) { return null; }
        return moment.duration((+this) * b);
    };
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        return $("<li>").toggleClass('ui-state-disabled', item.value === "").prop("title", item.title).data("value", item.value).html(item.label).appendTo(ul);
    };

    String.prototype.linkify = String.linkify || function () {
        //http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };
    String.prototype.compare = String.compare || function (b, case_sen, acent_sen) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        var a = this;
        if (nullundef.contains(a) || nullundef.contains(b)) { return; }
        if (!case_sen && !acent_sen) {
            a = a.normalize(); b = b.normalize();
        } else {
            if (!case_sen) { a = a.toUpperCase(); b = b.toUpperCase(); }
            if (!acent_sen) { a = a.noAcents(!case_sen); b = b.noAcents(!case_sen); }
        }
        return a.localeCompare(b);
    };
    String.prototype.fulltrim = String.fulltrim || function () {
        //http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };
    String.prototype.trim = String.trim || function () {
        //http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
        return this.replace(/^\s+|\s+$/g, '').replace(/\[ \t]+/g, ' ');
    };
    String.prototype.trimSingleLine = String.trimSingleLine || function () {
        //http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
        return this.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    };
    String.prototype.trimMultiLine = String.trimMultiLine || function () {
        //http://javascript.info/tutorial/ahchors-and-multiline-mode
        return this.replace(/^\s+|\s+$/g, '').replace(/\r\n/g, "\n").replace(/\n{2,}/g, '\n\n');
    };
    String.prototype.noAcents = String.noAcents || function (min) {
        if (min) { 
			this.replaceAll("[áà]", "a").replaceAll("[éè]", "e").replaceAll("[íì]", "i").replaceAll("[óöò]", "o").replaceAll("[úüù]", "u")
			.replaceAll("ñ", "n"); 
		}
        return this.replaceAll("[ÁÀ]", "A").replaceAll("[ÉÈ]", "E").replaceAll("[ÍÌ]", "I").replaceAll("[ÓÖÒ]", "O").replaceAll("[ÚÜÙ]", "U")
		.replaceAll("Ñ", "N");
    };
    String.prototype.endsWith = String.endsWith || function (suffix) {
        //http://stackoverflow.com/questions/280634/endswith-in-javascript
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    String.prototype.format = String.format || function () {
        //http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== undefined ? args[number] : match;
        });
    };
    String.prototype.contains = String.contains || function (it) {
        //http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring-in-javascript
        return this.indexOf(it) !== -1;
    };
    String.prototype.right = String.right || function (chars) {
        return this.substring(this.length - chars);
    };
    String.prototype.insertAt = String.insertAt || function (s, idx) {
        //http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
        return (this.slice(0, idx) + s + this.slice(idx));
    };
    String.prototype.normalize = String.normalize || function () {
        var term = this.toUpperCase().noAcents();
        var maps = String.prototype.normalize.map;
        for (var i = 0, map; i < maps.length; i++) {
            map = maps[i];
            term = term.replaceAll(map[0], map[1]);
        }
        return term;
    };
    String.prototype.normalize.map = [
        ["CA", "KA"], ["CO", "KO"], ["CU", "KU"], ["CR", "KR"], ["CL", "KL"], ["CE", "SE"], ["CI", "SI"], ["CY", "SI"], ["Z", "S"], ["GA", "JA"], ["GE", "JE"], ["GI", "JI"],
        ["GO", "JO"], ["GU", "JU"], ["YA", "JA"], ["YE", "JE"], ["V", "B"], ["XO", "SO"], ["XI", "JI"], ["Y", "I"]
    ];
    String.prototype.repeat = String.repeat || function (times) {
        var result = "";
        while (times-- > 0) { result += this; }
        return result;
    };
    String.prototype.replaceAll = String.replaceAll || function (find, replace) {
        //http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
        return this.replace(new RegExp(find, 'g'), replace);
    };
	String.prototype.replaceAt = String.replaceAt || function(index, character){
		//http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
		return this.slice(0, index) + character + this.slice(index+character.length);
	};
    Number.prototype.compare = Number.compare || function (b) {
        if (nullundef.contains(b)) { return; }
        var a = +this;
        return a < b ? -1 : a === b ? 0 : 1;
    };
    Array.prototype.where = Array.where || function (predicate, self, filteredout, max) {
        //http://jsperf.com/array-filter-vs-jquery-filter-vs-custom-array-where/8
        if (!predicate) { throw new Error("predicate es requerido"); }
        var results = self ? this : [];
        for (var i = 0, length = this.length, item; i < length;) {
            item = this[i];
            if (predicate(item)) {
                if (!self) {
                    if (max !== undefined && --max === 0) { break; }
                    results.push(item);
                }
                i++;
            } else {
                if (self) { results.splice(i, 1)[0]; length--; } else { i++; }
                if (filteredout) { filteredout.push(item); }
            }
        }
        return results;
    };
    Array.prototype.remove = Array.remove || function (v) {
        //http://stackoverflow.com/questions/3596089/how-to-add-and-remove-array-value-in-jquery
        this.splice(this.indexOf(v) === -1 ? this.length : this.indexOf(v), 1);
        return this;
    };
    Array.prototype.removeAt = Array.removeAt || function (index) {
        if (index === -1) { return this; }
        this.splice(index, 1);
        return this;
    };
    Array.prototype.clone = Array.clone || function () {
        //http://davidwalsh.name/javascript-clone-array
        return this.slice(0);
    };
    Array.prototype.insertAt = Array.insertAt || function (index, item) {
        //http://stackoverflow.com/questions/586182/javascript-insert-item-into-array-at-a-specific-index
        if (index === -1 || item === undefined) { return this; }
        this.splice(index, 0, item);
        return this;
    };
    Array.prototype.find = Array.find || function (predicate) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        for (var i = 0, length = this.length, item = this[i]; i < length; item = this[++i]) { if (predicate(item)) { return item; } }
    };
    Array.prototype.avg = Array.avg || function () {
        //http://stackoverflow.com/questions/10359907/array-sum-and-average
        var sum, j;
        sum = j = 0;
        for (var i = 0; i < this.length; i++) { if (isFinite(this[i]) && this[i] !== null) { sum += parseFloat(this[i]); j++; } }
        if (j === 0) { return 0; } else { return sum / j; }
    };
    Array.prototype.contains = Array.prototype.contains || function (item) {
        return this.indexOf(item) !== -1;
    };
    Boolean.prototype.compare = Boolean.prototype.compare || function (b) {
        if (nullundef.contains(b)) { return; }
        return Number(this).compare(Number(b));
    };
    Date.prototype.compare = Date.compare || function (b) {
        if (nullundef.contains(b)) { return; }
        //return this.getTime().compare(b.getTime());
        return (+this).compare(+b);
    };

    $('[type=submit], [type=button], button, a').livequery(function () { $(this).button(); });
    //$('.map').livequery(function () {
    //    if (!window.google) {

    //    }
    //    create(this);
    //    function create() {
    //        var mapOptions = {
    //            center: new google.maps.LatLng(-34.397, 150.644),
    //            zoom: 8,
    //            mapTypeId: google.maps.MapTypeId.ROADMAP
    //        };
    //    }
    //});
    $('textarea').livequery(function () { if ($(this).data("nogrow")) { return; } $(this).autosize(); });
    $('.tabs').livequery(function () { $(this).tabs(); });
    $('.buttonset').livequery(function () { $(this).buttonset(); });
    setInterval(function () {
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: '../keepalive.aspx/webmethod',
        });
    }, 60000);
    moment.locale(navigator.language);

    $.comex = {
        singout: function (e) {
            e.preventDefault();
            $.ajax({
                async: false,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                url: '../keepalive.aspx/' + 'singout',
                success: function () { location.reload(); }
            });
        },
        newguid: function () {
            //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        email: {
            //http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
            //http://www.regular-expressions.info/email.html
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#Special_characters_in_regular_expressions
            pattern: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:[.][a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9][a-z0-9-]*[a-z0-9](?:[.][a-z0-9][a-z0-9-]*[a-z0-9])*[.][a-z]{2,4}$/,
            message: function (val) { return "No tiene el formato permitido"; }
        },
        patternrfc: function () {
            //http://regexlib.com/REDetails.aspx?regexp_id=2703
            return "^([A-Z&amp;]{3}|[A-Z]{4})(\\d{2}(0[1-9]|1[0-2])(0[1-9]|1\\d)|\\d{2}(0[13-9]|1[0-2])(2\\d|30)|\\d{2}(0[13578]|1[02])31|\\d{2}02(2[0-8])|([02468][048]|[13579][26])0229)\\w{2}[A\\d]$";
        },
        RFC_F: {
            //http://regexlib.com/REDetails.aspx?regexp_id=2703
            //http://www.mariovaldez.net/files/IFAI%200610100135506%20065%20Algoritmo%20para%20generar%20el%20RFC%20con%20homoclave%20para%20personas%20fisicas%20y%20morales.odt
            message: function (val) {
                for (var i = 0, tests = $.comex.RFC_F.tests, test; i < tests.length; i++) {
                    test = tests[i];
                    if (!test[0].test(val)) { return test[1]; }
                }
            },
            pattern: /^[A-ZÑ]{4}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)[1-9A-NP-Z]{2}[A\d]$/,
            tests: [
                [/^[A-ZÑ]/, "Posición 1: solo acepta letras y ñ"],
                [/^.[A-ZÑ]/, "Posición 2: solo acepta letras y ñ"],
                [/^.{2}[A-ZÑ]/, "Posición 3: solo acepta letras y ñ"],
                [/^.{3}[A-ZÑ]/, "Posición 4: solo acepta letras y ñ"],
                [/^.{4}\d/, "Posición 5: solo acepta números"],
                [/^.{5}\d/, "Posición 6: solo acepta números"],
                [/^.{6}\d/, "Posición 7: solo acepta números"],
                [/^.{7}\d/, "Posición 8: solo acepta números"],
                [/^.{6}(?:0[1-9]|1[0-2])/, "Posición 7-8: solo acepta meses MM"],
                [/^.{8}\d/, "Posición 9: solo acepta números"],
                [/^.{9}\d/, "Posición 10: solo acepta números"],
                [/^.{8}(?:0[1-9]|[12]\d|3[01])/, "Posición 9-10: solo acepta días DD"],
                [
                    /^.{4}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)/,
                    "Posición 5-10: solo acepta fechas AAMMDD"
                ],
                [/^.{10}[1-9A-NP-Z]/, "Posición 11: solo acepta catacteres 1-9, A-N, P-Z"],
                [/^.{11}[1-9A-NP-Z]/, "Posición 12: solo acepta catacteres 1-9, A-N, P-Z"],
                [/^.{12}[\dA]/, "Posición 13: solo acepta números y A"]
            ]
        },
        RFC_M: {
            message: function (val) {
                for (var i = 0, tests = $.comex.RFC_F.tests, test; i < tests.length; i++) {
                    test = tests[i];
                    if (!test[0].test(val)) { return test[1]; }
                }
            },
            pattern: /^[\d&A-Z Ñ]{3}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)[1-9A-NP-Z]{2}[A\d]$/,
            tests: [
                [/^[A-Z]/, "Posición 1: solo acepta letras"],
                [/^.[A-Z]/, "Posición 2: solo acepta letras"],
                [/^.{2}[A-Z]/, "Posición 3: solo acepta letras"],
                [/^.{3}\d/, "Posición 4: solo acepta números"],
                [/^.{4}\d/, "Posición 5: solo acepta números"],
                [/^.{5}\d/, "Posición 6: solo acepta números"],
                [/^.{6}\d/, "Posición 7: solo acepta números"],
                [/^.{5}(?:0[1-9]|1[0-2])/, "Posición 6-7: solo acepta meses MM"],
                [/^.{7}\d/, "Posición 8: solo acepta números"],
                [/^.{8}\d/, "Posición 9: solo acepta números"],
                [/^.{7}(?:0[1-9]|[12]\d|3[01])/, "Posición 8-9: solo acepta días DD"],
                [
                    /^.{3}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)/,
                    "Posición 4-9: solo acepta fechas AAMMDD"
                ],
                [/^.{9}[1-9A-Z]/, "Posición 10: solo acepta letras y números 1-9"],
                [/^.{10}[1-9A-Z]/, "Posición 11: solo acepta letras y números 1-9"],
                [/^.{11}[\\dA]/, "Posición 13: solo acepta números y A"]
            ]
        },
        CURP: {
            //http://regexlib.com/REDetails.aspx?regexp_id=1868
            //http://www.condusef.gob.mx/index.php/clave-unica-de-registro-de-poblacion
            //http://www.gobernacion.gob.mx/work/models/SEGOB/Resource/231/1/images/InstructivoParaLaCurp_v2008.pdf
            message: function (val) {
                for (var i = 0, tests = $.comex.CURP.tests, test; i < tests.length; i++) {
                    test = tests[i];
                    if (!test[0].test(val)) { return test[1]; }
                }
            },
            pattern: /^[A-Z][AEIOUX][A-Z]{2}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)[HM](?:AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z\d]\d$/,
            tests: [
                [/^[A-Z]/, "Posición 1: solo acepta letras"],
                [/^.[AEIOUX]/, "Posición 2: solo acepta vocales y X"],
                [/^.{2}[A-Z]/, "Posición 3: solo acepta letras"],
                [/^.{3}[A-Z]/, "Posición 4: solo acepta letras"],
                [/^.{4}\d/, "Posición 5: solo acepta números"],
                [/^.{5}\d/, "Posición 6: solo acepta números"],
                [/^.{6}\d/, "Posición 7: solo acepta números"],
                [/^.{7}\d/, "Posición 8: solo acepta números"],
                [/^.{6}(?:0[1-9]|1[0-2])/, "Posición 7-8: solo acepta meses MM"],
                [/^.{8}\d/, "Posición 9: solo acepta números"],
                [/^.{9}\d/, "Posición 10: solo acepta números"],
                [/^.{8}(?:0[1-9]|[12]\d|3[01])/, "Posición 9-10: solo acepta días DD"],
                [
                    /^.{4}(?:\d{2}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[02468][048]|[13579][26])0229)/,
                    "Posición 5-10: solo acepta fechas AAMMDD"
                ],
                [/^.{10}[HM]/, "Posición 11: solo acepta sexos H, M"],
                [
                    /^.{11}(AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)/,
                    "Posición 12-13: solo acepta entidades AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE"
                ],
                [/^.{13}[BCDFGHJKLMNPQRSTVWXYZ]/, "Posición 14: solo acepta consonantes"],
                [/^.{14}[BCDFGHJKLMNPQRSTVWXYZ]/, "Posición 15: solo acepta consonantes"],
                [/^.{15}[BCDFGHJKLMNPQRSTVWXYZ]/, "Posición 16: solo acepta consonantes"],
                [/^.{16}[A-Z\d]/, "Posición 17: solo acepta letras y números"],
                [/^.{17}\d/, "Posición 18: solo acepta números"]
            ],
            match: {
                ApellidoP: undefined,
                ApellidoM: undefined,
                Nombres: undefined,
                FechaN: undefined,
                Sexo: undefined,
                EntidadN: undefined
            },
            prep: ["DA", "DAS", "DE", "DEL", "DER", "DI", "DIE", "DD", "EL", "LA", "LOS", "LAS", "LE", "LES", "MAC", "MC", "VAN", "VON", "Y"],
            message2: function (val, row) {
                var rfc = this;
                return "^{0}.{1}.{2}{3}".format(
                    rfc.match.ApellidoP ? inicial(row.cell(rfc.match.ApellidoP).val()) : ".",
                    rfc.match.ApellidoM ? (row.cell(rfc.match.ApellidoM).isVal() ? inicial(row.cell(rfc.match.ApellidoM).val()) : "X") : ".",
                    rfc.match.FechaN && row.cell(rfc.match.FechaN).isVal() ? row.cell(rfc.match.FechaN).val().format("YYMMDD") : "....",
                    rfc.match.Sexo && row.cell(rfc.match.Sexo).isVal() ? row.cell(rfc.match.Sexo).val() : "."
                );
                function inicial(apellido) {
                    var pia = 0;
                    apellido = apellido.toUpperCase().replaceAll("Ü", "U");
                    for (var i = 0; i < rfc.prep.length; i++) { if (apellido.indexOf(rfc.prep[i] + " ", pia) === pia) { pia += rfc.prep[i].length + 1; } }
                    pia = apellido[pia];
                    if (["Ñ", ".", "-", "/"].contains(pia)) { pia = "X"; }
                    return pia.noAcents();
                }
            }
        },
        hours: {
            //http://www.mkyong.com/regular-expressions/how-to-validate-time-in-24-hours-format-with-regular-expression/
            pattern: /(?:\d+):[0-5]\d/,
            message: function (val) { return "Debe tener el formato HH:MM"; }
        },
        phone: {
            //http://stackoverflow.com/questions/2113908/what-regular-expression-will-match-valid-international-phone-numbers
            //https://countrycode.org/
            //https://www.ietf.org/rfc/rfc3966.txt
            //http://blogs.technet.com/b/nexthop/archive/2011/11/30/assigning-telephone-numbers-to-lync-enterprise-voice-users.aspx
            pattern: /^tel:(?:[+](?:(?:9[976]\d|8[987530]\d|6[987]\d|50[01345789]|59\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[8765431]|4[987654310]|3[96210]|2[70]|7)\d{1,14}|1\d{10}|3[34]\d{9}|52\d{10}|50[26]\d{8}|521\d{10})(?:;ext=\d{1,4})?)|(?:\d{1,14};phone-context=\w+)$/,
            message: function (val) { return "Teléfono invalido" }
        },
		phonemovilext: {
            //http://stackoverflow.com/questions/2113908/what-regular-expression-will-match-valid-international-phone-numbers
            //https://countrycode.org/
            //https://www.ietf.org/rfc/rfc3966.txt
            //http://blogs.technet.com/b/nexthop/archive/2011/11/30/assigning-telephone-numbers-to-lync-enterprise-voice-users.aspx
            pattern: /^tel:(?:[+](?:(?:9[976]\d|8[987530]\d|6[987]\d|50[01345789]|59\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[8765431]|4[987654310]|3[96210]|2[70]|7)\d{1,14}|1\d{10}|3[34]\d{9}|50[26]\d{8}|521\d{10})(?:;ext=\d{1,4})?)|(?:\d{1,14};phone-context=\w+)$/,
            message: function (val) { return "Teléfono invalido" }
        },
        phonemovil: {
            //http://stackoverflow.com/questions/2113908/what-regular-expression-will-match-valid-international-phone-numbers
            //https://countrycode.org/
            //https://www.ietf.org/rfc/rfc3966.txt
            //http://blogs.technet.com/b/nexthop/archive/2011/11/30/assigning-telephone-numbers-to-lync-enterprise-voice-users.aspx
            pattern: /^tel:(?:[+](?:(?:9[976]\d|8[987530]\d|6[987]\d|50[01345789]|59\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[8765431]|4[987654310]|3[96210]|2[70]|7)\d{1,14}|1\d{10}|3[34]\d{9}|50[26]\d{8}|521\d{10}))$/,
            message: function (val) { return "Teléfono invalido" }
        },
        compare: function compare(a, b, case_sen, acent_sen) {
            if (nullundef.contains(a) || nullundef.contains(b)) { return; }
            if (a.constructor !== b.constructor) { return; }
            var result;
            if (typeof a === 'string' && !isNaN(a) && !isNaN(b)) {
                result = Number(a).compare(Number(b));
            } else if (a.compare) {
                result = a.compare(b, case_sen, acent_sen);
            } else { result = a.toString().compare(b.toString()); }
            return result;
        }
    };
})(jQuery);

// Prevent the backspace key from navigating back. http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((
                d.tagName.toUpperCase() === 'INPUT'
                && ["TEXT", "PASSWORD", "FILE", "EMAIL", "SEARCH", "DATE", "NUMBER", "DATETIME-LOCAL"].contains(d.type.toUpperCase())
             ) || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else { doPrevent = true; }
    }
    if (doPrevent) { event.preventDefault(); }
});

var IDatabase = function () {
    if (IDatabase._new) {
        delete IDatabase._new;
        var database = this;
        database.objecttype = 'database';
        database.indexes = [];
        database._tables = [];
        database._tables.toString = function () { return "Tablas"; };
        database._tables._cols = [{ title: "Tabla" }];
        database._tables.str = database._tables._cols[0];
        database._tables.table = {
            title: ["Tablas", "Tabla"], cols: function () { return database._tables._cols; }, toString: function () { return this.title[0]; }
        };

        database.htmltable = function (value, tablevv, update, showcontrols) {
            var table = tablevv ? tablevv : value.data('table');
            var colsdef = tablevv ? table.colsdef : value.data('colsdef');
            var $database = this;
            var rows;
            if ($.type(table) === 'string') { table = $table(table); }
            if (colsdef === undefined) {
                colsdef = table.colsdef = table.cols()
                    .where(function (col) { return col.type !== "Textarea"; })
                    .map(function (col) { return col.title === "Sesión" ? "Sesión >Colaborador" : col.title; });
            }
            if (!table._contextMenu) {
                var contextMenu = { selector: '[contextmenu=cm_{0}]'.format(table.title[2]) };
                contextMenu.items = contextMenu.items || {};
                contextMenu.items.view = {
                    name: "Ver",
                    callback: function () { $database.form(this.closest('tr').data('row'), undefined, false); }
                };
                if (table.edit) {
                    contextMenu.items.edit = {
                        name: "Editar",
                        icon: "edit",
                        callback: function () { $database.form(this.closest('tr').data('row'), undefined, table.update); }
                    };
                }
                if (table.delete) {
                    contextMenu.items.delete = {
                        name: "Eliminar",
                        icon: "delete",
                        callback: function () {
                            if (confirm('¿Seguro que quieres eliminar esta línea?')) {
                                try {
                                    var row = this.closest('tr').data('row').action("DELETE");
                                    if (table.objecttype !== 'view') { row.table.database.data(row); }
                                    this.closest('table').data('htmltable')();
                                } catch (e) { alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(e.message)); }
                            }
                        }
                    };
                }
                if (table.contextMenu) { $.extend(contextMenu.items, table.contextMenu); }
                if (contextMenu.items) { $.contextMenu(contextMenu); }
                table._contextMenu = true;
            }
            table.pager = table.pager || {};
            table.pager.rowsPerPage = table.pager.rowsPerPage || 20;



            print();
            function refreshrows() {
                rows = table.rows()
                    .where(function (row) { return row.action() !== "DELETE"; });
                if (update && table.insert && rows.length === 0 && table.objecttype === 'view' && table.relation[2] > 0) {
                    table.rows('NEW');
                    rows = table.rows()
                        .where(function (row) { return row.action() !== "DELETE"; });
                }
                table.pager._pages = Math.ceil((rows.length) / table.pager.rowsPerPage);
            }


            function print() {
                value.empty();
                refreshrows();
                table.pager._currentPage = 1;
                value
                    .append($('<table>')
                        .append($('<caption>')
                            .append((update || showcontrols) && table.insert && (table.objecttype !== 'view' || table.relation[3] === undefined || rows.length < table.relation[3]) ? $('<button>').prop('type', 'button').html('Añadir').on('click', function () {
                                if (table.objecttype === 'view') {
                                    table.rows('NEW');
                                    print();
                                } else { $database.form(table.rows('NEW'), undefined, table.insert).on('submited', function () { print(); }); }
                            }) : undefined)
                            .append(rows.length > 0 ? $('<button>').prop('type', 'button').html('Exportar').on('click', function () {
                                $('<div>')
                                    .append($('<textarea style="width: 100%;">').html(rows.exporttvs(colsdef))).dialog({ width: "842px", modal: true });
                            }) : undefined)
                            .append(table.insert && table.update ? $('<button>').prop('type', 'button').html('Importar').on('click', function () {
                                var map, step;
                                map = [];
                                map.objecttype = 'map';
                                map.tableDestino = table;
                                map.insert = true;
                                map.update = true;
                                map.delete = true;
                                step = 1;
                                $("<form>")
                                    .append($("<textarea style=\"width:100%;\">").prop('required', true).on("change", function () { map.tableOrigen = $(this).val(); }))
                                    .append($('<button>').prop('type', 'submit').html('Siguiente'))
                                    .on("submit", function (e) {
                                        e.preventDefault();
                                        var form = $(this).empty();
                                        if (step === 1) {
                                            step = 2;
                                            map.tableOrigen = $.tsv.parseRows(map.tableOrigen, { stripHeader: true });
                                            var t = table.database.tables({
                                                title: ["Tabla origen", "Fila origen"],
                                                permisos: [true, false, false, false],
                                                cols: map.tableOrigen[-1].map(function (col) { return { title: col }; })
                                            });
                                            t._rows = function () {
                                                for (var i = 0, length = map.tableOrigen.length, row; i < length; i++) {
                                                    row = map.tableOrigen[i]; row.objecttype = "row"; row.table = t;
                                                    if (row.length === 1 && row[0] === "") { map.tableOrigen = map.tableOrigen.slice(0, i); break; }
                                                }
                                                return map.tableOrigen;
                                            }();
                                            map.tableOrigen = t;

                                            for (var colsDestino_i = 0, colsDestino = map.tableDestino.cols(), colsDestinoLength = colsDestino.length, colDestino,
                                            colsOrigen = map.tableOrigen.cols(), colsOrigenLength = colsOrigen.length, colOrigen, colsOrigen_i;
                                            colsDestino_i < colsDestinoLength; colsDestino_i++) {
                                                for (colsOrigen_i = 0, colDestino = colsDestino[colsDestino_i], colOrigen = undefined;
                                                    colsOrigen_i < colsOrigenLength; colsOrigen_i++) {
                                                    if (colDestino.title.toLocaleLowerCase() === colsOrigen[colsOrigen_i].title.toLocaleLowerCase()) {
                                                        colOrigen = colsOrigen[colsOrigen_i]; break;
                                                    }
                                                }
                                                map.push([colDestino, colOrigen]);
                                            }
                                            form.append(maptable(map)).append($('<button>').prop('type', 'submit').html('Siguiente'));
                                        } else if (step === 2) {
                                            for (var i = 0; i < map.length;) { if (map[i][1] === undefined) { map.remove(map[i]); } else { i++; } }
                                            map.rowsOrigen = map.tableOrigen.rows(); map.i = 0;
                                            var progress = $('<progress>').prop('max', map.rowsOrigen.length).prop('value', map.i);
                                            form.append(progress);
                                            var interval = setInterval(function () {
                                                progress.prop('value', map.i);
                                                if (map.i === map.rowsOrigen.length) { clearInterval(interval); interval = undefined; }
                                            }, 500);
                                            mergerows(map);
                                        }
                                    })
                                    .dialog({ width: "842px", modal: true });
                            }) : undefined))
                            .append($('<thead>')
                                .append($('<tr>')
                                    .append($('<th>').html(table.title[0].toString().toUpperCase() + ' (' + rows.length.toString() + ')')))));

                value
                    .append($('<div>').css('overflow', 'auto')
                        .append($('<table>').data("htmltable", print)
                            .append($('<thead>')
                                .append($('<tr>')
                                    .append($('<th>'))
                                    .append(colsdef.map(function (item) { return $('<th>').html(item.replaceAll(".", " >")); }))))
                            .append($('<tbody>'))));

                value
                    .append(function () {
                        return table.pager._pages > 1 ? $('<table>')
                            .append($('<tfoot>')
                                .append($('<tr>').addClass('pager')
                                    .append($('<th>'))
                                    .append($('<th>').prop('colspan', colsdef.length)
                                        .append($('<span>').addClass('buttonset')
                                            .append($('<button>').prop('type', 'button').addClass('first').html('«').on('click', function () { table.pager._currentPage = 1; printpage(); }))
                                            .append($('<button>').prop('type', 'button').addClass('prev').html('‹').on('click', function () { table.pager._currentPage--; printpage(); })))
                                        .append($('<span>').addClass('buttonset')
                                            .append(function () {
                                                var btns = [];
                                                for (var i = 0; i < table.pager._pages; i++) { btns[i] = $('<button>').prop('type', 'button').addClass('page').data('page', i + 1).html(i + 1).on('click', pagerpage); }
                                                return btns;
                                            }))
                                        .append($('<span>').addClass('buttonset')
                                            .append($('<button>').prop('type', 'button').addClass('next').html('Siguiente >').on('click', function () { table.pager._currentPage++; printpage(); }))
                                            .append($('<button>').prop('type', 'button').addClass('last').html('Último |').on('click', function () { table.pager._currentPage = table.pager._pages; printpage(); })))))) : undefined;
                    });
                printpage();
                function pagerpage() {
                    table.pager._currentPage = $(this).data('page');
                    printpage();
                }
            }
            function printpage() {
                //if (rows === undefined || rows.length === 0) {
                //} else {
                //    return templateItem.find('[data-cell]').each(function () {
                //        return IDatabase.td(row.cell($(this).data('cell')), $(this), false).on('change', function () { print(); })
                //    });
                //}

                value.find('tbody').empty().append(function () {
                    var trs;
                    if (rows === undefined || rows.length === 0) {
                        trs = $('<tr>')
                            .append($('<td>')
                                .addClass('ui-state-highlight').prop('colspan', colsdef.length + 1)
                                .html('No hay datos que mostrar'));
                    } else {
                        trs = rows
                            .slice((table.pager._currentPage - 1) * table.pager.rowsPerPage, ((table.pager._currentPage - 1) * table.pager.rowsPerPage) + table.pager.rowsPerPage)
                            .map(function (row) {
                                return $('<tr>').data('row', row)
                                    .append($('<th>')
                                        .attr('contextmenu', (update || showcontrols) ? 'cm_{0}'.format(table.title[2]) : undefined)
                                        .on('dblclick', function () { $database.form(row); })
                                        .html(rows.indexOf(row) + 1))
                                    .append(colsdef.map(function (coldef) { return IDatabase.td(row.cell(coldef), $('<td>'), update).on('change', function () { print(); }); }));
                            });
                    }
                    return trs;
                });
                value.find('.pager button').prop('disabled', false).each(function () {
                    $(this).prop('disabled',
                        (($(this).hasClass('first') || $(this).hasClass('prev')) && table.pager._currentPage === 1)
                        || ($(this).data('page') === table.pager._currentPage)
                        || (($(this).hasClass('last') || $(this).hasClass('next')) && table.pager._currentPage === table.pager._pages)
                    );
                }).button().button('refresh');
            }
            function maptable(map) {
                var destino = 0;
                var origen = 1;
                var table = $("<table>")
                    .append($("<thead>")
                        .append($("<tr>")
                            .append($("<th>").prop("colspan", 2).html("COLUMNAS")))
                        .append($("<tr>")
                            .append($("<th>").html("Index"))
                            .append($("<td>").addClass('editable')
                                .append($("<select>").prop("required", true).on("change", function () { map.index = $(this).find(":selected").data("index"); })
                                    .append("<option>")
                                    .append(function () {
                                        var indexes = [];
                                        for (var i = 0, cols = map.tableDestino.cols(), length = cols.length, index; i < length; i++) {
                                            index = cols[i].tindex;
                                            if (index && !indexes.contains(index)) { indexes.push(index); }
                                        }
                                        return indexes.map(function (index) { return $("<option>").data("index", index).html(index.toString()); });
                                    }))))
                        .append($("<tr>")
                            .append($("<th>").html("Destino"))
                            .append($("<th>").html("Origen"))
                            .append($("<th>").html("Insertar"))
                            .append($("<th>").html("Actualizar"))
                            .append($("<th>").html("Eliminar")))
                    )
                    .append($("<tbody>").addClass("mapbody")
                        .append(map.map(function (mapped) {
                            return $("<tr>").data("mapped", mapped)
                                .append($("<th>").html(mapped[destino].title))
                                .append($("<td>").toggleClass('editable', Boolean(mapped[destino].tindex) || !mapped[destino].readonly)
                                    .append(Boolean(mapped[destino].tindex) || !mapped[destino].readonly ? $("<select>").on("change", function () {
                                        var select = $(this);
                                        if (select.val() === "-- Mapear tabla --") {
                                            var submap = [];
                                            submap.objecttype = 'map';
                                            submap.tableDestino = mapped[destino].parent().table;
                                            submap.tableOrigen = map.tableOrigen;
                                            map[select.data("colDestinio").index] = submap;
                                            select.parent()
                                                .append(maptable(submap));
                                        } else { select.closest("tr").data("mapped")[origen] = select.find(":selected").data("colOrigen"); }
                                        updatetable();
                                    })
                                        .append("<option>")
                                        .append(map.tableOrigen.cols()
                                            .map(function (colOrigen) { return $("<option>").data("colOrigen", colOrigen).html(colOrigen.title); }))
                                        .append(function () { if (mapped[destino].parent()) { return $("<option>").html("-- Mapear tabla --"); } })
                                        .val(mapped[origen] === undefined ? undefined : mapped[origen].title)
                                    : undefined));
                        })));
                updatetable();
                return table;
                function updatetable() {
                    table.find(".mapbody option").prop("disabled", false).filter(":selected").not(":empty").not(":contains('-- Mapear tabla --')").each(function () {
                        table.find(".mapbody option:contains('{0}')".format($(this).data("colOrigen").title)).not($(this)).prop("disabled", true);
                    });
                }
            }
            return value;
        };
        database.form = function (row, formv, update) {
            var table = row.table, $database = this;
            if (!formv && !table.form) {
                table.form = $('<form>').prop('title', table.title[1])
                    .append(table.cols().map(function (col) { return $('<span data-coldef="{0}">'.format(col.title)); }));
            }
            var form = formv || table.form.clone().data('row', row);
            if (!formv && table.child() && !Boolean(table.nochilds)) {
                if (update) {
                    var notinsert = row.action() !== "INSERT",
                        notfrom = !Boolean(row.from);
                    form.append(table
                        .child()
                        .where(function (table) { return notinsert || (table[0].insert && (notfrom || table[0] !== row.from.table)); })
                        .map(function (table) { return $('<div>').append(tablerelations(table[1])); }));
                } else {
                    form.append($('<div>').addClass('tabs')
                        .append($('<ul>')
                            .append(table.child().map(function (table) {
                                return $('<li>')
                                    .append($('<a>')
                                        .prop('href', '#{0}{1}'.format(row.cell().val(), table[0].title[2]))
                                        .text(table[0].title[0]));
                            })))
                        .append(table
                            .child()
                            .map(function (table) {
                                return $('<div style="padding: initial;">').prop('id', row.cell().val() + table[0].title[2]).append(tablerelations(table[1]));
                            })));
                }
            }
            form
                .append(update ? $('<input/>').prop('type', 'submit').prop('value', 'Guardar') : undefined)
                .on('submit', function (e) {
                    e.preventDefault();
                    var submit = $(this).find('input[type=submit]').prop('disabled', true).button('refresh');
                    try {
                        $database.data($(this).data('row'));
                        form.trigger('submited');
                        form.data('submited', true);
                        form.dialog('close');
                    } catch (err) {
                        submit.prop('disabled', false).button('refresh');
                        alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(err.message));
                    }
                })
                .on('change', function () { $(this).find('.container').each(function () { IDatabase.containerUpdate($(this)); }); });
            var colsdef = form.find('[data-coldef]');
            paint();
            function paint() {
                $(colsdef).each(function () {
                    $(this).empty();
                    var coldef = $(this).data('coldef');
                    var result = row.cell(coldef);
                    var orientation = $(this).data('orientation') || (result.col && result.col.type === "Textarea" ? "V" : undefined);
                    if (!result || result.objecttype !== "view") {
                        if (table.cols(coldef).pk) { $(this).addClass('PK'); }
                        if (orientation === 'V') {
                            $(this)
                                .append($('<table>')
                                    .append($('<thead>')
                                        .append($('<tr>')
                                            .append($('<th>').html(table.cols(coldef).description || table.cols(coldef).title))))
                                    .append($('<tbody>')
                                        .append($('<tr>')
                                                .append(IDatabase.td(result, $('<td>').css('white-space', 'initial'), update)))));
                        } else {
                            $(this)
                                .append($('<table>')
                                    .append($('<tbody>')
                                        .append(IDatabase.td(result, "tr", update))));
                        }
                    } else { $database.htmltable($(this).data('table', result), undefined, update); }
                });
            }
            if (formv === undefined) {
                form.dialog({
                    width: "842px",
                    modal: true,
                    beforeClose: function () {
                        return $(this).data('submited') || !($(this).data("row").anychange()
                            && !confirm('Si cierras la ventana, se perderán los cambios realizados.\r\n¿Estás seguro que deseas cerrarla?'));
                    },
                    close: function () {
                        if (!$(this).data('submited')) { $(this).data("row").action('NOCHANGE'); }
                        $(this).empty();
                        $(this).remove();
                    }
                }).css("padding-bottom", "300px").css("background-color", "#cceffc");
            }
            return form;
            function tablerelations(relations) {
                return relations.map(function (relation) {
                    return $('<div>')
                        .append(relations.length > 1 ? $('<table>')
                            .append($('<thead>')
                                .append($('<tr>')
                                    .append($('<th>').html(relation.title)))) : undefined)
                        .append($('<div data-coldef="{0}.{1}|{2}" data-colsdef=\'{3}\'>'.format(
                            row.cell().col.title, relation.table.title[0], relation.title
                            , JSON.stringify(relation.table.cols()
                                .where(function (col) {
                                    return ((!col.parent) || col !== relation) && col.title !== 'Fecha insertado' && col.title !== 'Sesión' && !col.pk;
                                })
                            ))));
                });
            }
        };
    } else { IDatabase._new = true; return new IDatabase(); }
};
IDatabase.td = function (data, type, update) {
    var $database, settings, cell, col, coltype;
    $database = this;
    var container = type === "tr" ? $("<td>") : type;
    if (data && data.length) {
        cell = data[0].cell(data[1]);
        col = data[1][data[1].length - 1];
    } else if (data) { cell = data; col = cell.col; }
    if (col) {
        if (col.parent && col.parent.length) {
            coltype = "string";
        } else if (col.parent) {
            coltype = col.parent.table.cols("STR").type;
        } else { coltype = col.type; }
    }
    container.addClass("container").data('cell', data).addClass("ui-widget-content")
        .toggleClass('center', coltype === "Bool")
        .toggleClass('right', ['Int', "Dec", 'Date', 'Datetime', 'Duration', 'Currency'].contains(coltype));
    if (!cell) { return container; }
    var ret;
    settings = {};
    if (cell.editable) {
        settings.readonly = false;
        settings.required = false;
    } else {
        settings.readonly = !update
                || ((cell.col.table.insert && cell.row.action() === 'INSERT')
                || cell.col.table.update ? ($.type(cell.col.readonly) === 'function' ? cell.col.readonly.call(cell)
            : cell.col.readonly)
            : true);
        settings.required = !settings.readonly && cell.val() === null
            && ($.type(cell.col.required) === 'function' ? cell.col.required.call(cell) : (cell.col.str || cell.col.required));
    }
    if (settings.readonly) {
        container.prop('title', 'Solo lectura');
        if (coltype === 'Textarea') { container.addClass("textarea"); }
        if (type === "tr") {
            ret = $("<tr>")
                .append(IDatabase.th(data.length ? data[1] : col))
                .append(container);
        } else { ret = container; }
    } else {
        var control;
        container.addClass("editable");
        if (cell.col.parent || cell.parent) {
            var maxopts = 10; var parent = cell.parent || (cell.col.parent_cell && cell.col.parent_cell.val()) || cell.col.parent;
            container.on("mouseenter mouseleave", function (e) {
                var _inpp = inpp();
                if (_inpp && !_inpp.data("focus") && e.type === "mouseleave") { _inpp.remove(); }
            });
            control = $('<input>')
                .autocomplete({
                    source: function (request, response) {
                        control.autocomplete("option", "autoFocus", request.term !== "");
                        var opts = parent.tindex ? parent.tindex._getRows() : parent.clone().sortCols("STR");
                        var colse = (parent.length && parent.prepare("cols")) || parent.table.rows().prepare("cols");
                        colse.row_filter.cell(parent.length ? 0 : parent.index).val(request.term);
                        opts.search(maxopts + 1, function (progress, complete) {
                            if (complete) {
                                var resp = progress.results.map(function (row) {
                                    return { value: { row: row, toString: function () { return row.toString(); } }, label: row.cell("STR").val(undefined, "MARK") };
                                });
                                if (resp.length === 0) { resp.push({ label: 'No se encontraron resultados', value: "" }); }
                                if (resp.length > maxopts) { resp.pop(); resp.pop(); resp.push({ value: "", label: 'Lista truncada, ingresa mas criterios' }); }
                                if (!cell.col.insert && parent.table.insert && resp.length < maxopts) { resp.push({ value: "-- Añadir --", label: "-- Añadir --" }); }
                                response(resp);
                                delete colse.row_filter;
                            }
                        }, colse);
                    },
                    open: function () { control.data("open", true); },
                    close: function () { control.data("open", false); },
                    appendTo: container,
                    delay: 800,
                    minLength: 0,
                    position: { my: "left top", at: "left bottom", collision: "flip flip" },
                    select: function (event, ui) {
                        if (ui.item.value === '-- Añadir --') {
                            control.addClass('ui-autocomplete-loading');
                            var row = parent.table.rows('NEW');
                            row.from = cell;
                            row.form(function (row) {
                                control.removeClass('ui-autocomplete-loading').autocomplete("close");
                                if (row) { cell.val(row); } else { cell.val(null); }
                                container.closest("form").trigger("change");
                            }, container.closest("form"), true, "Añadir {0}".format(cell.col.title));
                        } else {
                            cell.val(ui.item.value.row);
                            container.closest("tr").trigger("change");
                        }
                    }
                })
                .on("focusin focusout", function (e) {
                    var _inpp = inpp();
                    _inpp.data("focus", true);
                    if (e.type === "focusout") { _inpp.remove(); } else if (!cell.isValid()) { control.autocomplete("search", cell.val(undefined, "CONTROL")); }
                });
            if (parent.str && parent.str.type === "Int") { control.prop("type", "number"); }
        } else {
            switch (cell.col.type) {
                case 'Int': control = $('<input>').prop('type', 'number').prop('step', cell.col.step); break;
                case 'Date':
                    control = $('<input>').prop('type', 'date')
                    .on("focusin focusout", function (e) {
                        control.data("focus", e.type === "focusin");
                        if (e.type === "focusout") { if (control.val() !== cell.val(undefined, "CONTROL")) { control.trigger("change"); } }
                    }).on("change", function (e) { if (control.data("focus")) { e.stopImmediatePropagation(); } });
                    break;
                case 'Datetime':
                    control = $('<input>').prop('type', 'datetime-local')
                    .on("focusin focusout", function (e) {
                        control.data("focus", e.type === "focusin");
                        if (e.type === "focusout") { if (control.val() !== cell.val(undefined, "CONTROL")) { control.trigger("change"); } }
                    }).on("change", function (e) { if (control.data("focus")) { e.stopImmediatePropagation(); } });
                    break;
                case 'Email': control = $('<input>').prop('type', 'email'); break;
                case 'Textarea': control = $('<textarea>'); container.addClass("textarea"); break;
                case 'Bool': control = $('<input>').prop('type', 'checkbox'); break;
                case 'Dec': control = $('<input>').prop('type', 'number').prop('step', cell.col.step); break;
                case 'url': control = $('<input>').prop('type', 'url'); break;
                default: control = $('<input>').prop('pattern', cell.col.pattern ? cell.col.pattern.pattern.source : undefined)
            }
            if (cell.col.indexMatch) { control.prop("spellcheck", false); }
        }
        if (cell.col.delay) {
            control.on("keyup", function () {
                clearTimeout(control.timeout);
                control.timeout = setTimeout(function () { control.trigger("change"); }, cell.col.delay);
            }).on("change", function (e) { if (cell.val(undefined, "CONTROL") === control.val()) { e.stopImmediatePropagation(); } });
        }
        var hiddendiv = $('<div>').addClass('hiddendiv');
        container
            .append(control
                .addClass('control')
                .on('change', function (e) {
                    if (control.hasClass("ui-autocomplete-loading")) { e.stopImmediatePropagation(); }
                    clearTimeout(control.timeout);
                    cell.val(cell.col.type === "Bool" ? control.prop('checked') : control.val(), "CONTROL");
                    IDatabase.containerUpdate(container);
                })
                .on("keydown keyup input propertychange", function () { hiddendiv.text("{0}___".format(control.val())); })
            )
            .append(hiddendiv);
        if (type === "tr") {
            var id = cell.row.cell("PK");
            if (id) { id = "{0}_{1}".format(id.val(), cell.col.index); } else { id = "{0}_{1}".format(cell.col.title, cell.col.index); }
            control.prop("id", id);
            ret = $("<tr>")
                .append(IDatabase.th(data.length ? data[1] : col, id))
                .append(container);
        } else { ret = container; }
    }
    function inpp() {
        var inp = container.find(".busAva");
        if (!control.prop("disabled") && !inp.length) {
            inp = $("<div>").addClass("busAva")
                .append($("<i>").addClass("fa fa-ellipsis-h").prop("title", "Busqueda avanzada...")
                    .on("mousedown", function (e) {
                        e.stopImmediatePropagation(); e.preventDefault();
                        control.addClass('ui-autocomplete-loading');
                        var rows_p = cell.col.parent.length ? cell.col.parent : cell.col.parent.table.rows();
                        if (!cell.isValid()) {
                            var ccccols = rows_p.prepare("form");
                            ccccols.row_filter.cell((cell.col.parent_cell && cell.col.parent_cell.val().title) || cell.col.parent.str)
                                .val(cell.val(undefined, "CONTROL"));
                        }
                        var form = container.closest("form");
                        if (!form.length) { form = $('#tabledisplay'); }
                        rows_p.formsear(function (row) {
                            if (!row.action || row.action() === "NOCHANGE") {
                                cell.val(row);
                                IDatabase.containerUpdate(container).trigger("change");
                                setTimeout(function () { container.closest("form").trigger("change"); }, 1000);
                            }
                            control.removeClass('ui-autocomplete-loading').autocomplete("close").focus();
                        }, form, "form", "Buscar {0}".format(cell.col.title), control);
                    }))
                .append($("<i>").addClass("fa fa-caret-down")
                    .on("mousedown", function (e) {
                        e.preventDefault();
                        if (control.data("open")) {
                            control.autocomplete("close");
                        } else if (cell.isValid()) {
                            control.select().autocomplete("search", "");
                        } else { control.select().autocomplete("search", cell.val(undefined, "CONTROL")); }
                    }));
            container.append(inp);
            inp.position({ of: container, my: "right center", at: "right center", collision: "none none" });
        }
        return inp;
    }
    IDatabase.containerUpdate(container);
    return ret;
};
IDatabase.th = function (col, id) {
    var tag = $("<th>").addClass("ui-widget-header").data("col", col);
    var innertag;
    if (isNaN(id)) {
        innertag = $("<label>").prop("for", id);
        tag.hover(function () { $(this).addClass("ui-state-hover"); }, function () { $(this).removeClass("ui-state-hover"); }).append(innertag);
    } else {
        innertag = tag;
        if (col.contextMenu) { tag.attr('contextmenu', col.contextMenu.toString()); }
    }
    innertag.html(col.length ? col.join(" >") : col.title);
    if (!col.length && !col.readonly && col.required) {
        innertag.append($("<i>").addClass("fa").addClass("fa-asterisk").addClass("ui-state-highlight").addClass("ui-corner-all").prop("title", "Campo requerido"));
    }
    if (col.length) { col = col[col.length - 1]; }
    if (col.explicacion) { innertag.append($('<i>').addClass("fa").addClass("fa-question-circle").addClass("fa-lg").prop("title", col.explicacion)); }
    return tag;
};
IDatabase.containerUpdate = function (container) {
    var cell, control, hiddendiv;
    control = container.find('.control'); cell = container.data("cell"); hiddendiv = container.find(".hiddendiv");
    if (cell && cell.length) { cell = cell[0].cell(cell[1]); }
    if (cell && cell.validity && ["Int", "Date", "Datetime"].contains(cell.col.type) && !cell.col.parent) {
        if (cell.validity.badInput) {
            control.prop("type", "text")
        } else if (control.prop("type") === "text") {
            if (cell.col.type == "Int") {
                control.prop("type", "number");
            } else if (cell.col.type == "Date") {
                control.prop("type", "date");
            } else { control.prop("type", "datetime-local"); }
        }
    }
    if (control.length) {
        container
            .prop("title", cell.validationMessage())
            .toggleClass('invalid', !cell.disabled && !cell.validity.valid)
            .toggleClass('inserted', !cell.disabled && cell.validity.valid && cell.action() === "INSERT")
            .toggleClass('updated', !cell.disabled && cell.validity.valid && cell.action() === "UPDATE")
            .toggleClass('deleted', !cell.disabled && cell.validity.valid && cell.action() === "DELETE")
            .toggleClass('editable', !cell.disabled);
        control
            .prop('min', cell.col.format(cell.min, "CONTROL") || cell.col.format(cell.col.min, "CONTROL"))
            .prop('max', cell.col.format(cell.max, "CONTROL") || cell.col.format(cell.col.max, "CONTROL"))
            .prop('required', cell.required || cell.col.required)
            .prop('disabled', !!cell.disabled);
        if (cell.col.type === "Bool") { control.prop('checked', cell.val(undefined, "CONTROL")); } else {
            control.val(cell.val(undefined, "CONTROL"));
            hiddendiv.text("{0}___".format(cell.val(undefined, "CONTROL")));
        }
        control.get(0).setCustomValidity("");
        if (cell.validity.badInput || cell.validity.tooLong || cell.validity.valueDuplicated) { control.get(0).setCustomValidity(cell.validationMessage()); }
    } else { container.html(cell ? cell.val(undefined, "MARK").replaceAll("\n", "<br />") : ""); }
    //if (cell && cell.col.parent && cell.isValid() && cell.isVal() && $.type(cell.col.parent) !== "array") {
    //    container.attr("contextmenu", cell.val().table.contextMenu().toString());
    //    container.on("mouseup", function (e) {
    //        if (e.which === 3) {
    //            container.closest("tbody").find("th, .container").removeClass("ui-state-active");
    //            container.addClass("ui-state-active");
    //        }
    //    });
    //} else { container.removeAttr("contextmenu"); }

    return container;
};
IDatabase.data = function (data, caller) {
    var database = this, table, rows, relations, rowsTable, newrows;
    if (data.objecttype === 'table') {
        if (data.title[2]) { table = { name: data.title[2] }; }
        else { data._rows = []; caller(); return; }
    } else {
        if (data.objecttype === 'row') { rows = [data]; } else { rows = data; }
        rowsTable = rows[0].table;
        relations = rowsTable.relations.map(function (relation) {
            if (relation.table.insert || relation.table.update) {
                var relationRows = relation.table.rows().where(function (row) { return rows.contains(row.cell(relation).val()) && row.action() !== "NOCHANGE"; });
                if (relationRows.length) { relationRows.col = relation; return relationRows; }
            }
        }).where(function (relation) { return relation !== undefined; });
        rows = rows.where(function (row) { return row.action() !== 'NOCHANGE'; });
        if (!rows.length && !relations.length) { caller(); return; }
        if (rowsTable.title[2]) {
            table = {
                name: rowsTable.title[2],
                rows: rows.map(rowsMap)
            };
            if (relations.length) {
                table.childs = relations.map(function (relation) {
                    return {
                        name: relation.col.table.title[2],
                        childcol: relation.col.index,
                        rows: relation.map(rowsMap)
                    };
                });
            }
        } else {
            newrows = [];
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].action() === "DELETE") {
                    newrows.push(rows[i].map(function () { return null; }));
                } else { newrows.push(rows[i].cell().map(function (cell) { return cell.val(undefined, "JSON"); })); }
            }
            rowsupdate(rows, newrows); caller(); return;
        }
    }
    //http://api.jquery.com/jquery.ajax/
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({ json: JSON.stringify(table) }),
        url: '{0}/getTable'.format($(location).attr('pathname').endsWith('.aspx') ? $(location).attr('pathname') : 'default.aspx'),
        xhr: function (XMLHttpRequest) {
            //http://www.dave-bond.com/blog/2010/01/JQuery-ajax-progress-HMTL5/
            //Download progress
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function (evt) {
                console.log("{0}: {1}".format("evt.lengthComputable", evt.lengthComputable));
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with download progress
                    console.log(percentComplete);
                }
            }, false);
            return xhr;
        },
        success: function (dataout) {
            try {
                dataout = $.parseJSON(dataout.d);
                if (data.objecttype === 'table') {
                    for (var i = 0, newrow; i < dataout.rows.length; i++) {
                        newrow = dataout.rows[i];
                        newrow.objecttype = 'row';
                        newrow.table = data;
                    }
                    data._rows = dataout.rows;
                } else {
                    rowsupdate(rows, dataout.rows);
                    for (var relation_i = 0; relation_i < relations.length; relation_i++) { rowsupdate(relations[relation_i], dataout.childs[relation_i].rows); }
                }
            } catch (e) { alert("Ocurrio un error:\n{0}\nComunícate a la extensión 2152".format(dataout.d)); }
            caller();
        },
        error: function (jqxhr, status, errorMsg) { alert("Ocurrio un error:\n{0}\nComunícate a la extensión 2152".format(errorMsg)); }
    });
    function rowsMap(row) {
        return row.cell().map(function (cell) {
            if (cell.col.index === 0 && (row.action() === "DELETE" || (row.action() === "INSERT" && !cell.col.identity))) {
                return "{0}{1}".format(row.action()[0], cell.val(undefined, "JSON"));
            }
            return cell.val(undefined, "JSON");
        });
    }
    function rowsupdate(rows, newrows) {
        for (var row_i = 0, row, newrow, cell_i, cells; row_i < rows.length; row_i++) {
            row = rows[row_i]; newrow = newrows[row_i];
            for (cell_i = 0, cells = row.cell() ; cell_i < cells.length; cell_i++) { cells[cell_i].val(newrow[cell_i], "JSON"); delete cells[cell_i]._ori; }
            if (row._action === "DELETE") { cascade(row); }
            delete row._action;
        }
    }
    function cascade(row) {
        var i = 0;
        for (var rels = row.relations(), j, rel, k ; i < rels.length; i++) {
            for (j = 0, rel = rels[i]; j < rel.length; j++) { if (rel.relation.cascade) { for (k = 0; k < rel.length; k++) { cascade(rel[k]); } } }
        }
        i = 0;
        for (var cells = row.cell() ; i < cells.length; i++) { cells[i].val(null); delete cells[i]._ori; }
        row.table._rows.remove(row);
    }
};
IDatabase.prototype = {
    tables: function (data) {
        "use strict";
        var database = this, table;
        if (!data) { return database._tables; }
        if (data.objecttype === "table") {
            if (data.database !== database) { throw new Error("La tabla: {0} no pertenece a esta base de datos".format(data.title[0])); }
            return data;
        }
        if (typeof data === "string") {
            table = database._tables.find(function (table) { return table.title[0] === data; });
            if (!table) { throw new Error('No se encontro la tabla: {0}'.format(data)); }
            return table;
        }
        if (typeof data === 'object') {
            data = ITable(data, database);
            database._tables.push(data);
            return data;
        }
        throw new Error('No se encontro la tabla {0}'.format(data));
    },
    data: function (data) {
        "use strict";
        var database = this;
        var newtable, errmes, oritable, table, rows, row;
        if (data.objecttype === 'table') {
            table = data;
            newtable = { name: table.title[2] };
        } else if (data.objecttype === 'row') {
            row = data;
            oritable = { name: row.table.title[2], rows: [row] };
            rows = oritable.rows;
            var pk = rows[0].table.cols('PK');
            oritable.childs = database.relations()
                .where(function (relation) { return relation[0] === pk; })
                .map(function (relation) {
                    return {
                        name: relation[1].table.title[2],
                        childcol: relation[1].index,
                        rows: rows.rows("{0}|{1}".format(relation[1].table.title[0], relation[1].title))
                    };
                });
            var func1 = function (relation) { return relation[0] === jpk; };
            var func2 = function (relation) {
                return {
                    name: relation[1].table.title[2],
                    childcol: relation[1].index,
                    rows: jrows.rows("{0}|{1}".format(relation[1].table.title[0], relation[1].title)).where(function (row) { return row.action() !== 'NOCHANGE'; }, true)
                };
            };
            var func3 = function (child) { return child.rows.length > 0; };
            var i, jpk, jrows;
            for (i = 0; i < oritable.childs.length; i++) {
                jrows = oritable.childs[i].rows;
                if (jrows.length > 0) {
                    jpk = jrows[0].table.pk;
                    oritable.childs[i].childs = database.relations()
                        .where(func1)
                        .map(func2);
                    oritable.childs[i].childs.where(func3, true);
                    if (oritable.childs[i].childs.length === 0) { delete oritable.childs[i].childs; }
                }
                jrows.where(function (row) { return row.action() !== 'NOCHANGE'; }, true);
                if (jrows.length === 0) { delete oritable.childs[j].rows; }
            }
            oritable.childs.where(function (child) { return Boolean(child.rows) || Boolean(child.childs); }, true);
            rows.where(function (row) { return row.action() !== 'NOCHANGE'; }, true);

            if (oritable.childs.length === 0) { delete oritable.childs; }
            if (oritable.rows.length === 0) { delete oritable.rows; }

            if (!Boolean(oritable.rows) && !Boolean(oritable.childs)) { return; }

            newtable = { name: oritable.name };
            if (oritable.rows) { newtable.rows = jsonrows(oritable.rows); }
            if (oritable.childs) {
                newtable.childs = [];
                var j, ori_ch;
                for (i = 0; i < oritable.childs.length; i++) {
                    ori_ch = oritable.childs[i];
                    newtable.childs[i] = { name: ori_ch.name, childcol: ori_ch.childcol };
                    if (ori_ch.rows) { newtable.childs[i].rows = jsonrows(ori_ch.rows); }
                    if (ori_ch.childs) {
                        newtable.childs[i].childs = [];
                        for (j = 0; j < ori_ch.childs.length; j++) {
                            newtable.childs[i].childs[j] = { name: ori_ch.childs[j].name, childcol: ori_ch.childs[j].childcol };
                            if (ori_ch.childs[j].rows) { newtable.childs[i].childs[j].rows = jsonrows(ori_ch.childs[j].rows); }
                        }
                    }
                }
            }
        } else if ($.type(data) === 'array') {
            rows = data;
            oritable = jsontable(data);
            if (oritable.rows.length === 0) { return data; }
            newtable = $.extend(true, {}, oritable);
            jsonrows(newtable.rows);
        }
        function jsontable(rows, colindex) {
            return {
                name: rows[0].table.title[2],
                childcol: colindex,
                rows: rows.where(function (row) { return row.action() !== 'NOCHANGE'; })
            };
        }
        function jsonrows(rows) {
            for (var i = 0, length = rows.length, row; i < length; i++) {
                row = rows[i];
                row[0] = row.action() === "DELETE" ? "D{0}".format(row[0].toString())
                    : (row.action() === "INSERT" && (!row.cell().col.identity) ? "I{0}".format(row[0].toString())
                    : row[0]);
            }
            return rows;
        }
        $.ajax({
            async: false,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({ json: JSON.stringify(newtable) }),
            url: '{0}/getTable'.format($(location).attr('pathname').endsWith('.aspx') ? $(location).attr('pathname') : 'default.aspx'),
            success: function (dataout) {
                var i;
                try {
                    newtable = $.parseJSON(dataout.d);
                    if (data.objecttype === 'table') {
                        i = 0; newrows = newtable.rows;
                        for (var newrows, newrow; i < newrows.length; i++) {
                            newrow = newrows[i];
                            newrow.objecttype = 'row';
                            newrow.table = table;
                        }
                        return;
                    }
                    mergerows(oritable.rows, newtable.rows);
                    i = 0;
                    for (var length = (oritable.childs || []).length, j, jlength; i < length; i++) {
                        mergerows(oritable.childs[i].rows, newtable.childs[i].rows);
                        for (j = 0, jlength = (oritable.childs[i].childs || []).length; j < jlength; j++) {
                            mergerows(oritable.childs[i].childs[j].rows, newtable.childs[i].childs[j].rows);
                        }
                    }
                } catch (e) { errmes = dataout.d; throw new Error(dataout); }
            },
            error: function (jqxhr, status, errorMsg) { errmes = errorMsg; }
        });
        function mergerows(orirows, newrows) {
            if (!Boolean(orirows) || orirows.length === 0) { return orirows; }
            for (var i = 0, length = orirows.length, orirow, newrow, cols_i, cols = orirows[0].table.cols(), cols_length = cols.length ; i < length; i++) {
                orirow = orirows[i];
                newrow = newrows[i];
                for (cols_i = 0; cols_i < cols_length; cols_i++) { orirow.cell(cols[cols_i]).val(newrow[cols_i], 'JSON')._ori = undefined; }
                orirow._action = undefined;
            }
            return orirows;
        }
        if (errmes) { throw new Error(errmes); }
        return newtable.rows;
    },
    relations: function (parent, child, cascade) {
        if (!parent.unique) { throw new Error("La columna parent debe ser única"); }
        if (parent.type !== child.type) { throw new Error("No tienen el mismo tipo de datos"); }
        if (parent.table.relations.contains(child)) { throw new Error("Ya existe esta relacion"); }
        child.parent = parent;
        child.parent_cell = ITable({
            title: ["Columnas", "Columna"],
            insert: false, update: true, delete: false,
            cols: [{ title: "Parent", required: true }]
        });
        child.parent_cell.cols("Parent").parent = parent.table.cols().where(function (col) { return col.unique; });
        child.parent_cell.cols("Parent").parent.table = parent.table;
        child.parent_cell = child.parent_cell.rows("NEW").cell("Parent");
        child.parent_cell.val(parent.table.str);
        child.cascade = cascade;
        parent.table.relations.push(child);
    },
};

function relations(parent, child, cascade) {
    if (!parent.pk) { throw new Error("No hay PK en la tabla parent"); }
    if (parent.type !== child.type) { throw new Error("No tienen el mismo tipo de datos"); }
    if (parent.table.relations.contains(child)) { throw new Error("Ya existe esta relacion"); }
    child.parent = parent;
    child.parent_cell = ITable({
        title: ["Columnas", "Columna"],
        insert: false, update: true, delete: false,
        cols: [{ title: "Parent", required: true }]
    });
    child.parent_cell.cols("Parent").parent = parent.table.cols().where(function (col) { return col.unique; });
    child.parent_cell.cols("Parent").parent.table = parent.table;
    child.parent_cell = child.parent_cell.rows("NEW").cell("Parent");
    child.parent_cell.val(parent.table.str);
    child.cascade = cascade;
    parent.table.relations.push(child);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCPFKlICKVcypIdAo1-TgfhODRoQWPVzJw&sensor=FALSE&callback=initialize';
    document.body.appendChild(script);
}

var ITable = function (value, database) {
    if (ITable.new) {
        delete ITable.new;
        var table = this;
        table.id = ITable.id++;
        table.objecttype = 'table';
        table.database = database;
        table.title = value.title;
        table.colsdef = value.colsdef;
        table.indexes = value.indexes;
        table.form = value.form;
        table.nochilds = value.nochilds;
        table.templateTable = value.templateTable;
        table.insert = value.insert;
        table.update = value.update;
        table.delete = value.delete;
        table._rows = value.rows;
        table.relations = [];
        var tmparr = table.relations;
        tmparr.toString = function () { return "Relaciones"; };
        tmparr._cols = [{ title: "Relación" }];
        tmparr.str = tmparr._cols[0];
        tmparr.table = { title: ["Relaciones", "Relación"], cols: function () { return tmparr._cols; } };

        if (database) { table.col = database._tables.str; }
        table._cols = [];
        tmparr = table._cols;
        tmparr.toString = function () { return "Columnas"; };
        tmparr._cols = [{ title: "Columna" }];
        tmparr.str = tmparr._cols[0];
        tmparr.table = { title: ["Columnas", "Columna"], cols: function () { return tmparr._cols; } };

        table.indexes = value.indexes || [];
        for (var i = 0; i < value.cols.length; i++) { table.cols(value.cols[i]); }
        var contextMenu = {};
        contextMenu.toString = function () { return "cm_row_{0}".format(table.id); };
        contextMenu.selector = '[contextmenu={0}]'.format(contextMenu);
        contextMenu.items = {
            abrir: {
                name: "Abrir", callback: function () {
                    var target = this, row, cell, title;
                    if (target.data("cell")) {
                        cell = target.data("cell");
                        if (cell.length) { cell = cell[0].cell(cell[1]); }
                        if (cell) {
                            row = cell.val();
                            title = "{0}: {1}".format(cell.col, row);
                        }
                    } else {
                        row = target.data("row");
                        title = "{0}".format(row);
                    }
                    if (row) { row.form(function () { target.trigger("change"); }, target.closest("form"), undefined, title); }
                }
            }
        };
        if (table.delete) {
            contextMenu.items.delete = {
                name: "Eliminar",
                icon: "delete",
                callback: function () {
                    var target = this;
                    if (confirm('¿Seguro que quieres eliminar esta línea?')) {
                        try {
                            var row = target.data('row').action("DELETE");
                            IDatabase.data(row, function (error) {
                                if (!error) {
                                    var form = target.closest("form");
                                    if (form.data("data").table._rows !== form.data("data")) { form.data("data").remove(row); }
                                    form.data("update")();
                                }
                            });
                        } catch (e) { alert("Ocurrio un error:\r\n{0}\r\nComunícate a la extensión 2152".format(e.message)); }
                    }
                }
            };
        }
        contextMenu.items.properties = {
            name: "Propiedades",
            callback: function () {
                var target = this, row;
                if (target.data("cell")) { row = target.data("cell").val(); } else { row = target.data("row"); }
                var cols = [];
                for (var col_i = 0, tablecols = row.table.cols(), tablecol ; col_i < tablecols.length; col_i++) {
                    tablecol = tablecols[col_i];
                    if (tablecol.pk) { cols.push(tablecol); }
                    if (tablecol.title === "Fecha actualizado") { cols.push(tablecol); }
                    if (tablecol.title === "Sesión actualizado") {
                        cols.push(tablecol);
                        cols.push(row.table.cols("Sesión actualizado >Colaborador"));
                    }
                    if (tablecol.title === "Fecha insertado") { cols.push(tablecol); }
                    if (tablecol.title === "Sesión insertado") {
                        cols.push(tablecol);
                        cols.push(row.table.cols("Sesión insertado >Colaborador"));
                    }
                    if (tablecol.title === "Sesión") {
                        cols.push(tablecols[col_i]);
                        cols.push(row.table.cols("Sesión >Colaborador"));
                    }
                }
                $("<div>").prop("title", "Propiedades de {0}".format(row)).data("row", row)
                   .append(row.ashtml("vertical", false, cols))
                   .dialog({ modal: true, width: "842px" });
            }
        };
        if (value.contextMenu) { $.extend(contextMenu.items, value.contextMenu); }
        table._contextMenu = contextMenu;

        var col_i;
        var func1 = function (col) { return table.cols(col); };
        for (var indexes_i = 0, index; indexes_i < table.indexes.length; indexes_i++) {
            index = table.indexes[indexes_i];
            if (!index.objecttype) {
                table.indexes[indexes_i] = index = Iindex(index.map(func1));
                for (col_i = 0; col_i < index.cols.length; col_i++) { index.cols[col_i].tindex = index; }
            }
        }
    } else { ITable.new = true; return new ITable(value, database); }
};
ITable.id = 0;
ITable.prototype = {
    cols: function (data) {
        var table = this, path, i, col, nexttable;
        if (data === undefined) { return table._cols; } else if (typeof data === "number") { return table._cols[data]; }
        if (data === "PK") { return table.pk; } else if (data === "STR") { return table.str; }
        if (data.objecttype === 'col') {
            if (data.table !== table) { throw new Error('La columna: {0} no pertenece a la tabla: {1}'.format(data.title, table)); }
            return data;
        }
        if (typeof data === 'string') {
            if (data.contains(' >')) {
                for (i = 0, path = data.split(' >'), nexttable = table ; i < path.length; i++) {
                    if (i > 0) { nexttable = path[i - 1].parent.table; }
                    path[i] = nexttable.cols(path[i]);
                }
                return path;
            }
            if (data.contains("|")) {
                col = data.split("|");
                col = table.relations.find(function (relation) { return relation.table.title[0] === col[0] && relation.title === col[1]; });
                if (!col) { throw new Error('No se enconro la tabla relacionada'.format(data)); }
                return col;
            }
            col = table._cols.find(function (col) { return col.title === data; });
            if (!col) { throw new Error('No se encontro la columna: {0}'.format(data)); }
            return col;
        } else if (data.length) {
            for (i = 0, nexttable = table ; i < data.length; i++) {
                if (i > 0) { nexttable = data[i - 1].parent.table; }
                data[i] = nexttable.cols(data[i]);
            }
            return data;
        }
        return search(data);

        function search(data) {
            if ($.type(data) === 'object' && !col) {
                col = new ICol(data, table, table._cols.length);
                table._cols.push(col);
            }
            if (!col) { throw new Error('No se encontro la columna: {0}'.format(data)); }
            return col;
        }
    },
    rows: function (value, datacol, check) {
        "use strict";
        var table = this, row, col, val;
        if (!table._rows) {
            if (table.title[2]) { table._rows = table.database.data(table); } else { table._rows = []; }
            table._rows.table = table;
        }
        if (value === undefined && datacol === undefined) { return table._rows; }
        col = datacol ? table.cols(datacol) : table.pk;
        if (value === "NEW") {
            row = [];
            row.objecttype = 'row';
            row.table = table;
            row.action("INSERT");
            if (col) { col.default = col.default || (col.identity ? -1 : undefined); }
            table._rows.push(row);
            for (var i = 0, cols = table.cols() ; i < cols.length; ++i) {
                col = cols[i];
                row
                    .cell(col)
                    .val(col.identity ? col.default--
                    : (col.default === undefined ? null
                    : (col.default === "now" ? moment()
                    : col.default)), "VAL");
                delete row.cell(col)._ori;
            }
        } else {
            val = col.parse(value, "VAL");
            if (col.tindex && col.tindex.cols.length === 1) {
                row = val[1].valueDuplicated;
                if (!row && !check) { throw new Error('"{0}" no es un valor valido'.format(value)); }
            } else { row = table._rows.where(function (row) { return row.cell(col).val(undefined, "VAL") === val[0]; }); }
        }
        return row;
    },
    child: function () {
        var table = this;
        if (!table.cols('PK') || !table.cols('PK').child()) { return; }
        if (!table._child) {
            var childs = table.cols('PK').child();
            table._child = [];
            var func1 = function (item) { return item[0] === childs[i][1].table; };
            for (var i = 0, crfind; i < childs.length; i++) {
                crfind = table._child.find(func1);
                if (!crfind) {
                    this._child.push([childs[i][1].table, [childs[i][1]]]);
                } else { crfind[1].push(childs[i][1]); }
            }
        }
        return table._child;
    },
    contextMenu: function () {
        var table = this;
        if (!table._contextMenuR) {
            $.contextMenu(table._contextMenu);
            table._contextMenuR = true;
        }
        return table._contextMenu;
    },
    parse: function (val, origen) {
        var table = this;
        if (origen === "VAL" && val) {
            return table.pk.parse(val.val(), origen);
        } else if (["JSON", "VAL"].contains(origen)) { return table.pk.parse(val, origen); }
        return table.str.parse(val, origen);
    },
    findone: function () {
        var table = this;
        return table._busindex.rows("NEW");
    },
    cell: function () { return this; },
    val: function (val, format) {
        if (format === "MARK" && this.mark) { return this.mark; }
        return this.toString();
    },
    valueOf: function () {
        return this.title[0];
    },
    toString: function () {
        return this.title[0];
    }
};
Array.prototype.parse = function (val, origen) {
    var array = this;
    var validity = {
        valid: false,
        valueMissing: false,
        badInput: false,
        patternMismatch: false,
        tooShort: false,
        tooLong: false,
        rangeUnderFlow: false,
        rangeOverFlow: false,
        valueDuplicated: false
    };
    val !== null && typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
    if (origen === "VAL") {
        validity.valueDuplicated = array.find(function (row) { return row === val; });
        validity.valid = !validity.valueDuplicated;
    } else {
        validity.valueDuplicated = array.find(function (row) { return row.toString() === val; });
        validity.valid = !validity.valueDuplicated;
    }
    return [val, validity];
};
Array.prototype.findone = function () {
    var array = this;



    return array._busindex.rows("NEW");
};

function ICol(value, table, index) {
    if (!value) { throw new Error('No se definio value'); }
    if (!table) { throw new Error('No se definio table'); }
    if (index === undefined) { throw new Error('No se definio index'); }
    var col = this;
    $.extend(col, value);
    if (col.pk) {
        col.unique = true; table.pk = col;
        col.required = !col.readonly;
    }
    if (col.str) {
        col.required = !col.readonly;
        col.unique = true; table.str = col;
    }
    if (col.identity) { col.pk = true; col.type = "Int"; col.readonly = true; col.unique = true; table.pk = col; }
    if (col.type === "Email") { col.pattern = $.comex.email; }
    if (col.type === "Duration") { col.pattern = $.comex.hours; }
    if (col.title === "Fecha insertado") { col.readonly = true; col.type = "Datetime"; }
    if (col.title === "Fecha actualizado") { col.readonly = true; col.type = "Datetime"; }
    if (col.type === undefined) {
        if (["Insertado por", "Sesión insertado", "Sesión"].contains(col.title)) {
            col.readonly = true; col.type = "Int";
        } else if (["Actualizado por", "Sesión actualizado"].contains(col.title)) {
            col.readonly = true; col.type = "Int";
        } else { col.type = "String"; }
    }
    col.objecttype = 'col';
    col.table = table;
    col.index = index;
    col.col = table._cols._cols[0];
    if (col.unique) { table.indexes.push(col.tindex = Iindex([col])); }
    return col;
}
ICol.prototype = {
    parse: function (val, origen) {
        "use strict";
        var $col, thiscoltype, tmp;
        $col = this; thiscoltype = $col.type;
        $col.tindex && $col.tindex.getReady();
        if (!["TEXT", "CONTROL", "JSON", "VAL"].contains(origen)) { throw new Error('El origen no es un valor valido'); }
        //http://www.sitepoint.com/html5-forms-javascript-constraint-validation-api/
        var validity = {
            valid: false,
            valueMissing: false,
            badInput: false,
            patternMismatch: false,
            tooShort: false,
            tooLong: false,
            rangeUnderFlow: false,
            rangeOverFlow: false,
            valueDuplicated: false
        };
        if ($col.parent) {
            var parentresult;
            if (origen === "TEXT") {
                parentresult = ($col.parent_cell && $col.parent_cell.val().parse(val, origen)) || $col.parent.parse(val, origen);
            } else if (origen === "CONTROL") {
                parentresult = ($col.parent_cell && $col.parent_cell.val().parse(val, origen)) || $col.parent.parse(val, origen);
            } else if (origen === "JSON") {
                parentresult = $col.parent.parse(val, origen);
            } else { parentresult = $col.parent.length ? $col.parent.parse(val, origen) : $col.parent.table.parse(val, origen); }
            val = parentresult[0];
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (parentresult[1].valid) {
                validity.badInput = "El valor no existe en la tabla {0}".format($col.parent.table);
            } else if (!parentresult[1].valueDuplicated) {
                validity = parentresult[1];
            } else {
                val = parentresult[1].valueDuplicated;
                $col.unique && (validity.valueDuplicated = $col.tindex.get(val));
                validity.valid = !validity.valueDuplicated;
            }
        } else if (thiscoltype === 'Int') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (val !== null && !isNaN(val)) { val = parseInt(val, 10); }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (isNaN(val)) {
                validity.badInput = "El valor no es un número";
            } else if (val < $col.min) {
                validity.rangeUnderFlow = true;
            } else if (val > $col.max) {
                validity.rangeOverFlow = true;
            } else {
                $col.unique && (validity.valueDuplicated = $col.tindex.get(val));
                validity.valid = !validity.valueDuplicated;
            }
        } else if (thiscoltype === 'Dec') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (val !== null && !isNaN(val)) { val = Number(val); }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (isNaN(val)) {
                validity.badInput = "El valor no es un número";
            } else if (val < $col.min) {
                validity.rangeUnderFlow = true;
            } else if (val > $col.max) {
                validity.rangeOverFlow = true;
            } else {
                $col.unique && (validity.valueDuplicated = $col.tindex.get(val));
                validity.valid = !validity.valueDuplicated;
            }
        } else if (thiscoltype === 'String') {
            if (typeof val === "string") {
                if ($col.clean === undefined || $col.clean) { val = val.trimSingleLine(); }
                if (val === "") { val = null; }
            }
            if (val !== null) {
                if ($col.transform === 'uppercase') { val = val.toUpperCase(); } else if ($col.transform === 'lowercase') { val = val.toLowerCase(); }
                if ($col.sinacentos) { val = val.noAcents(); }
            }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (val.length < $col.minlength) {
                validity.tooShort = true;
            } else if (val.length > $col.maxlength) {
                validity.tooLong = true;
            } else if ($col.pattern && !$col.pattern.pattern.test(val)) {
                validity.patternMismatch = $col.pattern.message(val);
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Bool') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (origen === "JSON") {
                if (val === false) { val = null; }
            } else if (origen === "TEXT") {//'✗'
                if (val === '✓') { val = true; }
            } else if (origen === "CONTROL") {
                if (val === false) { val = null; }
            } else if (origen === "VAL") { if (val === false) { val = null; } }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (val !== true) {
                validity.badInput = "El valor no tiene el formato requerido";
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Datetime') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (origen === "JSON") {
                val !== null && (tmp = moment(val)).isValid() && (val = tmp);
            } else if (origen === "TEXT") {
                val !== null && (tmp = moment(val, 'DD/MM/YYYY HH:mm')).isValid() && (val = tmp);
            } else if (origen === "CONTROL") {
                val !== null && (tmp = moment(val)).isValid() && (val = tmp);
            } else if (origen === "VAL") {
                val !== null && (val = moment(val));
            }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (typeof val === "string") {
                validity.badInput = "El valor no es una fecha valida";
            } else if ($col.min && $.comex.compare(val, $col.min) === -1) {
                validity.rangeUnderFlow = true;
            } else if ($col.max && $.comex.compare(val, $col.max) === 1) {
                validity.rangeOverFlow = true;
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Date') {
            if (origen === "JSON") {
                if (val !== null) {
                    tmp = moment(val);
                    if (tmp.isValid()) { val = tmp; }
                }
            } else if (origen === "TEXT") {
                val !== null && (val = val.trimSingleLine()) === "" && (val = null);
                tmp = moment(val, 'DD/MM/YYYY');
                if (tmp.isValid()) { val = tmp; }
            } else if (origen === "CONTROL") {
                val !== null && (val = val.trimSingleLine()) === "" && (val = null);
                if (val !== null) {
                    tmp = moment(val);
                    if (tmp.isValid()) { val = tmp; }
                }
            } else if (origen === "VAL") { if (val !== null) { val = moment(val); } }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (typeof val === "string") {
                validity.badInput = "El valor no es una fecha valida";
            } else if ($col.min && $.comex.compare(val, $col.min) === -1) {
                validity.rangeUnderFlow = true;
            } else if ($col.max && $.comex.compare(val, $col.max) === 1) {
                validity.rangeOverFlow = true;
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Email') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (val !== null) { val = val.toLowerCase(); }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (val.length < $col.minlength) {
                validity.tooShort = true;
            } else if (val.length > $col.maxlength) {
                validity.tooLong = true;
            } else if (!$col.pattern.pattern.test(val)) {
                validity.patternMismatch = "Mail incorrecto";
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Duration') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (["JSON", "VAL"].contains(origen)) {
                if (val !== null) { val = moment.duration(val); }
            } else if (val !== null && $col.pattern.pattern.test(val)) { val = moment.duration(val, 'HH:mm'); }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (typeof val === "string") {
                validity.patternMismatch = $col.pattern.message(val);
            } else if ($col.min && $.comex.compare(val, $col.min) === -1) {
                validity.rangeUnderFlow = true;
            } else if ($col.max && $.comex.compare(val, $col.max) === 1) {
                validity.rangeOverFlow = true;
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === 'Currency') {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (val !== null) {
                tmp = currency.parse(val);
                if (tmp.isValid()) { val = tmp; }
            }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (typeof val === "string") {
                validity.badInput = "No es un valor valido";
            } else if ($col.min && $.comex.compare(val, $col.min) === -1) {
                validity.rangeUnderFlow = true;
            } else if ($col.max && $.comex.compare(val, $col.max) === 1) {
                validity.rangeOverFlow = true;
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        } else if (thiscoltype === "Img") {
            validity.valid = true;
        } else if (thiscoltype === "Textarea") {
            typeof val === "string" && (val = val.trimMultiLine()) === "" && (val = null);
            if (val !== null) {
                if ($col.transform === 'uppercase') { val = val.toUpperCase(); } else if ($col.transform === 'lowercase') { val = val.toLowerCase(); }
            }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (val.length < $col.minlength) {
                validity.tooShort = true;
            } else if (val.length > $col.maxlength) {
                validity.tooLong = true;
            } else { validity.valid = true; }
        } else if (thiscoltype === "Javascript") {
            typeof val === "string" && (val = val.trimMultiLine()) === "" && (val = null);
            val = eval(val);
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else { validity.valid = true; }
        } else if (thiscoltype === "url") {
            typeof val === "string" && (val = val.trimSingleLine()) === "" && (val = null);
            if (val !== null) { val = val.toLocaleLowerCase(); }
            if (val === null) {
                validity.valid = !(validity.valueMissing = $col.required);
            } else if (val.length < $col.minlength) {
                validity.tooShort = true;
            } else if (val.length > $col.maxlength) {
                validity.tooLong = true;
            } else if ($col.pattern && !$col.pattern.pattern.test(val)) {
                validity.patternMismatch = $col.pattern.message(val);
            } else if ($col.unique && $col.tindex.get(val)) {
                validity.valueDuplicated = $col.tindex.get(val);
            } else { validity.valid = true; }
        }
        return [val, validity];
    },
    format: function (val, destino) {
        "use strict";
        var $col, thiscoltype;
        $col = this; thiscoltype = $col.type; val = val === undefined ? null : val;
        if (!["TEXT", "CONTROL", "JSON", "VAL"].contains(destino)) { throw new Error('El destino no es un valor valido'); }
        if ([null, undefined, ""].contains(val)) {
            if (destino === "TEXT") { return ""; }
            else if (destino === "CONTROL") { return ""; }
            else if (destino === "JSON") { return null; }
            else if (destino === "VAL") { return null; }
        }
        if ($col.parent) {
            if (typeof val === "string" || typeof val === "number") {
                if (destino === "CONTROL") { return val; }
                return null;
            }
            var colparent = ($col.parent_cell && $col.parent_cell.val()) || $col.parent;
            if (destino === "TEXT") { return val.cell("STR").val(undefined, "TEXT"); }
            else if (destino === "CONTROL") { return val.cell("STR").val(undefined, "TEXT"); }
            else if (destino === "JSON") { return val.cell($col.parent).val(); }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Int") {
            if (destino === "TEXT") { return val.toString(); }
            else if (destino === "CONTROL") { return val.toString(); }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Dec") {
            if (destino === "TEXT") { return val.toString(); }
            else if (destino === "CONTROL") { return val.toString(); }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Bool") {
            if (destino === "TEXT") { return val ? "✓" : "✗"; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "String") {
            if (destino === "TEXT") { return val; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === 'Email') {
            if (destino === "TEXT") { return val; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === 'Date') {
            if (destino === "TEXT") { return val.format("DD/MM/YYYY"); }
            else if (destino === "CONTROL") { return val.format("YYYY-MM-DD"); }
            else if (destino === "JSON") { return val.toJSON(); }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Datetime") {
            if (destino === "TEXT") { return val.format("DD/MM/YYYY HH:mm"); }
            else if (destino === "CONTROL") { return val.format("YYYY-MM-DDTHH:mm"); }
            else if (destino === "JSON") { return val.toJSON(); }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Duration") {
            if (destino === "TEXT") { return val.format("H:mm"); }
            else if (destino === "CONTROL") { return val.format("H:mm"); }
            else if (destino === "JSON") { return val.toJSON(); }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Currency") {
            if (destino === "TEXT") { return val.format(); }
            else if (destino === "CONTROL") { return val.format(); }
            else if (destino === "JSON") { return val.toJSON(); }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Textarea") {
            if (destino === "TEXT") { return val; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Javascript") {
            if (destino === "TEXT") { return "[...]"; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "Img") {
            if (destino === "TEXT") { return "[...]"; }
            else if (destino === "CONTROL") { return val; }
            else if (destino === "JSON") { return val; }
            else if (destino === "VAL") { return val; }
        } else if (thiscoltype === "url") {
            return val;
        }
        return val;
    },
    child: function (childcol) {
        "use strict";
        var col = this;
        if (!col.pk || col._child === null) { return; }
        if (!col._child) {
            col._child = (this.table.relations() || []).where(function (item) { return item[0] === col; });
            if (this._child.length === 0) { col._child = null; return; }
        }
        var childcol2 = $.type(childcol) === 'string' ? this.table.database.table(childcol.split('|')[0]).cols(childcol.split('|')[1]) : childcol;
        return childcol2 ? this._child.find(function (item) { return item[1] === childcol2; }) : col._child;
    },
    toJSON: function () {
        //http://runnable.com/UlesEPH5ickbAAAt/how-to-customize-javascript-objects-serialization-to-json
        return this.title;
    },
    cell: function () { return this; },
    val: function (val, format) {
        if (format === "MARK" && this.mark) { return this.mark; }
        return this.toString();
    },
    valueOf: function () {
        return this.title;
    },
    toString: function () {
        return this.title;
    }
};
var ICell = function (col, row) {
    if (!col) { throw new Error('table es un valor requerido'); }
    if (ICell._new) {
        ICell._new = undefined;
        var cell = this;
        cell.objecttype = 'cell';
        cell.col = col;
        cell.row = row;
        cell._val = row[col.index];
        row[col.index] = cell;
    } else { ICell._new = true; return new ICell(col, row); }
};
ICell.prototype = {
    val: function (data, format) {
        var $cell, col;
        $cell = this; col = $cell.col; format = format || "VAL";
        col.tindex && col.tindex.getReady();
        if (!$cell._ready) {
            $cell._ready = true;
            var tmp = $cell._val;
            if (tmp === undefined) { tmp = null; } else { $cell._val = undefined; }
            if (data === undefined || data !== tmp) { $cell.val(tmp, $cell.row.table.title[2] ? "JSON" : "TEXT"); }
        }
        if (data === undefined) {
            if (format === "ORI") { return col.format($cell._ori, "TEXT"); }
            if (!$cell.validity.valid) {
                if (format === "CONTROL") { return col.format($cell._val, format); } else if (["TEXT", "MARK"].contains(format) && $cell._val === 0) {
                    return "(TODAS)";
                } else if (["TEXT", "MARK"].contains(format)) { return ""; } else { return null; }
            }
            if (format === "MARK") {
                if ($cell.mark) { return $cell.mark; }
                format = "TEXT";
            } else if (format !== "TEXT") { return col.format($cell._val, format); }
            if (col.parent) { return col.format($cell._val, format); } else if (!$cell._text) { $cell._text = col.format($cell._val, format); }
            return $cell._text;
        }
        if ($cell.validity && $cell.validity.valid && ($cell._val === data || $.comex.compare($cell.val(undefined, format), data, true, true) === 0)) {
            return $cell;
        }
        if (col.tindex && $cell.validity && $cell.validity.valid) { col.tindex.remove($cell); }
        delete $cell._text;
        if ($cell._val !== undefined && $cell._ori === undefined) { $cell._ori = $cell._val; }
        data = col.parse(data, format);
        if ($cell._val !== undefined) { $cell._prev = [$cell._val, $cell.validity.valid]; }
        $cell._val = data[0];
        $cell.validity = data[1];
		if (!$cell.validity.valid) { return $cell; }
		if($cell._val === null){
			if($cell.required){$cell.validity.valid = false; $cell.validity.valueMissing = true;  return $cell; }
		}else{
			if ($cell.min && $.comex.compare($cell._val, $cell.min) === -1) {$cell.validity.valid = false; $cell.validity.rangeUnderFlow = true; return $cell;}
			if ($cell.max && $.comex.compare($cell._val, $cell.max)) { $cell.validity.valid = false; $cell.validity.rangeOverFlow = true; return $cell; }
			if (!col.unique && col.tindex && col.tindex.get($cell)) {$cell.validity.valid = false; $cell.validity.valueDuplicated = col.tindex.get($cell); return $cell;}
			if ($cell.col.badInput && ($cell.validity.badInput = $cell.col.badInput($cell))) {$cell.validity.valid = false; $cell.validity.badInput = $cell.validity.badInput; return $cell;			}
		}
        if (($cell._ori === $cell._val) || $.comex.compare(col.format($cell._ori, format), col.format($cell._val, format), true, true) === 0) { delete $cell._ori; }
        if (col.tindex) {
            col.tindex.insert($cell);
            if (col.pk && ![undefined, null].contains($cell._ori)) {
                for (var i = 0, relations = $cell.row.relations(), j, relation; i < relations.length; i++) {
                    for (j = 0, relation = relations[i]; j < relation.length; j++) { relation[j].cell(relation.relation).reeval(); }
                }
            }
        }
        if (col.onChange) { col.onChange($cell, $cell.row); }
        return $cell;
    },
    isVal: function () {
        return this.isValid() && this.val() !== null;
    },
    isValid: function () {
        this.validity || this.val(undefined, "VAL");
        return this.validity.valid;
    },
    action: function () {
        var cell = this, val = cell.val();
        return cell._ori === undefined ? undefined
            : (cell._ori === null && val !== null ? "INSERT"
            : (cell._ori !== null && val === null ? "DELETE"
            : "UPDATE"));
    },
    child: function (childcol) {
        "use strict";
        var cell = this, childcol2 = $.type(childcol) === 'string' ? cell.col.table.database.tables(childcol.split('|')[0]).cols(childcol.split('|')[1]) : childcol;
        if (!cell.col.child(childcol2)) { return; }
        if (!cell._child) {
            cell._child = cell.col.child().map(function (relation) {
                return {
                    objecttype: 'view',
                    parent: cell,
                    child: relation[1],
                    relation: relation,
                    title: relation[1].table.title,
                    permisos: relation[1].table.permisos,
                    contextMenu: relation[1].table.contextMenu,
                    table: relation[1].table,
                    _cols: relation[1].table._cols,
                    cols: relation[1].table.cols,
                    isRow: function (row) { return row.cell(this.child).val(undefined, "VAL") === this.parent; },
                    rows: function (data) {
                        var view = this, childcol = view.child, childtable = childcol.table;
                        if (!data) { return view.child.table.rows().where(function (row) { return view.isRow(row); }); }
                        var row = childtable.rows(data);
                        if (data === 'NEW') {
                            row.cell(childcol).val(view.parent);
                        } else if (!view.isRow(row)) { row = undefined; }
                        return row;
                    }
                };
            });
        }
        return childcol2 ? cell._child.find(function (child) { return child.relation[1] === childcol2; }) : cell._child;
    },
    opts: function () {
        "use strict";
        var $cell, opts;
        $cell = this;
        opts = $cell.col.opts().clone();
        if (!opts) { return; }
        return $cell.col.options ? $cell.col.options.call($cell, opts) : opts;
    },
    toJSON: function () {
        return this.val(undefined, "JSON");
    },
    validationMessage: function () {
        var $cell, validity;
        $cell = this;
        if (!$cell.validity) { $cell.val(); }
        validity = $cell.validity;
        if (validity.badInput) { return $cell.validity.badInput; }
        if (validity.valueMissing) { return "Valor requerido"; }
        if (validity.tooShort) { return "Minimo {0} caracteres".format($cell.col.minlength); }
        if (validity.tooLong) { return "Máximo {0} caracteres".format($cell.col.maxlength); }
        if (validity.patternMismatch) { return validity.patternMismatch; }
        if (validity.rangeUnderFlow) {
            if (["Date", "Datetime"].contains($cell.col.type)) {
                return "El valor debe ser igual o posterior a {0}".format($cell.col.format($cell.min || $cell.col.min, "TEXT"));
            } else { return "El valor debe ser igual o superior a {0}".format($cell.col.format($cell.min || $cell.col.min, "TEXT")); }
        }
        if (validity.rangeOverFlow) {
            if (["Date", "Datetime"].contains($cell.col.type)) {
                return "El valor debe ser igual o anterior a {0}".format($cell.col.format($cell.max || $cell.col.max, "TEXT"));
            } else { return "El valor debe ser igual o inferior a {0}".format($cell.col.format($cell.max || $cell.col.max, "TEXT")); }
        }
        if (validity.valueDuplicated) { return "El valor esta duplicado con: {0}".format(validity.valueDuplicated); }
        if ($cell.action() === "INSERT") { return "Dato nuevo"; }
        if ($cell.action() === "UPDATE") { return "Dato actualizado, Antes: {0}".format($cell.val(undefined, "ORI")); }
        if ($cell.action() === "DELETE") { return "Dato eliminado, Antes: {0}".format($cell.val(undefined, "ORI")); }
        if (!$cell.isVal()) { return "Dato opcional"; }
        return "Sin cambio";
    },
    compare: function (cellb) {
        var cella = this;
        if (cella.col !== cellb.col) { throw new Error('Las celdas no son de la misma colummna'); }
        return $.comex.compare(+cella, +cellb);
    },
    reeval: function () {
        var $cell = this;
        if (!$cell.validity) { $cell.val(); }
        var tmp = $cell._val;
        if (tmp !== null) { $cell.val(null); }
        $cell._val = undefined;
        delete $cell.validity;
        $cell.val(tmp);
    },
    as2td: function () {

    },
    ashtml: function (label, editable) {
        var cell = this;
        if (label) { return IDatabase.td(cell, "tr", editable); }
        return IDatabase.td(cell, $("<td>"), editable);
    },
    change: function (prop, val) {
        var cell = this;
        if (typeof prop === "string") { a(prop, val); } else { for (var i = 0; i < prop.length; i++) { a(prop[i][0], prop[i][1]); } }
        cell.reeval();
        return cell;
        function a(prop, val) { if (val === false || val === null) { delete cell[prop]; } else { cell[prop] = val; } }
    },
    valueOf: function (type) {
        return this.isVal() ? (this.col.parent ? this.val().valueOf(type) : this.val().valueOf()) : null;
    },
    toString: function () {
        return this.val(undefined, "TEXT");
    }
};

Array.prototype.rows = function () {
    return this;
};
Array.prototype.template = Array.template || function (template) {
    "use strict";
    var $row, $rows, curtemplate, children, templateItem, containers;
    if (this.objecttype === 'row') {
        $row = this;
    } else { $rows = this; }
    template = template || $row.table.templateTable;
    if ($row) {
        curtemplate = template;
        rowsmap($row);
    } else {
        templateItem = template;
        template = $rows.map(rowsmap);
    }

    return template;
    function rowsmap(row) {
        $row = row;
        curtemplate = templateItem ? templateItem.clone() : curtemplate;
        curtemplate.data('row', $row);
        containers = [];
        children = curtemplate;
        do {
            for (var i = 0, results = children.children('[data-rows]'), length = results.length, result; i < length; i++) {
                result = $(results[i]);
                result
                    .data('rows', $row.cell(result.data('rows')).rows())
                    .data('template', result.children('[data-row]'))
                    .empty();
                containers.push(result);
            }
            children = children.children();
        } while (children.length > 0);
        curtemplate.find('[data-cell]').each(datacell);
        for (var container_i = 0, container; container_i < containers.length; container_i++) {
            container = containers[container_i];
            container.append(container.data('rows').template(container.data('template')));
        }
        return curtemplate;
    }
    function datacell() { return IDatabase.td($row.cell($(this).data('cell')), $(this), true, true); }
};

Array.prototype.val = Array.val || function (col, data, format) {
    var row = this, cell;
    if (this.objecttype !== 'row') { throw new Error('Este array no es una fila'); }
	cell = row.cell(col || "PK");
	if(data === undefined){ return cell ? cell.val(data, format) : format === "TEXT" ? "" : null; }
	else { cell && cell.val(data, format); return row; }
};
Array.prototype.text = Array.text || function () {
    if (this.objecttype !== 'row') { throw new Error('Este array no es una fila'); }
    return this.cell('STR').val();
};
Array.prototype.col = Array.col || function () {
    if (this.objecttype !== 'row') { return; }
    return this.table.cols("PK");
};
Array.prototype.cell = Array.cell || function (col, caller) {
    var row, rows, table = this.table;
    var i, cols = table.cols();
    if (col === "PK" && !table.pk) { return; }
    if (col === "STR" && !table.str) { return; }
    if (typeof col === "number") {
        col = col;
    } else if (col) {
        col = table.cols(col);
        if (!col.length) { col = col.index; }
    }
    if (this.objecttype === "row" || !table) { row = this; return fcell(row); }
    rows = this;
    var results = [];
    if (col.length) {
        results.table = col[col.length - 1].parent.table;
    } else { results.table = table.cols(col).parent.table; }
    for (var j = 0, val; j < rows.length; j++) {
        val = fcell(rows[j]).val();
        if (!results.contains(val)) { results.push(val); }
    }
    return results;
    function fcell(row) {
        var cell;
        if (col === undefined) {
            for (i = 0; i < cols.length; i++) { row.cell(i); }
            return row;
        } else if (col.length) {
            for (i = 0; i < col.length; i++) {
                if (cell && cell.isVal()) { cell = cell.val().cell(col[i]); } else if (cell) { cell = undefined; break; } else { cell = row.cell(col[i]); }
            }
            return cell;
        }
        cell = row[col];
        if (table && ([undefined, null, ""].contains(cell) || cell.objecttype !== "cell")) {
            col = row.table.cols(col);
            cell = ICell(col, row);
        }
        if (row.rowOrigen) {
            if (cell.col.type === "col") {
                caller(row.rowOrigen.cell(cell.val()));
            } else if (cell.col.type === "map") {
                var tmp = cell.val();
                tmp.rowOrigen = row.rowOrigen;
                tmp.getRowDestino(caller);
            } else { caller(cell); }
        }
        return cell;
    }
};
Array.prototype.action = Array.action || function (act) {
    var row = this, rows, i;
    if (row.objecttype === 'row') {
        if (!act) { return row._action || (row.cell().find(function (cell) { return cell.action(); }) ? "UPDATE" : "NOCHANGE"); }
        if (!["INSERT", "DELETE", "NOCHANGE"].contains(act)) { throw new Error("Valor no valido"); }
        if (act === 'NOCHANGE' || (row._action === "INSERT" && act === "DELETE")) {
            for (var cell_i = 0, cells = row.cell(), cell; cell_i < cells.length; cell_i++) {
                if ((cell = cells[cell_i])._ori !== undefined) { cell.val(cell._ori); }
            }
            if (row._action === "INSERT") {
                row.table._rows.remove(row);
                i = 0;
                for (var rels = row.relations(), j, rel ; i < rels.length; i++) {
                    for (j = 0, rel = rels[i]; j < rel.length; j++) { if (rel.relation.cascade) { rel.action(act); } }
                }
            }
            delete row._action;
        } else { row._action = act; }
        return row;
    } else {
        rows = this;
        if (!act) {
            act = rows.find(function (row) { return ["INSERT", "UPDATE", "DELETE"].contains(row.action()); });
            return act ? "UPDATE" : "NOCHANGE";
        } else { for (i = 0; i < rows.length; i++) { rows[i].action(act); } }
    }
};
Array.prototype.isValid = Array.isValid || function () {
    var row, rows;
    if (this.objecttype === "row") {
        row = this;
        for (var cell_i = 0, cells = row.cell(), cell; cell_i < cells.length; cell_i++) {
            cell = cells[cell_i];
            if (!cell.validity) { cell.val(); }
            if (!cell.validity.valid) { return false; }
        }
        return true;
    } else {
        rows = this;
        for (var row_i = 0; row_i < rows.length; row_i++) { if (!rows[row_i].isValid()) { return false; } }
        return true;
    }
};
Array.prototype.anychange = function () {
    var row = this, change;
    if (row.objecttype !== 'row') { throw new Error('Este array no es un row'); }
    change = row.action() !== 'NOCHANGE';
    if (!change && row.cell().child()) {
        change = Boolean(row.cell().child().find(function (child) { return Boolean(child.rows().find(function (row) { return row.action() !== 'NOCHANGE'; })); }));
    }
    return change;
};
var arrtostr = [].toString;
Array.prototype.toString = function () {
	var row = this;
    //http://javascript.info/tutorial/native-prototypes
    if (row.objecttype === 'row') { return row.val("STR", undefined, "TEXT"); }
    return arrtostr.call(row);
};
var arrtovalof = [].valueOf;
Array.prototype.valueOf = function (type) {
	var row = this;
    if (row.objecttype === 'row') {
        if (type) { return row.cell("STR").valueOf(); }
        return row.cell("PK").valueOf();
    }
    return arrtovalof.call(row);
};
Array.prototype.form = function () {
    //var row, form;
    //row = this;
};
Array.prototype.intersection = function (arrayb, self, filteredout) {
    return this.where(function (item) { return arrayb.contains(item); }, self, filteredout);
};
Array.prototype.difference = function (arrayb, self, filteredout) {
    return this.where(function (item) { return !arrayb.contains(item); }, self, filteredout);
};

Array.prototype.sortCols = Array.sortCols || function (cols) {
    var $rows = this, pcols, row_i, row; var end_index, middle_index, result, cols_i, col, cell, middle_cell;
    cols = typeof cols === 'string' ? pcols = cols.split(',') : [cols];
    for (row_i = $rows.length - 1; row_i >= 0; row_i--) { row = $rows.shift(); $rows.insertAt(indexOf(row, row_i), row); }
    return $rows;
    function indexOf(row, start_index) {
        for (end_index = $rows.length - 1; start_index <= end_index;) {
            middle_index = start_index + Math.round((end_index - start_index) / 2);
            for (cols_i = 0; cols_i < cols.length; cols_i++) {
                col = cols[cols_i];
                result = $.comex.compare((cell = row.cell(col)), (middle_cell = $rows[middle_index].cell(col)));
                if (result) { break; }
                //if (!middle_cell || !middle_cell.isVal()) { result = -1; } else if (!cell || !cell.isVal()) { result = 1; }
            }
            if (result < 0) { end_index = middle_index - 1; } else { start_index = middle_index + 1; }
        }
        return start_index;
    }
};
Array.prototype.compare = Array.compare || function (rowb) {
    var rowa = this;
    if (rowa.objecttype !== 'row') { throw new Error('Este array no es una fila'); }
    if (rowa.table !== rowb.table) { throw new Error('Las filas no son de la misma tabla'); }
    return $.comex.compare(rowa.val(), rowb.val());
};
Array.prototype.export = Array.export || function (cols, caller, before, conf) {
    var rows = this, cell;
    var colSep = conf.cell("Formato >Separador").val();
    var maprow;
    if (conf.cell("Solo errores").val()) {
        maprow = function (col) {
            cell = rows[progress.index].cell(col);
            return cell && !cell.isValid() ? textprepare(cell.validationMessage()) : "";
        };
    } else {
        maprow = function (col) {
            cell = rows[progress.index].cell(col);
            return cell ? textprepare(cell.val(undefined, "TEXT")) : "";
        }
    }
    var progress = IProgress({
        length: rows.length,
        progress: caller,
        initialization: function (progress) {
            if (before) { before(progress); }
            progress.rowSep = "\r\n";
            progress.result = cols.map(function (col) { return textprepare(col.length ? col.join(" >") : col.title); }).join(colSep) + progress.rowSep;
        },
        work: function () { progress.result += cols.map(maprow).join(colSep) + progress.rowSep; }
    });
    progress.play();
    function textprepare(val) {
        if (val === "") { return ""; }
        if (val.contains("\r\n")) {
            val.replaceAll("\r\n", progress.rowSep);
        } else if (val.contains("\n\r")) {
            val.replaceAll("\n\r", progress.rowSep);
        } else if (val.contains("\r")) {
            val.replaceAll("\r", progress.rowSep);
        } else { val.replaceAll("\n", progress.rowSep); }
        return val.contains(colSep) || val.contains(progress.rowSep) || val.contains("\"") ? "\"{0}\"".format(val.replaceAll("\"", "\"\"")) : val;
    }
};

var currency = function (val) {
    this._val = val;
    return this;
};
currency._formatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
currency.parse = function (value) {
    value = [undefined, ""].contains(value) ? null : value;
    if (typeof value === "string") {
        // Default decimal point comes from settings, but could be set to eg. "," in opts:
        var decimal = ".";
        var strnum =
            value.toString()
            .replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
            .replace(new RegExp("[^0-9{0}-]".format(decimal), "g"), '')//Build regex to strip out everything except digits, decimal point and minus sign: strip out any cruft
            .replace(decimal, '.');
        value = parseFloat(strnum);
    } else if (typeof value === "number") {
        value = parseFloat(value);
    } else { value = value._currency; }
    return new currency(value);
};
currency.prototype = {
    format: function () {
        return this._val === null ? "" : currency._formatter.format(this._val).replace("$ ", "$");
    },
    toJSON: function () {
        return this._val;
    },
    compare: function (b) {
        if ([null, undefined, ""].contains(b)) { return; }
        return (+this).compare(+b);
    },
    isValid: function () {
        return !isNaN(this._val);
    },
    valueOf: function () {
        return this._val;
    },
    toString: function () {
        return this.format();
    }
};

var IRegla3 = function (left, rigth) {
    if (IRegla3._ori) { IRegla3._ori = false; this._left = left; this._rigth = rigth; } else { IRegla3._ori = true; return new IRegla3(left, rigth); }
};
IRegla3.prototype = {
    getLeft: function (rigth) { return (rigth * this._left) / this._rigth; },
    getRigth: function (left) { return (left * this._rigth) / this._left; },
    left: function (val) {
        var regla3 = this;
        if (val === undefined) { return regla3._left; }
        regla3._rigth = (val * regla3._rigth) / regla3._left;
        regla3._left = val;
        return regla3;
    },
    rigth: function (val) {
        var regla3 = this;
        if (val === undefined) { return regla3._rigth; }
        regla3._left = (val * regla3._left) / regla3._rigth;
        regla3._rigth = val;
        return regla3;
    }
};
var IProgress = function (confg) {
    if (IProgress.new) {
        IProgress.new = false;
        var $Progress = this;
        $Progress.length = confg.length;
        $Progress.progress = confg.progress;
        $Progress.initialization = confg.initialization;
        $Progress.work = confg.work;
        $Progress.continuar = confg.continuar;
        $Progress.index = 0;
    } else { IProgress.new = true; return new IProgress(confg); }
};
IProgress.prototype = {
    speed: function () { return this.now[2]; },
    elapsed: function () { return moment.duration(this.now[1].diff(this.start)); },
    completed: function () { return this.index / this.length; },
    remainingrows: function () { return this.length - this.index; },
    remaining: function () {
        var $Progress = this;
        var indexbuf = $Progress.buffer[$Progress.buffer.length > 10 ? $Progress.buffer.length - 10 : 0];
        return moment.duration(IRegla3($Progress.now[0] - indexbuf[0], $Progress.now[1].diff(indexbuf[1])).left($Progress.remainingrows()).rigth());
    },
    _progress: function () {
        var $Progress = this;
        $Progress.now = [$Progress.index, moment()];
        $Progress.now[2] = $Progress.buffer[$Progress.buffer.length - 1];
        $Progress.now[2] = Math.floor(IRegla3($Progress.now[0] - $Progress.now[2][0], $Progress.now[1].diff($Progress.now[2][1])).rigth(1000).left());
        $Progress.buffer.push($Progress.now);
        if ($Progress.buffer.length === 60) { $Progress.buffer.shift(); }
        if ($Progress._html) {
            var formatduration = "HH:mm:ss"; var formattitle = "HH:mm:ss.SSS";
            if ($Progress.elapsed().asMilliseconds() < 2000) { formatduration = formattitle; }
            $Progress._html.elapsed.html($Progress.elapsed().format(formatduration).replace(/^(00:)/g, ''))
                .prop("title", $Progress.elapsed().format(formattitle).replace(/^(00:)/g, ''));
            $Progress._html.worked.html($Progress.index);
            $Progress._html.progresstag.val($Progress.completed()).prop("title", "{0}%".format(Math.floor($Progress.completed() * 100)));
            $Progress._html.remaining.html($Progress.remaining().format("HH:mm:ss").replace(/^(00:)/g, ''));
            $Progress._html.pending.html($Progress.remainingrows());
            $Progress._html.speed.html("Velocidad: {0} Líneas/Seg".format($Progress.speed()));
        }
        if ($Progress.progress) { $Progress.progress($Progress, $Progress._completed); }
    },
    play: function () {
        var $Progress = this;
        if ($Progress._play) { return; }
        else if ($Progress._play === undefined) {
            $Progress.buffer = $Progress.buffer || [];
            $Progress.now = [$Progress.index, moment(), 0];
            $Progress.start = $Progress.start || $Progress.now[1];
            $Progress.buffer.push($Progress.now);
            if ($Progress.initialization) { $Progress.initialization($Progress); }
        }
        $Progress._play = true;
        $Progress._interval = setInterval(function () { $Progress._progress(); }, 1000);
        setTimeout(function () { $Progress._work(); }, 0);
    },
    pause: function () {
        var $Progress = this;
        clearInterval($Progress._interval); delete $Progress._interval;
        $Progress._play = false;
        $Progress._progress();
    },
    _work: function work() {
        var $Progress = this, loop, until;
        until = moment().add(250, "milliseconds");
        while ((loop = $Progress.index < $Progress.length && (!$Progress.continuar || $Progress.continuar($Progress))) && until.isAfter()) {
            $Progress.work($Progress);
            if ($Progress._play) { $Progress.index++; } else { return; }
        }
        if (loop) {
            setTimeout(function () { $Progress._work(); }, 0);
        } else {
            $Progress.now = [$Progress.index, moment()];
            $Progress.now[2] = Math.floor(IRegla3($Progress.index, $Progress.now[1].diff($Progress.start)).rigth(1000).left());
            $Progress._completed = true;
            clearInterval($Progress._interval); delete $Progress._interval;
            $Progress._progress();
        }
    },
    toString: function () {
        return " Velocidad: {0}\tLíneas trabajadas:{1}\tTranscurrido: {2}\tPorcentaje: {3}\tFaltante: {4}\tLíneas pendientes: {5}".format(
            this.speed()
            , this.index
            , this.elapsed().format("HH:mm:ss").replace(/^(00:)/g, '')
            , Math.floor(this.completed() * 100)
            , this.remaining().format("HH:mm:ss").replace(/^(00:)/g, '')
            , this.remainingrows()
        );
    },
    html: function () {
        "use strict";
        var $Progress = this;
        if ($Progress._html) { return $Progress._html.table; }
        $Progress._html = {
            elapsed: $("<td>"),
            worked: $("<td>"),
            remaining: $("<td>"),
            pending: $("<td>"),
            progresstag: $("<progress>"),
            speed: $("<td>"),
            table: $("<table>")
        };
        return $Progress._html.table.append($("<tbody>")
            .append($("<tr>")
                .append($Progress._html.elapsed.prop("title", "Tiempo transcurrido").addClass("right"))
                .append($("<td>").prop("rowspan", 2).css("width", "100%").css("overflow", "hidden").css("padding", 0)
                    .append($Progress._html.progresstag))
                .append($Progress._html.remaining.prop("title", "Tiempo faltante").addClass("right")))
            .append($("<tr>")
                .append($Progress._html.worked.prop("title", "Líneas trabajadas").addClass("right"))
                .append($Progress._html.pending.prop("title", "Líneas pendientes").addClass("right")))
            .append($("<tr>")
                .append($Progress._html.speed.prop("colspan", 3))));
    }
};

var Iindex = function (cols) {
    if (!cols) { throw new Error('Cols es requerido'); }
    if (Iindex._new) {
        delete Iindex._new;
        var $index = this;
        $index.objecttype = "Index";
        $index.cols = cols;
    } else { Iindex._new = true; return new Iindex(cols); }
};
Iindex.prototype = {
    _getRows: function () {
        var $index = this;
        if (!$index._rows) {
            $index._rows = [];
            for (var rows_i = 0, rows = $index.cols[0].table.rows(), row; rows_i < rows.length; rows_i++) {
                for ($index.cols_i = 0, row = rows[rows_i]; $index.cols_i < $index.cols.length; $index.cols_i++) {
                    row.cell($index.cols[$index.cols_i]).val(undefined, "VAL");
                }
            }
            delete $index.cols_i;
            $index.sorted = true;
        }
        return $index._rows;
    },
    _indexOf: function (data, start_index, current) {
        if (start_index === undefined) { start_index = 0; }
        if (current === undefined) { current = true; }
        var $index, rows, index, cols_length, cols_i, col, tmp = [];
        $index = this; rows = $index._rows || $index._getRows(); index = -1; cols_length = $index.cols.length;
        if ($index.cols_i !== undefined && $index.cols_i !== ($index.cols.length - 1)) { return index; }
        for (cols_i = 0; cols_i < cols_length; cols_i++) {
            col = $index.cols[cols_i];
            tmp[cols_i] = data.objecttype === "row" ? data.cell(col.index).valueOf() : data[col.index].valueOf();
            if ([undefined, null, ""].contains(tmp[cols_i])) { return -1; }
        }
        data = tmp;
        for (var end_index = rows.length - 1, middle_index, row, result; end_index > -1 && start_index <= end_index;) {
            middle_index = start_index + Math.round((end_index - start_index) / 2);
            for (cols_i = 0, row = rows[middle_index]; cols_i < cols_length; cols_i++) {
                col = $index.cols[cols_i];
                result = $.comex.compare(data[cols_i], row.cell(col.index).valueOf(), col.indexMatch, col.indexMatch);
                if (result) { break; }
            }
            if (result > 0) { start_index = middle_index + 1; } else if (result < 0) { end_index = middle_index - 1; } else { index = middle_index; break; }
        }
        if (current) { return index; }
        if (index !== -1) { throw new Error('Valor duplicado'); }
        return start_index;
    },
    getReady: function () {
        var $index = this;
        if (!$index._getReady) {
            $index._getReady = true;
            $index._getRows();
            $index._ready = true;
        }
        return $index._getReady;
    },
    get: function (data, rIndex) {
        var $index; $index = this;
        if (data === undefined) { throw new Error("data es requerido"); }
        if (data === "NEW") {
            var index = this, r = [];
            r.objecttype = "rIndex";
            r.index = index;
            return r;
        }
        if (data.objecttype === "cell") {
            data = data.row;
        } else if (data.objecttype === "rIndex" || rIndex) {
            data = data;
        } else {
			if(data === null){ return; }
            if ($index.cols.length > 1) { throw new Error("sin definir funcionamiento"); }
            var tmp = [];
            tmp[$index.cols[0].index] = data;
            data = tmp;
        }
        return $index._getRows()[$index._indexOf(data)];
    },
    remove: function (row) {
        var $index; $index = this;
        if (row === undefined) { throw new Error("row es requerido"); }
        if (row.objecttype === "cell") { row = row.row; }
        return $index._getRows().remove(row);
    },
    insert: function (row) {
        var $index; $index = this;
        if (row === undefined) { throw new Error("row es requerido"); }
        if (row.objecttype === "cell") { row = row.row; }
        return $index._getRows().insertAt($index._indexOf(row, 0, false), row);
    },
    cell: function () {
        return this;
    },
    val: function (val, format) {
        if (format === "MARK" && this.mark) { return this.mark; }
        return this.toString();
    },
    toString: function () {
        var index = this;
        return index.cols.map(function (col) { return col.title; }).join();
    }
};

function mergeRows(map) {
    map.rowsOrigen = map.rowsOrigen || map.tableOrigen.rows();
    map.i = map.i || 0;
    work();
    function work() {
        if (map.i < map.rowsOrigen.length) {
            map.rowOrigen = map.rowsOrigen[map.i];
            map.getRowDestino(function () { map.i++; setTimeout(work, 0); });
        }
    }
}
Array.prototype.getRowDestino = function (caller) {
    var map, rowDestino, cols, col, coli = 0;
    map = this; rowDestino = map.index.row("NEW");
    map.rowsDestino = map.rowsDestino || map.tableDestino.rows().clone();
    map.rowsWorked = map.rowsWorked || [];
    cols = map.tableDestino.cols();
    colsindex();
    function colsindex() {
        if (coli < map.index.cols.length) {
            col = map.index.cols[coli];
            map.cell(col, function (cellOrigen) { rowDestino.cell(col).val(cellOrigen.val(undefined, "TEXT"), "TEXT"); coli++; colsindex(); });
        } else if (rowDestino.isValid()) {
            updateRowDestino();
        } else { rowDestino.form(undefined, true).on('submited', updateRowDestino); }
    }
    function updateRowDestino() {
        rowDestino = map.index.get(rowDestino);
        if (map.rowsWorked.contains(rowDestino)) {
            caller(rowDestino);
        } else {
            if (!rowDestino) { rowDestino = map.tableDestino.rows('NEW'); }
            map.rowsDestino.remove(rowDestino); map.rowsWorked.push(rowDestino);
            coli = 0; col3();
        }
        function col3() {
            if (map.destino.contains(true) && coli < cols.length) {
                col = cols[coli];
                var isValDestino = rowDestino.cell(col).isVal();
                map.cell(col, function (cellOrigen) {
                    var isValOrigen = cellOrigen.isVal();
                    if ((!isValDestino && map.destino[0]) || (isValDestino && isValOrigen && map.destino[1]) || (!isValOrigen && map.destino[2])) {
                        rowDestino.cell(col).val(cellOrigen.val(undefined, "TEXT"), "TEXT"); coli++; col3();
                    }
                });
            } else { rowDestino.validate(caller); }
        }
    }
};

Array.prototype.ashtml = function (format, editable, cols) {
    var row = this;
    if (!cols) { cols = row.table.cols(); }
    if (row.objecttype === "row") {
        if (format === "vertical") {
            return $('<table>').data('row', row).addClass("ui-widget-content").addClass("vertical")
                    .append($('<tbody>')
                        .append(cols.map(function (col) { return IDatabase.td(col.length ? [row, col] : row.cell(col), "tr", editable); })));
        }
        return cols.map(function (col) { return IDatabase.td(col.length ? [row, col] : row.cell(col), $("<td>"), editable); });
    }
    var rows = this;
    rows._page = rows._page || 1;
    rows._pages = Math.ceil((rows.length) / 20);

    return rows.map(function (row) { return $("<tr>").append(row.ashtml("horizontal", editable)); });
};
Array.prototype.relations = function (col) {
    var rows;
    if (this.objecttype === "row") { rows = [this]; rows.table = this.table; } else { rows = this; }
    if (col) {
        if (typeof col === "string") { col = col.split("|"); col = rows.table.database.tables(col[0]).cols(col[1]); }
        return relation(col, rows);
    }
    return rows.table.relations.map(function (col) { return relation(col, rows); });
    function relation(col, rows) {
        var rest;
        if (rows.length) { rest = col.table.rows().where(function (relationrow) { return rows.contains(relationrow.cell(col).val()); }); } else { rest = []; }
        rest.table = col.table;
        rest.relation = col;
        rest.parent = rows;
        rest.new = function () {
            var newrow = rest.table.rows("NEW");
            newrow.cell(rest.relation).val(rest.parent[0]);
            rest.push(newrow);
            return newrow;
        };
        rest.refresh = function () {
            col.table.rows().where(function (relationrow) { if (rows.contains(relationrow.cell(col).val())) { rest.push(relationrow); } });
        };
        return rest;
    }
};
Array.prototype.form = function (caller, parent, autoclose, title) {
    var row = this, form, iscancel;
    if (!title) { title = row.action() === "INSERT" ? "{0} {1}".format("Añadir: ", row.table.title[1]) : "{0}".format(row); }
    form = $('<form>').prop("title", title).data("row", row).data("data", row)
        .on("change", function () {
            form.find('.container').each(function () {
                IDatabase.containerUpdate($(this));
            });
        })
        .on("submit", function (e) { e.preventDefault(); save_exit(); });
    form.exit = function (callerexit) {
        if (row.action() === "NOCHANGE") {
            parent.removeData("child"); form.removeData("parent").remove(); breadcrum(parent); if (callerexit) { callerexit(row, iscancel); }
        } else {
            $("<div>").prop("title", "SICC").html("¿Desea guardar los cambios efectuados en '{0}'?".format(title)).dialog({
                modal: true,
                buttons: {
                    'Sí': function () { $(this).dialog("close"); save_exit(); },
                    No: function () { $(this).dialog("close"); cancel_exit(); },
                    Cancelar: function () { $(this).dialog("close"); }
                }
            });
        }
    };
    form.save = function (caller) {
        if (row.isValid()) {
            if (row.action() === "NOCHANGE") {
                ready();
            } else {
                submit.prop('disabled', true).button('refresh');
                var timeout = setInterval(function () { submit.prop('disabled', false).button('refresh'); clearInterval(timeout); }, 10000);
                IDatabase.data(row, function (error) {
                    clearInterval(timeout);
                    submit.prop('disabled', false).button('refresh');
                    if (!error) { ready(); }
                });
            }
        } else { submit.trigger("click"); }
        function ready() { if (caller) { caller(row); } }
    };
    if (parent.data("child")) {
        var lf = leaf(parent);
        var pr;
        while (lf.data("data") !== parent.data("data")) {
            pr = lf.data("parent");
            lf.remove();
            lf = pr;
        }
    }
    form.data("parent", parent);
    parent.data("child", form);
    var submit = $('<input/>').prop('type', 'submit').prop('value', 'Aceptar').css("float", "right");
    var cancel = $("<input>").prop("type", "button").val("Cancelar").css("float", "right").on("click", cancel_exit);
    var save = $("<input>").prop("type", "button").val("Guardar").on("click", function () {
        form.save(function () { form.trigger("change"); });
    });
    form
        .append(submit).append(cancel).append(save)
        .append(row.ashtml("vertical", true))
        .append(row.table.relations.clone().sortCols('STR').map(function (relation) {
            var title = relation.table.title[0];
            if (relation.title !== row.table.title[1]) { title = "{0} como {1}".format(title, relation.title); }
            var input = $("<input>").prop("type", "button")
                .on("click", function () {
                    form.save(function () { row.relations(relation).formsear(function () { form.trigger("change"); }, form, "subtable", title); });
                });
            input.val(title);
            return input;
        }));
    form._showform = function () {
        var rt = root(form);
        breadcrum(form);
        rt
        .append(form);
    };
    form._showform();
    return form;
    function save_exit() { form.save(function () { form.exit(caller); }); }
    function cancel_exit() { iscancel = true; row.action("NOCHANGE"); form.exit(caller); }
};

function root(form) {
    while (form.data("parent")) { form = form.data("parent"); }
    return form;
}
function leaf(form) {
    while (form.data("child")) { form = form.data("child"); }
    return form;
}
function breadcrum(form) {
    var levels = [], level, rt;
    rt = level = root(form);
    levels.push(level);
    while (level.data("child")) { level = level.data("child"); levels.push(level); }
    var brc = $("#bradcrum").empty();
    return brc.append(levels.map(function (level) {
        var span = $("<span>");
        var input = $("<input>").prop("type", "button").val(level.prop("title")).on("click", function () {
            var data = form.data("data");
            var submit = form.find("input[type='submit']");
            if (data.action() === "NOCHANGE") {
                breadcrum(level);
            } else {
                $("<div>").prop("title", "SICC").html("¿Desea guardar los cambios efectuados en '{0}'?".format(form.prop("title"))).dialog({
                    modal: true,
                    buttons: {
                        'Sí': function () { $(this).dialog("close"); if (data.isValid()) { breadcrum(level); } submit.trigger("click"); },
                        No: function () {
                            form.data("parent").data("child", null);
                            form.data("parent", null);
                            form.remove();
                            $(this).dialog("close"); data.action('NOCHANGE'); breadcrum(level);
                        },
                        Cancelar: function () { $(this).dialog("close"); }
                    }
                });
            }
        });
        span.append(input);
        if (level.get()[0] === form.get()[0] || level === rt) {
            level.show();
            input.prop("disabled", true);
        } else { level.hide(); }
        if (level.data("child")) { span.append($("<span>").html(" >")); }
        return span;
    }));
}

Array.prototype.prepare = function (type) {
    var rows = this, i;
    var colnot = ["Fecha actualizado", "Sesión actualizado", "Fecha insertado", "Sesión insertado", "Sesión"];
    var cols;
    if (type === "table") {
        if (!rows.table.colsdef) {
            rows.table.colsdef = rows.table.cols().where(function (col) { return !(col.pk && col.readonly) && !colnot.contains(col.title); });
            rows.table.colsdef.ready = true;
        } else if (!rows.table.colsdef.ready) {
            for (i = 0; i < rows.table.colsdef.length; i++) { rows.table.colsdef[i] = rows.table.cols(rows.table.colsdef[i]); }
            rows.table.colsdef.ready = true;
        }
        cols = rows.table.colsdef;
    } else if (type === "table-edit") {
        if (!rows.table.colsdef) {
            rows.table.colsdef = rows.table.cols().where(function (col) { return !(col.pk && col.readonly) && !colnot.contains(col.title); });
            rows.table.colsdef.ready = true;
        } else if (!rows.table.colsdef.ready) {
            for (i = 0; i < rows.table.colsdef.length; i++) { rows.table.colsdef[i] = rows.table.cols(rows.table.colsdef[i]); }
            rows.table.colsdef.ready = true;
        }
        cols = rows.table.colsdef;
    } else if (type === "subtable") {
        if (!rows.relation.colsdef) {
            rows.relation.colsdef = rows.table.cols().where(function (col) { return !(col.pk && col.readonly) && !colnot.contains(col.title) && col !== rows.relation; });
            rows.relation.colsdef.ready = true;
        } else if (!rows.relation.colsdef.ready) {
            for (i = 0; i < rows.relation.colsdef.length; i++) { rows.relation.colsdef[i] = rows.table.cols(rows.relation.colsdef[i]); }
            rows.relation.colsdef.ready = true;
        }
        cols = rows.relation.colsdef;
    } else if (type === "form") {
        if (!rows.table.colssear) {
            rows.table.colssear = rows.table.cols().where(function (col) { return !colnot.contains(col.title); });
            rows.table.colssear.ready = true;
        } else if (!rows.table.colssear.ready) {
            for (i = 0; i < rows.table.colssear.length; i++) { rows.table.colssear[i] = rows.table.cols(table.colssear[i]); }
            rows.table.colssear.ready = true;
        }
        cols = rows.table.colssear;
    } else if (type === "cols") {
        if (!rows.table.cols().ready) { rows.table.cols().ready = true; }
        cols = rows.table.cols();
    }
    trow();
    return cols;
    function trow() {
        if (!cols._trow) {
            cols._trow = ITable({
                title: ["rowbus", "rowbus"],
                insert: true, update: true, delete: true,
                cols: cols.map(function (col) {
                    if (col.length) { col = col[col.length - 1]; }
                    return {
                        title: col.title, type: col.type, parent: col.parent, parent_cell: col.parent_cell, delay: 800, maxlength: col.maxlength
                        , minlength: col.minlength, min: col.min, max: col.max
                    };
                })
            });
        }
        if (!cols.row_filter) { cols.row_filter = cols._trow.rows("NEW"); }
    }
};
Array.prototype.formsear = function (caller, parent, type, title) {
    "use strict";
    var rows = this, cols, form, editable, row_filter, iscancel;
    if (!title) { title = "Tabla: {0}".format(rows.table.title[0]); }
    editable = ["subtable", "table-edit"].contains(type) && (rows.table.insert || rows.table.update || rows.table.delete);
    form = $("<form>").prop("title", title).data("data", rows)
        .on("change", function () { form.find('.container').each(function () { IDatabase.containerUpdate($(this)); }); })
        .on("submit", function (e) { e.preventDefault(); save_exit(); });
    form.exit = function (caller) {
        if (editable && rows.action() !== "NOCHANGE") {
            $("<div>").prop("title", "SICC").html("¿Desea guardar los cambios efectuados en '{0}'?".format(title)).dialog({
                modal: true,
                buttons: {
                    Sí: function () { $(this).dialog("close"); save_exit(); },
                    No: function () { $(this).dialog("close"); cancel_exit(); },
                    Cancelar: function () { $(this).dialog("close"); }
                }
            });
        } else { parent.removeData("child"); form.removeData("parent").remove(); breadcrum(parent); if (caller) { caller(rows, iscancel); } }
    };
    form.save = function (caller) {
        if (editable && rows.isValid() && rows.action() !== "NOCHANGE") {
            submit.prop('disabled', true).button('refresh');
            var timeout = setInterval(function () { submit.prop('disabled', false).button('refresh'); clearInterval(timeout); }, 10000);
            IDatabase.data(rows, function (error) {
                clearInterval(timeout);
                submit.prop('disabled', false).button('refresh');
                if (!error) { ready(); }
            });
        } else if (editable && !rows.isValid()) {
            form._page.val(Math.ceil((rows.indexOf(rows.find(function (row) { return !row.isValid(); })) + 1 || 1) / 20));
            form.update_tbody();
            //setTimeout(function () { submit.trigger("click"); }, 200);
        } else { ready(); }
        function ready() { if (caller) { caller(rows); } }
    };
    form._page = ITable({
        title: ["Paginas", "Página"],
        insert: true, update: true, delete: true,
        cols: [{ title: "Página", type: "Int", required: true, min: 1, default: 1 }]
    }).rows("NEW").cell("Página");
    cols = rows.prepare(type);
    row_filter = cols.row_filter;
    delete cols.row_filter;
    if (parent.data("child")) {
        var lf = leaf(parent);
        var pr;
        while (lf.data("data") !== parent.data("data")) {
            pr = lf.data("parent");
            lf.remove();
            lf = pr;
        }
    }
    form.data("parent", parent);
    parent.data("child", form);
    form._showform = function () {
        var rt = root(form); breadcrum(form);
        rt
        .append(form);
    };
    form._showform();
    var submit = $('<input>').prop('type', 'submit').prop('value', 'Aceptar').css("float", "right");
    var cancel = $("<input>").prop("type", "button").val("Cancelar").css("float", "right").on("click", cancel_exit);
    var save = $("<input>").prop("type", "button").val("Guardar").on("click", function () { form.save(function () { form.trigger("change"); }); });
    if (!editable) { submit.hide(); if (type !== "form") { cancel.hide(); } save.hide(); }
    var thead = $("<thead>");
    var tbody = $("<tbody>");
    form.update_thead = function () {
        thead.empty()
            .append($("<tr>")
                .append($("<th>").addClass("ui-widget-header").prop("rowspan", 2))
                .append(row_filter.ashtml("horizontal", true)).on("change", function (e) {
                    $(e.target).addClass('ui-autocomplete-loading');
                    form._page.val(1);
                    form.rows_filter = undefined;
                    form.update_tbody();
                }))
            .append($("<tr>").append(cols.map(IDatabase.th)));
    };
    form.update_thead();
    form.data("update", function () {
        form.rows_filter = undefined;
        form.update_thead();
        form.update_tbody();
    });
    form.update_tbody = function (call, last) {
        if (form.rows_filter) {
            tbody2(); if (call) { call(); }
        } else {
            rows.search(undefined, function (progress, complete) {
                if (complete) {
                    thead.find(".control").removeClass('ui-autocomplete-loading');
                    form.rows_filter = progress.results;
                    tbody2(); if (call) { call(); }
                }
            }, cols, row_filter);
        }
        function tbody2() {
            if (type === "subtable") { buttonAdd.prop("disabled", false); } else { buttonAdd.prop("disabled", form.rows_filter.length > 20); }
            if (form.rows_filter.length) { noresults.hide(); } else { noresults.show(); }
            form._page.col.max = Math.ceil((form.rows_filter.length || 1) / 20);
            if (last) { form._page.val(form._page.col.max); }
            regs.html("{0} registros".format(form.rows_filter.length));
            firs_page.prop("disabled", form._page.val() === 1);
            prev_page.prop("disabled", form._page.val() === 1);
            next_page.prop("disabled", form._page.val() === form._page.col.max);
            last_page.prop("disabled", form._page.val() === form._page.col.max);
            if (!form.rows_filter._created) {
                form.rows_filter._created = true; tdpage.empty().append(form._page.row.ashtml("vertical", true));
            } else { tdpage.find('.container').each(function () { IDatabase.containerUpdate($(this)); }); }
            tdpages.empty().html(" de {0} ".format(form._page.col.max));
            var starindex = (form._page.val() - 1) * 20;
            tbody.empty().data("rows", form.rows_filter)
                .append(form.rows_filter.slice(starindex, starindex + 20).map(function (row) {
                    var tr = $("<tr>");
                    var th = $("<th>").data("row", row).addClass("ui-widget-header").html(form.rows_filter.indexOf(row) + 1);
                    if (type === "form") {
                        tr.on("mouseenter", function () { tbody.find("tr > td").removeClass("ui-state-active"); tr.find("td").addClass("ui-state-active"); })
                            .on("click", function () { form.exit(function () { caller(row); }); });
                    } else {
                        th.attr('contextmenu', rows.table.contextMenu().toString())
                            .on("mouseup", function () {
                                var target = $(this);
                                if (event.which === 3) {
                                    target.closest("tbody").find("th, .container").removeClass("ui-state-active");
                                    target.addClass("ui-state-active");
                                }
                            })
                            .on("dblclick", function () {
                                form.save(function () { row.form(function () { form.trigger("change"); }, form, undefined, "{0}".format(row)); });
                            })
                            .hover(function () { th.addClass("ui-state-hover"); }, function () { th.removeClass("ui-state-hover"); });
                    }
                    return tr
                        .append(th)
                        .append(cols.map(function (col) {
                            var editble = editable && !col.length;
                            var td = $("<td>").data("editable", editble);
                            if ((editable && !["Textarea", "String"].contains(col.type)) || col.parent) { td.attr("contextmenu", "cm_cell"); }
                            if (!IDatabase._td) {
                                IDatabase._td = true;
                                $.contextMenu({
                                    selector: "[contextmenu=cm_cell]",
                                    build: function () {
                                        return {
                                            items: {
                                                abrir: {
                                                    name: "Abrir registro", callback: function () {
                                                        var container = this, row, cell, title;
                                                        cell = container.data("cell");
                                                        if (cell.length) { cell = cell[0].cell(cell[1]); }
                                                        if (cell) {
                                                            row = cell.val();
                                                            title = "{0}: {1}".format(cell.col, row);
                                                        }
                                                        if (row) { row.form(function () { container.trigger("change"); }, container.closest("form"), undefined, title); }
                                                    },
                                                    disabled: function () { return !(this.data("cell").col.parent && this.data("cell").isVal()); }
                                                },
                                                replicate: {
                                                    name: "Replicar cambio", callback: function () {
                                                        var container = this;
                                                        var rows = container.closest("tbody").data("rows");
                                                        var cell = container.data("cell");
                                                        for (var i = 0, rowcell; i < rows.length; i++) {
                                                            rowcell = rows[i].cell(cell.col);
                                                            if (rowcell._val === cell._prev[0] || $.comex.compare(rowcell._val, cell._prev[0]) === 0) {
                                                                rowcell.val(cell._val);
                                                                delete rowcell._prev;
                                                            }
                                                        }
                                                        delete cell._prev;
                                                        IDatabase.containerUpdate(container).trigger("change");
                                                    },
                                                    disabled: function () {
                                                        var cell = this.data("cell");
                                                        return !(
                                                            this.data("editable")
                                                            && cell.validity.valid
                                                            && cell._prev !== undefined
                                                            && !(cell.col.unique && !(!cell._prev[1] && cell._val === null))
                                                        );
                                                    }
                                                },
                                                original: {
                                                    name: "Valor original", callback: function () {
                                                        var container = this, cell = container.data("cell");
                                                        cell.val(cell._ori);
                                                        IDatabase.containerUpdate(container).trigger("change");
                                                    },
                                                    disabled: function () { return this.data("cell")._ori === undefined; }
                                                }
                                            }
                                        };
                                    }
                                });
                            }
                            return IDatabase.td(col.length ? [row, col] : row.cell(col), td, editble);
                        }));
                }));
            if (form._refresh) { refresh(); } else { setTimeout(function () { refresh(); form._refresh = true; }, 2000); }
        }
        function refresh() {
            buttonAdd.button("refresh"); firs_page.button("refresh"); prev_page.button("refresh"); next_page.button("refresh"); last_page.button("refresh");
        }
    };
    var buttonAdd = $("<input>").prop("type", "button").prop("disabled", true).val("Añadir").on("click", function () {
        form.save(paso_1);
        function paso_1() {
            var row = form.add();
            if (type === "subtable") {
                form.update_tbody(function () { form.find("tbody:first").find("tr:last").find("input:first").focus(); }, true);
            } else if (type === "form") {
                form.exit(); row.form(caller, parent);
            } else {
                row.form(function (row_r, cancel) {
                    if (cancel) { rows.remove(row); form.rows_filter.remove(row); }
                    form.update_tbody(undefined, true);
                }, form, undefined, "Añadir");
            }
        }
    });
    if (!rows.table.insert) { buttonAdd.hide(); }
    form.add = function () {
        var row = rows.table.rows('NEW');
        if (type === "subtable") { row.cell(rows.relation).val(rows.parent[0]); }
        for (var col_i = 0, col, cell_filter; col_i < cols.length; col_i++) {
            if (!(col = cols[col_i]).length && !col.readonly && (cell_filter = row_filter.cell(col_i)).isVal()) {
                row.cell(col).val(cell_filter.val(undefined, "TEXT"), "TEXT");
            }
        }
        if (!rows.contains(row)) { rows.push(row); }
        form.rows_filter.push(row);
        return row;
    };
    var buttonExport = $("<input>").prop("type", "button").val("Exportar").on("click", function () {
        //http://datatables.net/blog/2014-01-31
        //http://codepen.io/suhajdab/pen/wpulo
        //https://gist.github.com/JamesMGreene/8589353
        paso_1();
        var formpaso1, configuracion;
        function paso_1() {
            var formatos = ITable({
                title: ["Formatos", "Formato"],
                insert: false, update: false, delete: false,
                cols: [
                    { title: "Formato ID", pk: true, identity: true },
                    { title: "Formato", str: true },
                    { title: "Extensión" },
                    { title: "Separador", clean: false, required: true }]
            });
            formatos._rows = [[1, "CSV (delimitado por comas)(*.csv)", "csv", ","], [2, "TSV (delimitado por tabuladores)(*.tsv)", "tsv", "\t"]];
            formatos._rows.table = formatos;
            for (var i = 0; i < formatos._rows.length; i++) {
                formatos._rows[i].objecttype = 'row';
                formatos._rows[i].table = formatos;
            }
            configuracion = ITable({
                title: ["Configuraciones", "Configuración"],
                insert: true, update: true, delete: true,
                cols: [
                    { title: "Formato", type: "Int", required: true, default: formatos._rows[0] },
                    { title: "Solo errores", type: "Bool" }
                ]
            });
            relations(formatos.cols("PK"), configuracion.cols("Formato"));
            configuracion = configuracion.rows("NEW");
            formpaso1 = configuracion.form(paso_2, form, undefined, "Exportar");
        }
        function paso_2() {
            var exp = $("<div>");
            form.rows_filter.export(cols, function (progress, ready) {
                if (ready) {
                    //http://stackoverflow.com/questions/21342492/encoding-issues-for-utf8-csv-file-when-opening-excel-and-textedit
                    exp
						//.append($('<a>').html('Descargar').prop("href", "data:text/tab-separated-values;base64," + btoa(progress.result))
                        //    .prop("download", "{0}.{1}".format(rows.table.title[0], configuracion.cell("Formato >Extensión"))))
                        .append($("<input>").prop("type", "button").val("Mostar en cuadro de texto").on("click", function () {
                            var textarea = $('<textarea>').data("nogrow", true).css("width", "100%").css("height", "250px").val(progress.result).
                                on("focusin click", function () { textarea.select(); });
                            exp.append(textarea);
                            textarea.focus();
                        }));
                }
            }, function (progress) {
                exp.prop("title", "Exportar").append(progress.html()).dialog({ modal: true, width: "842px" });
            }, configuracion);
        }
    });
    if (type === "form") { buttonExport.hide(); }
    var buttonImport = $("<input>").prop("type", "button").val("Importar").on("click", function () {
        var formpaso1, formpaso2, formpaso3, formpaso4;
        var progress;
        var imp = {
            import_row: undefined,
            import_table: undefined,
            row_filter: undefined,
            row_update: undefined,
            row_update_2: [],
            rows_worked: []
        };
        form.save(paso_1);
        function paso_1() {
            imp.rows_worked.table = rows.table;
            imp.import_row = ITable({
                title: ["Datos", "Datos"],
                insert: true, update: true, delete: true,
                cols: [{ title: "Datos", type: "Textarea", required: true }]
            }).rows("NEW");
            formpaso1 = imp.import_row.form(paso_2, form, undefined, "Importar");
        }
        function paso_2() {
            var ttt = $.tsv.parseRows(imp.import_row.cell("Datos").val(), { stripHeader: true });
            imp.import_table = ITable({
                title: ["Tabla origen", "Tabla origen"],
                insert: false, update: true, delete: true,
                cols: ttt[-1].map(function (col) { return { title: col.trimSingleLine(), type: "String", readonly: true }; })
            });
            imp.import_table._rows = function () {
                for (var i = 0, row; i < ttt.length; i++) {
                    row = ttt[i]; row.objecttype = "row"; row.table = imp.import_table;
                    if (row.length === 1 && row[0] === "") { ttt = ttt.slice(0, i); break; }
                    for (var j = 0; j < row.length; j++) { if (row[j] === "") { row[j] = null; } }
                }
                return ttt;
            }();
            imp.import_table._rows.table = imp.import_table;
            var theothercols;
            if (rows.relation) { theothercols = rows.relation.tindex.cols.where(function (col) { return col !== rows.relation; }); } else { theothercols = []; }
            var relation_table = ITable({
                title: ["Relacionar columnas", "Relacionar columna"],
                insert: false, update: true, delete: false,
                cols: rows.table.cols().map(function (col) {
                    return {
                        title: col.title,
                        pk: col.pk,
                        str: col.str,
                        type: col.type,
                        readonly: col.readonly,
                        pattern: col.pattern,
                        unique: theothercols[0] === col ? true : col.unique,
                        required: rows.relation === col ? false : (theothercols[0] === col ? true : (col.readonly ? false : col.required)),
                        parent: col.parent,
                        parent_cell: col.parent_cell
                    };
                }),
                colsdef: cols.map(function (col) { return col.length ? col.join(" >") : col.title; })
            });
            var cols_filter = relation_table.rows().prepare("table-edit");
            imp.row_filter = cols_filter.row_filter;
            imp.row_update = relation_table.rows("NEW");
            if (!rows.length && rows.table.insert) { imp.row_update.allow_add = true; }
            var func1 = function (cell) {
                if (working) { return; }
                working = true;
                if (cell.isVal() || imp.row_update.cell(cell.col.index).col.readonly) { imp.row_update.cell(cell.col.index).val(cell.val()); }
                for (var i = 0; i < cols_filter.length; i++) {
                    col = cols_filter[i];
                    var cell_filter = imp.row_filter.cell(i);
                    var cell_update = imp.row_update.cell(col.index);
                    if (col.length) {
                        continue;
                    } else if (!col.tindex) {
                        continue;
                    } else if (imp.row_update.allow_add && col.pk) {
                        continue;
                    } else {
                        if (cell.isVal()) {
                            cell_filter.required = false;
                            if (cell !== cell_filter) {
                                cell_filter.disabled = true;
                                delete cell_update.disabled;
                            } else { cell_update.disabled = true; }
                        } else {
                            delete cell_filter.disabled;
                            cell_filter.required = true;
                            delete cell_update.disabled;
                        }
                        cell_filter.reeval();
                    }
                }
                working = false;
            };
            var func2 = function (col) { return col.title.compare(coltitle) === 0; };
            for (var i = 0, col, cell_filter, cell_update, coltitle; i < cols_filter.length; i++) {
                col = cols_filter[i]; cell_filter = imp.row_filter.cell(i); cell_update = imp.row_update.cell(col.index);
                if (col.length) {
                    coltitle = col.join(" >");
                    cell_filter.disabled = true;
                } else if (!col.tindex) {
                    coltitle = col.title;
                    cell_filter.disabled = true;
                    cell_update.col = new ICol({
                        title: cell_update.col.title, type: cell_update.col.type, parent: imp.import_table.cols(), delay: 800, maxlength: cell_update.col.maxlength
                        , minlength: cell_update.col.minlength, min: cell_update.col.min, max: cell_update.col.max, readonly: col.readonly
                    }, cell_update.col.table, col.index);
                } else if (imp.row_update.allow_add && col.pk) {
                    coltitle = col.title;
                    cell_filter.disabled = true;
                } else {
                    coltitle = col.title;
                    var working;
                    cell_filter.col = new ICol({
                        title: cell_filter.col.title, type: cell_filter.col.type, parent: imp.import_table.cols(), delay: 800, maxlength: cell_filter.col.maxlength
                        , minlength: cell_filter.col.minlength, min: cell_filter.col.min, max: cell_filter.col.max, onChange: func1
                    }, cell_filter.col.table, col.index);
                    cell_filter.required = true;
                    cell_update.col = new ICol({
                        title: cell_filter.col.title, type: cell_filter.col.type, parent: imp.import_table.cols(), delay: 800, maxlength: cell_filter.col.maxlength
                        , minlength: cell_filter.col.minlength, min: cell_filter.col.min, max: cell_filter.col.max, readonly: col.readonly
                    }, cell_update.col.table, col.index);
                }
                var ccc = imp.import_table.cols().find(func2);
                if (ccc && !cell_filter.disabled) { cell_filter.val(ccc); }
                if (ccc && !cell_update.disabled && !cell_update.col.readonly) { cell_update.val(ccc); }
            }
            formpaso2 = relation_table.rows().formsear(paso_3, form, "table-edit", "Relacionar columnas");
        }
        function paso_3() {
            var notrela, i;
            if (rows.relation) { notrela = rows.relation.tindex.cols.where(function (col) { return col !== rows.relation; }); } else { notrela = []; }
            var func1 = function (parent) {
                for (var i = 0, rows = imp.import_table.rows(), row, cell ; i < rows.length; i++) {
                    row = rows[i]; cell = row.cell(parent.col.oricol);
                    if (cell.validity && cell.validity.badInput) { cell.val(cell._val, "TEXT"); }
                }
            };
            var func2 = function () {
                var target = this, col;
                col = target.data("col");
                col.parent_cell.row
                    .form(
                        function () { target.trigger("change"); }, target.closest("form"), true
                        , "Propiedades de columna: {0}".format(col.title)
                    );
            };
            i = 0;
            for (var table_cols = rows.table.cols(), col, import_col, import_data ; i < table_cols.length; i++) {
                col = table_cols[i];
                import_data = imp.row_update.cell(i).val();
                if (import_data) { imp.row_update_2.push(col); }
                if (import_data && import_data.objecttype === "col") {
                    import_col = import_data;
                    delete import_col.readonly;
                    import_col.type = col.type;
                    import_col.required = col.required;
                    import_col.min = col.min;
                    import_col.max = col.max;
                    import_col.step = col.step;
                    import_col.maxlength = col.maxlength;
                    import_col.transform = col.transform;
                    import_col.sinacentos = col.sinacentos;
                    import_col.pattern = col.pattern;
                    if (col.unique || col === notrela[0]) {
                        import_col.unique = true;
                        import_col.tindex = Iindex([import_col]);
                        imp.import_table.str = import_col;
                    }
                    if (col.parent) {
                        import_col.parent = col.parent;
                        import_col.parent_cell = ITable({
                            title: ["Columnas", "Columna"],
                            insert: false, update: true, delete: false,
                            cols: [{ title: "Columna padre", required: true, onChange: func1 }]
                        });
                        import_col.parent_cell.cols("Columna padre").oricol = import_col;
                        import_col.parent_cell.cols("Columna padre").parent = col.parent.table.cols().where(function (col) { return col.unique; });
                        import_col.parent_cell.cols("Columna padre").parent.table = col.parent.table;
                        import_col.parent_cell = import_col.parent_cell.rows("NEW").cell("Columna padre");
                        import_col.parent_cell.val(col.parent.table.str);
                        import_col.contextMenu = {};
                        import_col.contextMenu.toString = function () { return "cm_{0}".format("col"); };
                        import_col.contextMenu.selector = '[contextmenu={0}]'.format(import_col.contextMenu);
                        import_col.contextMenu.items = { prop: { name: "Propiedades", callback: func2 } };
                        $.contextMenu(import_col.contextMenu);
                    }
                }
            }
            i = 0;
            for (var rows_i = imp.import_table.rows(), j, row_j ; i < rows_i.length; i++) {
                for (j = 0, row_j = rows_i[i]; j < row_j.length; j++) { if (row_j.cell(j).validity) { row_j[j].reeval(); } }
            }
            formpaso3 = imp.import_table.rows().formsear(paso_4, form, "table-edit", "Problemas de origen");
            if (imp.import_table.rows().isValid()) { paso_4(); }
        }
        function paso_4() {
            var newrows = rows.clone(), i;
            newrows.parent = rows.parent;
            newrows.relation = rows.relation;
            newrows.table = rows.table;
            imp.row_filter_2 = newrows.prepare(type).row_filter;
            formpaso4 = newrows.formsear(paso_5, form, type, "Vaciar datos");
            var tindex = rows.table.cols(imp.row_filter.find(function (cell) { return cell.isVal(); }).col.index).tindex;
            var div_message = $("<div>");
            progress = IProgress({
                length: imp.import_table._rows.length,
                initialization: function (progress) {
                    progress.div_row_origen = $("<div>").addClass("ui-widget-content");
                    progress.worked = [];
                    progress.worked.table = rows.table;
                    progress.worked.relation = rows.relation;
                    progress.worked.parent = rows.parent;
                    progress.not_worked = rows.clone();
                    progress.update_cell;
                    progress.func1 = function () { div_message.empty(); progress.import_cell.skip_disabled = false; progress.play(); };
                    progress.func2 = function () { div_message.empty(); progress.update_cell.skip_disabled = false; progress.play(); };
                    progress.func3 = function () { div_message.empty(); progress.import_cell.allow_update = true; progress.play(); };
                    progress.func4 = function () { div_message.empty(); progress.import_cell.allow_update = false; progress.play(); };
                    progress.func5 = function () { div_message.empty(); progress.update_cell.allow_update = true; progress.play(); };
                    progress.func6 = function () { div_message.empty(); progress.update_cell.allow_update = false; progress.play(); };
                    progress.func7 = function () { div_message.empty(); progress.import_cell.allow_delete = true; progress.play(); };
                    progress.func8 = function () { div_message.empty(); progress.import_cell.allow_delete = false; progress.play(); };
                    progress.func9 = function () { div_message.empty(); progress.update_cell.allow_delete = true; progress.play(); };
                    progress.func10 = function () { div_message.empty(); progress.update_cell.allow_delete = false; progress.play(); };
                    formpaso4.progressdiv.empty().append(progress.html()).append(progress.div_row_origen).append(div_message);
                    progress.get = function (busqueda, allowadd) {
                        var tmp = tindex.get(busqueda, true);
                        if (!tmp && allowadd) { return formpaso4.add(); }
                        return tmp;
                    };
                },
                progress: function (progress, complete) {
                    if (complete) {
                        for (var i = 0; i < imp.row_filter_2.length; i++) { imp.row_filter_2[i].val(null); }
                        delete progress.import_row;
                        if (rows.length) {
                            formpaso4 = progress.worked.formsear(paso_5, form, type === "table" ? "table-edit" : type, "Filas trabajadas");
                        } else {
                            paso_5();
                            form.removeData("child"); formpaso4.removeData("parent").remove(); breadcrum(form);
                        }
                        return;
                    }
                    if (progress.import_row) {
                        progress.div_row_origen.empty().append($("<div>").addClass("ui-widget-header").html("FILA ORIGEN").css("padding", "5px 12px"))
                            .append($('<div>').addClass("table")
                                .append($("<table>").addClass("ui-widget-content")
                                    .append($("<thead>")
                                        .append($("<tr>")
                                            .append($("<th>").addClass("ui-widget-header"))
                                            .append(imp.import_table.cols().map(function (col) {
                                                var th = $("<th>").data("col", col).addClass("ui-widget-header");
                                                if ($.type(col) === "array") {
                                                    th.html(col.join(" >"));
                                                } else {
                                                    th.html(col.title).append(col.required ?
                                                        $("<i>").addClass("fa").addClass("fa-asterisk").prop("title", "Campo requerido") : undefined);
                                                    if (col.contextMenu) {
                                                        th.attr('contextmenu', col.contextMenu.toString()).on("mouseup", function () {
                                                            var target = $(this);
                                                            if (event.which === 3) {
                                                                target.closest("thead").find("th").removeClass("ui-state-active");
                                                                target.addClass("ui-state-active");
                                                            }
                                                        });
                                                    }
                                                }
                                                return th;
                                            }))))
                                    .append($("<tbody>")
                                        .append($("<tr>")
                                            .append($("<th>").data("row", progress.import_row).addClass("ui-widget-header")
                                                .html(imp.import_table.rows().indexOf(progress.import_row) + 1))
                                            .append(progress.import_row.cell()
                                                .map(function (cell) {
                                                    return IDatabase.td(cell, $("<td>"), false).toggleClass("ui-state-active", progress.import_cell === cell);
                                                }))))));
                    }
                    formpaso4.update_thead();
                    formpaso4.update_tbody();
                },
                work: function () {
                    progress.row = [];
                    if (rows.relation) { progress.row[rows.relation.index] = rows.parent[0]; }
                    progress.import_row = imp.import_table.rows()[progress.index];
                    i = 0;
                    for (var filter_val ; i < imp.row_filter.length; i++) {
                        if ((filter_val = imp.row_filter[i].val())) {
                            imp.row_filter_2[i].val(progress.import_row.cell(filter_val).val());
                            progress.row[rows.table.cols(imp.row_filter[i].col.title).index] = progress.import_row.cell(filter_val).val();
                        }
                    }
                    progress.row = progress.get(progress.row, imp.row_update.allow_add || progress.import_row.allow_add);
                    if (!progress.row && imp.row_update.allow_add === undefined && progress.import_row.allow_add === undefined) {
                        div_message
                            .append($("<div>").addClass("ui-state-highlight ui-corner-all err")
                                .html("No se encuentra la fila en el destino, ¿deseas agregarla?<br />")
                                .append($("<input>").prop("type", "button").val("Permitir").prop("disabled", !rows.table.insert)
                                    .on("click", function () { div_message.empty(); progress.import_row.allow_add = true; progress.play(); }))
                                .append($("<input>").prop("type", "button").val("Omitir")
                                    .on("click", function () { div_message.empty(); progress.import_row.allow_add = false; progress.play(); }))
                                .append($("<input>").prop("type", "button").val("Permir siempre").prop("disabled", !rows.table.insert)
                                    .on("click", function () { div_message.empty(); imp.row_update.allow_add = true; progress.play(); }))
                                .append($("<input>").prop("type", "button").val("Omitir siempre")
                                    .on("click", function () { div_message.empty(); imp.row_update.allow_add = false; progress.play(); })));
                        progress.pause(); return;
                    } else if (!progress.row) { return; }
                    i = 0;
                    for (var update_col_i ; i < imp.row_update_2.length; i++) {
                        update_col_i = imp.row_update_2[i].index;
                        progress.update_cell = imp.row_update.cell(update_col_i);
                        progress.import_cell = progress.import_row.cell(progress.update_cell.val());
                        progress.cell = progress.row.cell(update_col_i);
                        if (!progress.cell.isVal()) {
                            if (progress.cell.disabled && progress.import_cell.isVal() && progress.update_cell.skip_disabled === undefined
                                && progress.import_cell.skip_disabled === undefined) {
                                div_message
                                    .append($("<div>").addClass("ui-state-highlight ui-corner-all err")
                                        .html("Se esta intentando agregar un valor en un campo desabilitado")
                                        .append(tableordest(progress.cell, progress.import_cell))
                                        .append($("<input>").prop("type", "button").val("Omitir").on("click", progress.func1))
                                        .append($("<input>").prop("type", "button").val("Omitir siempre").on("click", progress.func2)));
                                progress.pause(); return;
                            }
                        } else if (progress.import_cell.isVal()) {
                            if ($.comex.compare(progress.cell.val(), progress.import_cell.val(), true, true) !== 0) {
                                if (progress.update_cell.allow_update === undefined && progress.import_cell.allow_update === undefined) {
                                    div_message
                                        .append($("<div>").addClass("ui-state-highlight ui-corner-all err")
                                            .html("Estas a punto de actualizar un dato existente, ¿deseas actualizarlo?")
                                            .append(tableordest(progress.cell, progress.import_cell))
                                            .append($("<input>").prop("type", "button").val("Permitir").on("click", progress.func3))
                                            .append($("<input>").prop("type", "button").val("Omitir").on("click", progress.func4))
                                            .append($("<input>").prop("type", "button").val("Permitir siempre").on("click", progress.func5))
                                            .append($("<input>").prop("type", "button").val("Omitir siempre").on("click", progress.func6)));
                                    progress.pause(); return;
                                } else if (!progress.update_cell.allow_update && !progress.import_cell.allow_update) {
                                    progress.import_cell.val(progress.cell.val()); continue;
                                }
                            }
                        } else {
                            if (progress.update_cell.allow_delete === undefined && progress.import_cell.allow_delete === undefined) {
                                div_message
                                    .append($("<div>").addClass("ui-state-highlight ui-corner-all err")
                                        .html("Estas a punto de borrar un dato existente, ¿deseas borrarlo?")
                                        .append(tableordest(progress.cell, progress.import_cell))
                                        .append($("<input>").prop("type", "button").val("Permitir").on("click", progress.func7))
                                        .append($("<input>").prop("type", "button").val("Omitir").on("click", progress.func8))
                                        .append($("<input>").prop("type", "button").val("Permir siempre").on("click", progress.func9))
                                        .append($("<input>").prop("type", "button").val("Omitir siempre").on("click", progress.func10)));
                                progress.pause(); return;
                            } else if (!progress.update_cell.allow_delete && !progress.import_cell.allow_delete) {
                                progress.import_cell.val(progress.cell.val()); continue;
                            }
                        }
                        progress.cell.val(progress.import_cell.val());
                    }
                    progress.not_worked.remove(progress.row);
                    progress.worked.push(progress.row);
                }
            });
            progress.play();
        }
        function paso_5() {
            rows.refresh();
            delete form.rows_filter;
            form.update_tbody();
        }
        function tableordest(destino, origen) {
            return $("<table>")
                .append($("<thead>")
                    .append($("<tr>")
                        .append($("<th>").addClass("ui-widget-header").html("Columna"))
                        .append($("<th>").addClass("ui-widget-header").html("Destino"))
                        .append($("<th>").addClass("ui-widget-header").html("Origen"))))
                .append($("<tbody>")
                    .append($("<tr>")
                        .append($("<th>").addClass("ui-widget-header").html(destino.col.title))
                        .append(IDatabase.td(destino, $("<td>"), false))
                        .append(IDatabase.td(origen, $("<td>"), false))));
        }
    });
    if (type === "form") { buttonImport.hide(); }
    if (!rows.table.insert && !rows.table.update) { buttonImport.prop("disabled", true); }
    var noresults = $("<div>").addClass('ui-state-highlight').html("No hay datos que mostrar.").hide();
    var firs_page = $('<button>').prop('type', 'button').prop("disabled", true).addClass('first').html('«').prop("title", "Ir a la primera página")
        .on('click', function () { form._page.val(1); firs_page.trigger("change"); });
    var prev_page = $('<button>').prop('type', 'button').prop("disabled", true).addClass('previous').html('‹').prop("title", "Ir a la página anterior")
        .on('click', function () { form._page.val(form._page.val() - 1); prev_page.trigger("change"); });
    var next_page = $('<button>').prop('type', 'button').prop("disabled", true).addClass('next').html('›').prop("title", "Ir a la página siguiente")
        .on('click', function () { form._page.val(form._page.val() + 1); next_page.trigger("change"); });
    var last_page = $('<button>').prop('type', 'button').prop("disabled", true).addClass('last').html('»').prop("title", "Ir a la última página")
        .on('click', function () { form._page.val(form._page.col.max); last_page.trigger("change"); });
    var regs = $("<span>");
    var tdpage = $("<td>");
    var tdpages = $("<td>");
    form.progressdiv = $("<div>");
    form.addClass("search")
        .append($("<div>").css("height", "35px")
            .append(submit).append(cancel).append(buttonAdd).append(buttonExport).append(buttonImport).append(save))
        .append(form.progressdiv)
        .append($('<div>').addClass("table")
            .append($("<table>").addClass("ui-widget-content")
                .append(thead)
                .append(tbody)))
        .append(noresults)
        .append($("<div>")
            .append($("<table>")
                .append($("<tbody>")
                    .append($("<tr>").on("change", function () { form.update_tbody(); })
                        .append($("<td>").buttonset()
                            .append(firs_page)
                            .append(prev_page))
                        .append(tdpage)
                        .append(tdpages)
                        .append($("<td>").buttonset()
                            .append(next_page)
                            .append(last_page))
                        .append($("<td>")
                            .append(regs))))));
    form.update_tbody();
    return form;
    function save_exit() { form.save(function () { form.exit(caller); }); }
    function cancel_exit() { iscancel = true; if (type !== "form") { rows.action("NOCHANGE"); } form.exit(caller); }
};

Array.prototype.search = function (maxOpts, caller, cols, row_filter) {
    var rows = this, rowRes, containsterms, cell, label, val, row, col_i, term, term_i, closetag, label_i, terms_row, terms, progress;
    if (!row_filter) { row_filter = cols.row_filter; }
    terms_row = row_filter.map(function (cell) {
        if (cell.col) {
            var tmp = cell.val(undefined, "TEXT");
            if (tmp === "" && cell._val) { tmp = cell._val.toString(); }
            if (tmp === "") { return null; }
            return tmp.normalize().split(' ');
        } else if (cell === "") { return null; } else { return cell.normalize().split(' '); }
    });
    progress = IProgress({
        length: rows.length,
        progress: caller,
        continuar: function () { return maxOpts === undefined || progress.results.length < maxOpts; },
        work: function () {
            row = rows[progress.index]; rowRes = [];
            for (col_i = 0, containsterms = true; col_i < cols.length && containsterms; col_i++) {
                if ((terms = terms_row[col_i])) {
					if((cell = row.cell(cols[col_i]))){ label = cell.val(undefined, "TEXT").normalize(); }
					else{ label = ""; }
                    for (term_i = 0; term_i < terms.length && (containsterms = label.contains(term = terms[term_i])) ; term_i++) {
                        label = label.replace(term, "*".repeat(term.length));
                    }
                    rowRes[col_i] = label;
                }
            }
            if (containsterms) {
                progress.results.push(row);
                for (col_i = 0; col_i < cols.length; col_i++) {
                    if ((cell = row.cell(cols[col_i]))) {
                        delete cell.mark;
                        if ((val = rowRes[col_i])) {
                            for (label = cell.val(undefined, "TEXT"), label_i = label.length - 1, closetag = false ; label_i >= 0; label_i--) {
                                if (!closetag && val[label_i] === "*") { closetag = true; label = label.insertAt("</mark>", label_i + 1); }
                                if (closetag && val[label_i - 1] !== "*") { closetag = false; label = label.insertAt("<mark>", label_i); }
                            }
                            cell.mark = label;
                        }
                    }
                }
            }
        }
    });
    progress.results = [];
    progress.play();
};
