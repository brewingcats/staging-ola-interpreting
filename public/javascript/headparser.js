var HeadParser;
(function (HeadParser) {
    class Control {
        static updateHeaders() {
            let headers = $('main').find($(":header"));
            for (let idx = 0; idx < headers.length; idx++) {
                let header = headers[idx];
                if (header.innerHTML !== undefined
                    && header.innerHTML !== null
                    && header.innerHTML !== ''
                    && header.innerHTML !== 'Table of Contents'
                    && header.innerHTML !== 'Tabla de Contenidos') {
                    let id = Control.HashIt(header.innerHTML).replace('==', '').replace('=', '').replace('-', '');
                    id = Control.CompressId(id);
                    if (!header.hasAttribute("id")) {
                        header.setAttribute("id", id);
                        Control.headerIds.push(id);
                    }
                    else {
                        Control.headerIds.push(header.getAttribute('id'));
                    }
                }
            }
        }
        static CreateHeaderList() {
            let list = document.createElement('ul');
            for (let idx = 0; idx < Control.headerIds.length; idx++) {
                let h = $(`#${HeadParser.Control.headerIds[idx]}`);
                let li = document.createElement('li');
                let lnk = document.createElement('a');
                lnk.setAttribute('href', `#${HeadParser.Control.headerIds[idx]}`);
                let digits = Number(h.prop("tagName").toLowerCase().replace('h', '')) - 1;
                let deepCode = '';
                for (let i = 0; i < digits; i++) {
                    deepCode = `${deepCode}⚪`;
                }
                lnk.innerHTML = `<code>${deepCode}</code>${h.text()}`;
                li.appendChild(lnk);
                list.appendChild(li);
            }
            return list;
        }
        static CompressId(val) {
            console.log(val);
            if (val === undefined || val === null || val === '') {
                return new Date().getTime().toString();
            }
            let sLength = 1;
            let testId = val.substring(0, sLength);
            while (Control.headerIds.indexOf(testId) !== -1 || $(`#${testId}`).length > 0) {
                if (sLength < val.length) {
                    sLength++;
                    testId = val.substring(0, sLength);
                }
                else {
                    sLength++;
                    let tim = new Date().getTime().toString().substring(0, sLength - val.length);
                    testId = `${val}${tim}`;
                }
            }
            return testId;
        }
        static HashIt(val) {
            let hash = 0;
            let i;
            let chr;
            for (i = 0; i < val.length; i++) {
                chr = val.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash.toString();
        }
    }
    Control.headerIds = new Array();
    HeadParser.Control = Control;
})(HeadParser || (HeadParser = {}));
if (window.HeadParser === undefined) {
    window.HeadParser = HeadParser;
}
