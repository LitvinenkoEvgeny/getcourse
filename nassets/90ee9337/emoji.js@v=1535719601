setEmojiCarret = function(node)
{
	window.setTimeout(function() {
		var sel, range;
		if (window.getSelection && document.createRange) {
			range = document.createRange();
			range.selectNodeContents(node);
			range.collapse(false);
			sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}, 0);
}

var scriptEls = document.getElementsByTagName( 'script' );
var thisScriptEl = scriptEls[scriptEls.length - 1];
var scriptPath = thisScriptEl.src;
var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );

$.emojiarea.path = scriptFolder + 'packs/basic';
$.emojiarea.icons = {
	':smile:': 'smile.png',
	':angry:': 'angry.png',
	':flushed:': 'flushed.png',
	':blush:': 'blush.png',
	':laughing:': 'laughing.png',
	':smiley:': 'smiley.png',
	':smirk:': 'smirk.png',
	':heart_eyes:': 'heart_eyes.png',
	':kissing_heart:': 'kissing_heart.png',
	':kissing_closed_eyes:': 'kissing_closed_eyes.png',
	':bowtie:': 'bowtie.png',
	':relieved:': 'relieved.png',
	':satisfied:': 'satisfied.png',
	':grin:': 'grin.png',
	':wink:': 'wink.png',
	':relaxed:': 'relaxed.png',
	':stuck_out_tongue_winking_eye:': 'stuck_out_tongue_winking_eye.png',
	':stuck_out_tongue_closed_eyes:': 'stuck_out_tongue_closed_eyes.png',
	':grinning:': 'grinning.png',
	':kissing:': 'kissing.png',
	':kissing_smiling_eyes:': 'kissing_smiling_eyes.png',
	':stuck_out_tongue:': 'stuck_out_tongue.png',
	':sleeping:': 'sleeping.png',
	':worried:': 'worried.png',
	':frowning:': 'frowning.png',
	':anguished:': 'anguished.png',
	':open_mouth:': 'open_mouth.png',
	':grimacing:': 'grimacing.png',
	':confused:': 'confused.png',
	':hushed:': 'hushed.png',
	':expressionless:': 'expressionless.png',
	':unamused:': 'unamused.png',
	':sweat_smile:': 'sweat_smile.png',
	':sweat:': 'sweat.png',
	':disappointed_relieved:': 'disappointed_relieved.png',
	':weary:': 'weary.png',
	':pensive:': 'pensive.png',
	':disappointed:': 'disappointed.png',
	':confounded:': 'confounded.png',
	':fearful:': 'fearful.png',
	':cold_sweat:': 'cold_sweat.png',
	':persevere:': 'persevere.png',
	':cry:': 'cry.png',
	':sob:': 'sob.png',
	':joy:': 'joy.png',
	':astonished:': 'astonished.png',
	':scream:': 'scream.png',
	':neckbeard:': 'neckbeard.png',
	':tired_face:': 'tired_face.png',
	':rage:': 'rage.png',
	':triumph:': 'triumph.png',
	':sleepy:': 'sleepy.png',
	':yum:': 'yum.png',
	':mask:': 'mask.png',
	':sunglasses:': 'sunglasses.png',
	':dizzy_face:': 'dizzy_face.png',
	':imp:': 'imp.png',
	':smiling_imp:': 'smiling_imp.png',
	':neutral_face:': 'neutral_face.png',
	':no_mouth:': 'no_mouth.png',
	':innocent:': 'innocent.png',
	':alien:': 'alien.png',
	':yellow_heart:': 'yellow_heart.png',
	':blue_heart:': 'blue_heart.png',
	':purple_heart:': 'purple_heart.png',
	':heart:': 'heart.png',
	':green_heart:': 'green_heart.png',
	':broken_heart:': 'broken_heart.png',
	':heartbeat:': 'heartbeat.png',
	':heartpulse:': 'heartpulse.png',
	':two_hearts:': 'two_hearts.png',
	':revolving_hearts:': 'revolving_hearts.png',
	':cupid:': 'cupid.png',
	':sparkling_heart:': 'sparkling_heart.png',
	':sparkles:': 'sparkles.png',
	':star:': 'star.png',
	':boom:': 'boom.png',
	':exclamation:': 'exclamation.png',
	':question:': 'question.png',
	':zzz:': 'zzz.png',
	':sweat_drops:': 'sweat_drops.png',
	':musical_note:': 'musical_note.png',
	':fire:': 'fire.png',
	':thumbsup:': 'thumbsup.png',
	':thumbsdown:': 'thumbsdown.png',
	':ok_hand:': 'ok_hand.png',
	':punch:': 'punch.png',
	':v:': 'v.png',
	':wave:': 'wave.png',
	':hand:': 'hand.png',
	':point_up:': 'point_up.png',
	':point_down:': 'point_down.png',
	':point_left:': 'point_left.png',
	':point_right:': 'point_right.png',
	':clap:': 'clap.png',
	':muscle:': 'muscle.png',
	':metal:': 'metal.png',
	':running:': 'running.png',
	':girl:': 'girl.png',
	':boy:': 'boy.png',
	':woman:': 'woman.png',
	':man:': 'man.png',
	':baby:': 'baby.png',
	':smiley_cat:': 'smiley_cat.png',
	':scream_cat:': 'scream_cat.png',
	':see_no_evil:': 'see_no_evil.png',
	':hear_no_evil:': 'hear_no_evil.png',
	':speak_no_evil:': 'speak_no_evil.png',
	':kiss:': 'kiss.png',
	':eyes:': 'eyes.png',
	':love_letter:': 'love_letter.png',
	':speech_balloon:': 'speech_balloon.png',
	':thought_balloon:': 'thought_balloon.png',
	':trollface:': 'trollface.png',
	':sunny:': 'sunny.png',
	':cloud:': 'cloud.png',
	':snowflake:': 'snowflake.png',
	':zap:': 'zap.png',
	':cat:': 'cat.png',
	':dog:': 'dog.png',
	':rabbit:': 'rabbit.png',
	':monkey_face:': 'monkey_face.png',
	':bouquet:': 'bouquet.png',
	':tulip:': 'tulip.png',
	':four_leaf_clover:': 'four_leaf_clover.png',
	':cactus:': 'cactus.png',
	':rose:': 'rose.png',
	':sunflower:': 'sunflower.png',
	':globe_with_meridians:': 'globe_with_meridians.png',
	':crescent_moon:': 'crescent_moon.png',
	':earth_asia:': 'earth_asia.png',
	':gift_heart:': 'gift_heart.png',
	':bell:': 'bell.png',
	':christmas_tree:': 'christmas_tree.png',
	':gift:': 'gift.png',
	':balloon:': 'balloon.png',
	':computer:': 'computer.png',
	':tv:': 'tv.png',
	':telephone_receiver:': 'telephone_receiver.png',
	':speaker:': 'speaker.png',
	':hourglass:': 'hourglass.png',
	':key:': 'key.png',
	':mag:': 'mag.png',
	':birthday:': 'birthday.png',
	':house:': 'house.png',
	':rocket:': 'rocket.png',
	':airplane:': 'airplane.png',
	':car:': 'car.png',
	':ru:': 'ru.png',
	':de:': 'de.png',
	':cn:': 'cn.png',
	':us:': 'us.png',
	':fr:': 'fr.png',
	':it:': 'it.png',
	':es:': 'es.png',
	':jp:': 'jp.png',
	':gb:': 'gb.png'
};

