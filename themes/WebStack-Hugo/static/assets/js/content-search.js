//关键词sug
var hotList = 0;
$(function() {
    $('#search-text').keyup(function() {
        var keywords = $(this).val();
        if (keywords == '') { $('#word').hide(); return };
        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search?client=chrome&q=' + encodeURIComponent(keywords),
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(res) {
                $('#word').empty().show();
                var suggestions = res[1];
                hotList = suggestions.length;
                if (hotList) {
                    $("#word").css("display", "block");
                    for (var i = 0; i < hotList; i++) {
                        $("#word").append("<li><span>" + (i + 1) + "</span>" + suggestions[i] + "</li>");
                        if (i === 0) {
                            $("#word ul span").eq(i).css({"color": "#fff", "background": "#f54545"});
                        } else if (i === 1) {
                            $("#word ul span").eq(i).css({"color": "#fff", "background": "#ff8547"});
                        } else if (i === 2) {
                            $("#word ul span").eq(i).css({"color": "#fff", "background": "#ffac38"});
                        }
                    }
                } else {
                    $("#word").css("display", "none");
                }
            },
            error: function() {
                $('#word').empty();
                $('#word').hide();
            }
        })
    })

    $(document).on('click', '#word li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $('#search-text').val(word);
        $('#word').empty();
        $('#word').hide();
        $('.submit').trigger('click');
    })

    $(document).on('click', '.io-grey-mode', function() {
        $('#word').empty();
        $('#word').hide();
    })
})
