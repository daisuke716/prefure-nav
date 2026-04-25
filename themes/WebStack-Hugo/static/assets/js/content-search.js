//关键词sug
var hotList = 0;
$(function() {
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
        if (keywords == '') { hideSuggestions(); return };
        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search?client=chrome&q=' + encodeURIComponent(keywords),
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(res) {
                $word.empty();
                var suggestions = res[1];
                hotList = suggestions.length;
                if (hotList) {
                    for (var i = 0; i < hotList; i++) {
                        // $word.append("<li><span>" + (i + 1) + "</span>" + suggestions[i] + "</li>");
                        $word.append("<li>" + suggestions[i] + "</li>");
                        // if (i === 0) {
                        //     $word.find("li:last span").css({"color": "#fff", "background": "#f54545"});
                        // } else if (i === 1) {
                        //     $word.find("li:last span").css({"color": "#fff", "background": "#ff8547"});
                        // } else if (i === 2) {
                        //     $word.find("li:last span").css({"color": "#fff", "background": "#ffac38"});
                        // }
                    }
                    showSuggestions();
                } else {
                    hideSuggestions();
                }
            },
            error: function() {
                hideSuggestions();
            }
        })
    })

    $(document).on('click', '#word li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $('#search-text').val(word);
        hideSuggestions();
        $('.submit').trigger('click');
    })

    $(document).on('click', '.io-grey-mode', function() {
        hideSuggestions();
    })
})