//$('.emoji-button').on('click', function() {
//    if ($(this).siblings('.emoji-wysiwyg-editor').length == 0) {
//        $(this).siblings('textarea.emoji-area').emojiarea({
//            button: '.emoji-button',
//            //buttonPosition: 'before'
//        });
//    }
//});

//$('.emoji-text').emoji();

//$('.emoji-textarea').emojiButton();

//eachAndRunOneTimeOnElement(
//	$('.emoji-text'),
//	'emoji-text-handler',
//	function($el) {
//		$el.emoji();
//	}
//);
//eachAndRunOneTimeOnElement(
//	$('.emoji-textarea'),
//	'emoji-btn-handler',
//	function($el) {
//		$el.emojiButton();
//	}
//);

(function () {
	// весь хелпер вынужденная, мера, потому что был глобальный bing emoji по селекторам и пытаюсь как то это исправить
	var EmojiHelper = {};
	EmojiHelper.initEmojies = function($el) {
		window.eachAndRunOneTimeOnElement(
			$el.find('.emoji-text'),
			'emoji-text-handler',
			function ($el) {
				$el.emoji();
				return $el;
			}
		);
	};
	EmojiHelper.initEmojiTextAreas = function ($el) {
		window.eachAndRunOneTimeOnElement(
			$el.find('.emoji-textarea'),
			'emoji-textarea-handler',
			function ($el) {
				$el.emojiButton();
				// todo треш, зависит от предыдущего вызова неявно, плюс несовсем понятно, как оно раньше работало
				$el.parents('.emoji-container').find('.emoji-button').click(function(e){
					var $this = $(this);
					//var $parent = $($this.parents('.new-comment').get(0));
					var $textarea = $this.siblings('textarea.emoji-textarea');
					if (!$el.data('sibling')) {
						$el.data('sibling', 1);
						$textarea.emojiarea({
							button: '.emoji-button'
						});
						setEmojiCarret($textarea.siblings('.emoji-wysiwyg-editor').get(0));
					}
				});
				return $el;
			}
		);
	};
	window.GcEmojiHelper = EmojiHelper;
})();