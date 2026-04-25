//关键词sug
var hotList = 0;
var suggestionEngine = null; // 'baidu' | 'google'

function initSuggestionEngine() {
    var cached = localStorage.getItem('sg_country');
    var cachedTime = parseInt(localStorage.getItem('sg_country_time') || '0');
    // 缓存24小时
    if (cached && (Date.now() - cachedTime) < 86400000) {
        suggestionEngine = (cached === 'CN') ? 'baidu' : 'google';
        return;
    }
    $.getJSON('https://ipapi.co/json/', function(data) {
        var country = data.country_code || 'XX';
        localStorage.setItem('sg_country', country);
        localStorage.setItem('sg_country_time', Date.now().toString());
        suggestionEngine = (country === 'CN') ? 'baidu' : 'google';
    }).fail(function() {
        suggestionEngine = 'google';
    });
}

function fetchSuggestions(keywords, onSuccess) {
    var engine = suggestionEngine || 'google';
    if (engine === 'baidu') {
        $.ajax({
            url: 'https://suggestion.baidu.com/su?wd=' + encodeURIComponent(keywords),
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function(res) { onSuccess(res.s || []); },
            error: function() { onSuccess([]); }
        });
    } else {
        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search?client=chrome&q=' + encodeURIComponent(keywords),
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(res) { onSuccess(res[1] || []); },
            error: function() { onSuccess([]); }
        });
    }
}

$(function() {
    initSuggestionEngine();

    var $word = $('#word');
    var $container = $word.closest('.search-smart-tips');

    function showSuggestions() {
        $container.stop(true, true).show();
        $word.show();
    }
    function hideSuggestions() {
        $word.empty().hide();
        $container.hide();
    }

    $('#search-text').keyup(function() {
        var keywords = $(this).val();
        if (keywords == '') { hideSuggestions(); return; }
        fetchSuggestions(keywords, function(suggestions) {
            $word.empty();
            hotList = suggestions.length;
            if (hotList) {
                for (var i = 0; i < hotList; i++) {
                    // $word.append("<li><span>" + (i + 1) + "</span>" + suggestions[i] + "</li>");
                    $word.append("<li>" + suggestions[i] + "</li>");
                }
                showSuggestions();
            } else {
                hideSuggestions();
            }
        });
    });

    $(document).on('click', '#word li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $('#search-text').val(word);
        hideSuggestions();
        $('.submit').trigger('click');
    });

    $(document).on('click', '.io-grey-mode', function() {
        hideSuggestions();
    });
})
