const $ = new DisplayJS(window);

$.on(".copyright", "click", () => {
    window.location = "https://kiwidocs.js.org"
})


// lib
let dataPaths = []
fetch("config.json")
    .then(data => data.json())
    .then(data => {
        data = data[0]
        if (data.type == "wiki" || data.type == "github") {
            const urlparser = document.createElement('a')
            urlparser.href = window.location
            getPage(data.url + "/" + urlparser.hash.split("#")[1])
            side(data.logo, data.copyright)
        } else {
            $.html(".sidebar", "<ul></ul>")
            if (data.hasOwnProperty("paths")) {
                dataPaths = data.paths
                const urlparser = document.createElement('a')
                urlparser.href = window.location
                getPage(Object.values(data.paths)[parseInt(urlparser.hash.split("#")[1]) < 0 || isNaN(parseInt(urlparser.hash.split("#")[1])) ? 0 : parseInt(urlparser.hash.split("#")[1])])
                listener()
                side(data.logo, data.copyright)
            }
        }
        if (data.hasOwnProperty("analytics")) {
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', data.analytics, 'auto');
            ga('send', 'pageview');
        }
    })

function side(url, copy) {
    $.single(".sidebar").innerHTML = `
	<center>
		<img src="${url}" alt="Logo" class="img">
	</center>
	` + $.single(".sidebar").innerHTML;
    $.single(".sidebar").innerHTML += `
	<center>
		<div class="copyright-side">© Copyright ${copy} ${new Date().getFullYear()}</div>
	</center>
	`
}

function getPage(url) {
    $.html(".title", 'Loading...')
    $.html(".sidebar", '<ul><li>Loading...</li></ul>')
    $.html(".content", '<div align="center">Loading...</div>')
    if (/github.com/.test(url)) {
        fetch(url, {
                mode: 'cors'
            })
            .then(data => data.text())
            .then(data => {
                const parser = new DOMParser();
                const dataEl = parser.parseFromString(data, "text/html");
                const els = dataEl.querySelectorAll(".markdown-body")
                $.html(".title", dataEl.querySelector(".gh-header-title").innerHTML)
                $.html(".sidebar", els[0].innerHTML)
                $.html(".content", els[1].innerHTML)
                listener()
                side(data.logo, data.copyright)
            })
    } else {
        fetch("config.json")
            .then(data => data.json())
            .then(data => {
                data = data[0]
                if (data.type == "wiki" || data.type == "github") {
                    const urlparser = document.createElement('a')
                    urlparser.href = window.location
                    getPage(data.url + "/" + urlparser.hash.split("#")[1])
                    side(data.logo, data.copyright)
                    listener()
                } else {
                    $.html(".sidebar", "<ul></ul>")
                    if (data.hasOwnProperty("paths")) {
                        for (let i in data.paths) {
                            $.single(".sidebar>ul").innerHTML += `<li><a href="${data.paths[i]}">${i}</a></li>`
                        }
                        $.html(".title", Object.keys(data.paths)[Object.values(data.paths).indexOf(url)])
                        render(url)
                        side(data.logo, data.copyright)
                        listener()
                    }
                }
            })
    }
}

function listener() {
    $.all(".sidebar ul>li>a", el => {
        $.on(el, "click", e => {
            e.preventDefault()
            if (dataPaths == []) {
                window.location = `#${e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href.split("/").slice(-1)[0] : e.target.href.split("/").slice(-1)[0]}`
            } else {
                const hashtag = Object.values(dataPaths).indexOf(e.target.pathname.slice(1))
                window.location = `#${hashtag}`
                getPage(Object.values(dataPaths)[hashtag])
            }
            listener()
        })
    })
}

function render(path) {
    const converter = new showdown.Converter();
    fetch(path).then(data => data.text()).then(data => {
        const renderedhtml = converter.makeHtml(data)
        $.html(".content", renderedhtml)
    })
}
