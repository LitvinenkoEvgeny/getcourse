jQuery.widget( 'gc.supportChatWidget', $.gc.talksWidget, {
	conversationsData: {},
    supportChatWindowShowed: false,

	options: {
        fullMode: false,
        openedConversationId: false,
        allowGuest : true,
        conversationsData: {}
	},
	_create: function() {

		var self = this;
		this.manager = {};
		this.element.addClass('activated-talks-widget');
		this.hostMenu = $('#gcAccountUserMenu');
		this.assignButton();

		this.subscribeConversations();

		$(document).on('gc:manager:changed', function() {
			self.findManager();
            /*
            if ( ! self.talksWindowShowed ) {
                self.talksWidgetButton.popover('destroy');
                self.talksWidgetButton.popover({
                    placement: "top",
                    content: 'Изменился менеджер',
                    animation: false,
                    trigger: 'hover'
                });

                self.talksWidgetButton.data('bs.popover').options.title = 'Изменился менеджер';
                self.talksWidgetButton.data('bs.popover').options.content = 'Теперь ваш менеджер todo';
                self.talksWidgetButton.popover('show')
            }
            */
            if ( self.captionEl ) {
                setTimeout(function () {
                    self.setConversationTitle();
                }, 1000);
            }

		});

		if ( this.options.openedConversationId ) {
			self.showTalksWindow();
		}
        if ( this.options.conversationsData ) {
			self.setCounter(self.options.conversationsData);
        }
	},
	assignButton: function() {
        var self = this;
        self.talksWidgetButton = this.hostMenu.find('.support-chat-widget-button-wrapper a');
		self.talksWidgetButton.click(function () {
            if ( self.counterEl.parent().hasClass('fa-comments') ) {
                self.counterEl.parent().removeClass('fa-comments');
                self.counterEl.parent().addClass('fa-comment');
            }
            self.talksWidgetButton.popover('hide');
			self.showSupportChatWindow();
		});
		self.counterEl = self.talksWidgetButton.find('.conversations-counter');
		self.getActiveConversationId();
	},
	createSupportChatWindow: function() {
		var self = this;
		if ( this.supportChatWidgetWindow ) {
			return;
		}

		$( window ).resize( function() {
            self.adoptSize();
        });

		$window = $('<div>')
            .addClass('support-chat-window')
            .addClass('talks-widget-window');
        if ( window.accountUserId == -1 ) {
            $window.addClass('gc-user-guest');
        }
		$window.hide();
		$window.appendTo( document.body );
		this.supportChatWidgetWindow = $window;

		$header = $('<div>')
            .addClass('support-chat-header')
            .addClass('talks-widget-header');
		$header.appendTo( $window );
		this.headerEl = $header;

		this.headerEl.click(function() {
			/*
			if( ! $(this).parent().hasClass('minimized') ) {
				$(this).parent().animate({
					height: '44px'
				}, 300, function() {
					$(this).addClass('minimized');
				});
			} else {
				$(this).parent().animate({
					height: '230px'
				}, 300, function() {
					$(this).removeClass('minimized');
				});
			}
			*/
		});

		this.btnClose = $('<span>')
			.addClass('btn-close')
			.addClass('fa');
		this.btnClose.appendTo( this.headerEl );

		this.btnClose.click( function(e) {
            self.closeSupportChatWindow();
			e.stopPropagation();
        });

		//no need, just inherited
		this.backBtn = $('<span class="btn-back fa fa-bars"></span>');
		this.respondentList = $('<div class="respondent-list"></div>');
		this.newConversationBtn = $('<button class="btn btn-new btn-primary"><span class="fa fa-pencil"></span> Новое обращение </button>');

		this.thumbEl = $('<div>')
			.addClass('thumb')
			.addClass('pull-right');

		this.thumbEl.appendTo( this.headerEl );

		this.captionEl = $('<div>')
			.addClass('caption')
			.addClass('pull-right');
		this.captionEl.appendTo( this.headerEl );

		this.bodyBlock = $('<div>')
			.addClass('support-chat-body talks-widget-body');
		this.bodyBlock.appendTo( $window );

		this.conversationsListBlock = $('<div class="conversations-list-block"></div>');
		this.conversationsListBlock.appendTo( this.bodyBlock );

		this.conversationsList = $('<div class="conversations-list"></div>');
		this.conversationsList.appendTo( this.conversationsListBlock );

		this.conversationListFooter = $('<div class="conversation-list-footer"></div>');
        this.conversationListFooter.appendTo( this.conversationsListBlock );

		this.selectedConversationBlock = $('<div class="selected-conversation"></div>');
        this.selectedConversationBlock.appendTo( this.bodyBlock );
        this.selectedConversationBlock.hide();

        this.newConversationBlock = $('<div class="new-conversation"></div>');
        this.newConversationBlock.appendTo( this.bodyBlock );
        this.newConversationBlock.hide();

        this.respondentList = $('<div class="respondent-list"></div>');
        this.respondentList.appendTo( this.newConversationBlock );
		this.respondentList.hide();

		this.supportChatWidgetWindow.draggable({ handle:'.support-chat-header', stop: function(event, ui) {
			$( event.originalEvent.target ).one('click', function(e){ e.stopImmediatePropagation(); } );
		}});

		this.adoptSize();
	},

	showSupportChatWindow: function() {
		if ( ! this.supportChatWidgetWindow ) {
			this.createSupportChatWindow();
		}

		var self = this;

		self.loadRespondents();
		self.showConversationList();

		setTimeout( function() {
			self.supportChatWindowShowed = true;
			self.supportChatWidgetWindow.show();
			self.talksWidgetButton.parent().hide();
			self.adoptSize();
			self.loadConversations();
		}, 300 );

		setTimeout( function() {
			var textarea = self.supportChatWidgetWindow.find('.new-comment-textarea');
			textarea
				.keyup(function(){
					if($(this).val()) {
						$(this).parent().parent().find('.btn-send').show();
					} else {
						$(this).parent().parent().find('.btn-send').hide();
					}
				});
			textarea.focus();
		}, 3000);
	},
    loadConversations: function() {

        var self = this;

		if ( self.options.openedConversationId ) {
			self.openConversationBlock({
				id: self.options.openedConversationId,
                placeholder: 'Ответить',
				windowStyle: 'support',
				managerId: self.manager.id
			});
		}
		if ( ! self.selectedConversationBlock.is(":visible") ) {
			self.selectRespondent(self.defaultRespondent, self.manager.id);
		}
		setTimeout( function() {
			self.setConversationTitle();
		}, 1000 );
    },
	getActiveConversationId: function( completeCallback ) {

		var self = this;

		console.log( 'getting active conversation...' );

		ajaxCall( "/pl/talks/conversation/model-list", {}, {}, function( response ) {

			var lastConversationId = null;
			var lastConversationTime = null;

			for( key in response.data.models ) {
				var model = response.data.models[key];
				if ( ! lastConversationId || lastConversationTime < model.last_comment_at ) {
					lastConversationId = model.id;
					lastConversationTime = model.last_comment_at;
				}
			}

			if ( lastConversationId && lastConversationTime ) {
				var a = lastConversationTime.split(/[^0-9]/);
				if ( a[2] > 2000) {
					var compareDate =new Date (a[2],a[1]-1,a[0],a[3],a[4], a[5] ? a[5] : 0 );
				}
				else {
					var compareDate =new Date (a[0],a[1]-1,a[2],a[3],a[4], a[5] ? a[5] : 0 );
				}

				var now = window.nowTime ? window.nowTime : new Date();
				var format = 'HMS';
				var days = ( now - compareDate ) / ( 60 * 60 * 24 * 1000);
                var hours = ( now - compareDate ) / ( 60 * 60 * 1000);
				if( days <= 21 ) {
					self.options.openedConversationId = lastConversationId;
				}
			}
			self.findManager();
            self.showCounterValue();
		}, completeCallback )

	},
	showConversationList: function() {

		if ( this.currentConversationBlock ) {
			this.currentConversationBlock.remove();
		}

		this.selectedConversationBlock.hide();
		this.conversationsListBlock.show();
		this.newConversationBlock.hide();

		this.backBtn.hide();
		this.newConversationBtn.show();


		this.setTitle( "Задать вопрос менеджеру" );
	},
    closeSupportChatWindow: function() {
		this.supportChatWindowShowed = false;
		var thumb = this.headerEl.find('.thumb');
		if ( thumb.length ) {
			thumb.css('background-image', '');
		}
		this.supportChatWidgetWindow.hide();
		this.talksWidgetButton.popover('hide');
        this.talksWidgetButton.parent().show();
	},
	setConversationTitle: function() {
        console.log('set title: ' + JSON.stringify(this.manager));
		if ( this.manager && ! $.isEmptyObject( this.manager ) ) {
            //if ( this.manager.is_online ) {
                this.setManager();
            //}
		} else {
            this.setTitle( 'Задать вопрос менеджеру' );
            var thumb = this.headerEl.find('.thumb');
            if ( thumb.length ) {
                thumb.css('background-image', '');
            }
		}
	},
	findManager: function() {
		var self = this;
		console.log('find manager: ' + self.options.openedConversationId);
        self.manager = {};
		ajaxCall( '/pl/user/profile/find-personal-manager-online?_=' + new Date().getTime(), {conversationId: self.options.openedConversationId}, {suppressErrors: true}, function( response ) {
			if ( response.success && ( manager = response.data.manager ) ) {
				self.manager = {
					id: manager.id,
					name: manager.name,
					thumb: manager.thumb,
					assigned: false,
					is_online: manager.is_online
				};
			}
			console.log('found manager: ' + JSON.stringify(self.manager));
			if ( self.manager && ! $.isEmptyObject( self.manager ) && self.manager.is_online ) {
				self.talksWidgetButton.find('.support-chat-widget-button-label').html('Персональный менеджер онлайн');
			}
		});
	},
	setManager: function() {
		this.setTitle( this.manager.name );
		var thumb = this.headerEl.find('.thumb');
		if ( thumb.length && this.manager.thumb ) {
			thumb.css('background-image', 'url(' + this.manager.thumb + ')');
		}
	},
	selectRespondent: function( id, manager_id = null ) {
			this.openConversationBlock({
				objectTypeClass: "app\\modules\\talks\\models\\AppealToRespondent",
				objectId: id,
				windowStyle: 'support',
				managerId: manager_id
			});
	},
	adoptSize: function() {
		var headerHeight = this.headerEl.height() + 1;
		var height = this.bodyBlock.parent().height() - headerHeight;
		this.bodyBlock.height( height );
		this.conversationsList.height( (this.conversationsListBlock.height() - this.conversationListFooter.height()  - 20) + "px" );
	},
	showCounterValue: function() {
        var self = this;
		var showNewComments = false;
		var refreshWindow = false;
		var currentConversationId = self.options.openedConversationId;

		console.log(currentConversationId, JSON.stringify(self.conversationsData));

		jQuery.each( self.conversationsData, function(i, val) {
			if ( self.selectedConversationBlock && self.selectedConversationBlock.is(":visible") ) {
				if ( currentConversationId && currentConversationId != i ) {
					// show another conversation
					refreshWindow = true;
					self.options.openedConversationId = i;
					return false;
				}
				if ( ! currentConversationId ) {
					self.options.openedConversationId = i;
					if ( window.accountUserId == -1 ) {
						refreshWindow = true;
					}
				}
			} else {
				if ( ! currentConversationId ) {
					self.options.openedConversationId = i;
					showNewComments = true;
				} else if ( currentConversationId == i ) {
					showNewComments = true;
				}
			}
		});
		//self.conversationsData = {};

		if ( showNewComments ) {
			console.log('new comments available');
			self.counterEl.parent().removeClass('fa-comment');
			self.counterEl.parent().addClass('fa-comments');
            self.conversationsData = {};
		}
		if ( refreshWindow ) {
            self.conversationsData = {};
			self.findManager();
			self.closeSupportChatWindow();
			self.loadConversations();
			self.talksWidgetButton.click();
		}
	}
} );
