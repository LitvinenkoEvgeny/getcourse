$(function() {
    var INACTIVE_TEXT = window.language == "en" ? "Like" : 'Нравится';
    var ACTIVE_TEXT = window.language == "en" ? "Cancel like" : 'Не нравится';
    var channel = window.accountUserWebSocketConnection ? 'likes'+window.accountUserWebSocketConnection.pageKey : undefined;
    
    $('body').delegate('.b-like .button', 'click', function(){
        var $el = $(this);
        if ($el.hasClass('auth-link')) {
            var active = window.gcModalActive();
            active && active.hide();
            window.gcGetDefaultModalAuth().show();

            return false;
        }
        var inProgress = $el.data('in-progress') === true;
        if (inProgress) {
            return false;
        }
        else {
            $el.data('in-progress', true);
        }
        var isReset = $el.hasClass('like');
        var isPositive = $el.hasClass('positive');
        var data = {
            object_id: $el.data('object-id')
            , object_type_id: $el.data('object-type-id')
            , is_reset: isReset ? 1 : 0
            , is_positive: isPositive ? 1 : 0
        };
        if (channel) {
            data.channel = channel;
        }
        var $parent = $el.parent();
        var count = $parent.find('.positive-count .value').html();
        count = count ? parseInt(count) : 0;
        applyCount($parent, '.positive-count', isReset ? (count ? count - 1 : 0) : count + 1 );
        var likes = {
            values: {}
        };
        likes.values[window.accountUserId] = !isReset;
        applyText($el, likes);
        ajaxCall('/cms/like/like', data, {}, function() {
            var positiveCount = response.likes.positive_count;
            applyCount($parent, '.positive-count', positiveCount);
            var negativeCount = response.likes.negative_count;
            //applyCount($parent, '.negative-count', negativeCount); // todo
            applyText($el, response.likes);
        }, function() {
            $el.data('in-progress', false);
        });
    });
    
    var applyCount = function ($parent, classSelector, count) {
        if (count > 0) {
            $parent.find(classSelector).removeClass('hide').find('.value').html(count);
        }
        else {
            $parent.find(classSelector).addClass('hide').find('.value').html(count);
        }
    };

    var applyText = function ($el, likes) {
        var text;
        if (likes.values[window.accountUserId] === true) {
            text = ACTIVE_TEXT;
            $el.addClass('like');
        }
        else {
            text = INACTIVE_TEXT;
            $el.removeClass('like');
        }
        $el.find('.html').html(text);
    };
    

    if (channel) {
        window.accountUserWebSocketConnection.subscribeChannel(channel, function(message, json){
            var $el = $('.'+json.class);
            if (!($el.length > 0)) {
                return;
            }
            var $parent = $el.parent();

            applyCount($parent, '.positive-count', json.likes.positive_count);
            applyCount($parent, '.negative-count', json.likes.negative_count);

            applyText($el.find('.positive'), json.likes);
        });
    }
    
});