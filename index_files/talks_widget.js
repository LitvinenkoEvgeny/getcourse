jQuery.widget( 'gc.talksWidget', {
	conversationsData: {},
	talksWindowShowed: false,

	options: {
		fullMode: false,
		openedConversationId: false,
		allowGuest : false
	},
	_create: function() {

		var self = this;
		this.defaultRespondent = null;
		this.element.addClass('activated-talks-widget');

		this.talksWidgetButton = this.createButton();

		this.talksWidgetButton.click( function() {
			self.talksWidgetButton.popover('hide');
			self.showTalksWindow();
		})

		//self.showNewConversationBlock();

		//this.adoptSize();

		this.subscribeConversations();

		if ( ! this.options.openedConversationId ) {
			var openedConversationId = window.gcGetCookie( "savedConversationId" );
			if ( openedConversationId > 0 ) {
				this.options.openedConversationId = openedConversationId;
			}
			if ( cid = getParamFromLocation("openedConversationId") ) {
				this.options.openedConversationId = cid;
			}
		}

		if ( this.options.openedConversationId ) {
			self.showTalksWindow();
		}

		if (this.options.allowGuest) {
			self.loadCounter();
		}
	},
	createButton: function() {
		$btn = $('<div class="talks-widget-button"><span class="fa comments-icon fa-comments"></span></div>')
		$btn.appendTo( document.body )

		$counter = $('<div class="conversations-counter"></div>')
		$counter.appendTo( $btn )
		$counter.hide();

		this.counterEl = $counter;

		return $btn;
	},
	createTalksWindow: function() {
		var self = this;
		if ( this.talksWindow ) {
			return;
		}

		$( window ).resize( function() {
            self.adoptSize();
        })



		$window = $('<div class="talks-widget-window"></div>')
		$window.hide();
		$window.appendTo( document.body )
		this.talksWindow = $window;

		if ( this.isFullMode() ) {
            this.talksWindow.addClass('full-screen-mode')
        }
		this.toggleMainMenuAdopt();

		$header = $('<div class="talks-widget-header"></div>')
		$header.appendTo( $window )
		this.headerEl = $header

		this.btnClose = $('<span class="btn-close fa fa-times"></span>');
		this.btnClose.appendTo( this.headerEl )

		this.backBtn = $backBtn = $('<span class="btn-back fa fa-bars"></span>')
		$backBtn.appendTo( this.headerEl )
		this.backBtn.hide();

		this.backBtn.click( function() {
			self.showConversationList();
			window.gcSetCookie( "savedConversationId", 0, {path : '/'} );
		})

		this.btnClose.click( function() {
            self.closeTalksWindow();
			window.gcSetCookie( "savedConversationId", 0, {path : '/'} );
        })

		this.captionEl = $('<div class="caption"></div>' )
		this.captionEl.appendTo ( this.headerEl )


		this.bodyBlock = $('<div class="talks-widget-body"></div>')
		this.bodyBlock.appendTo( $window )

		this.conversationsListBlock = $('<div class="conversations-list-block"></div>')
		this.conversationsListBlock.appendTo( this.bodyBlock )

		this.conversationsList = $('<div class="conversations-list"></div>')
		this.conversationsList.appendTo( this.conversationsListBlock )

		this.conversationListFooter = $('<div class="conversation-list-footer"></div>')
        this.conversationListFooter.appendTo( this.conversationsListBlock )

        this.newConversationBtn = $('<button class="btn btn-new btn-primary"><span class="fa fa-pencil"></span> ' + ( window.language == 'en' ? 'New conversation' : 'Новое обращение' ) + ' </button>')

        if ( this.options.fullMode ) {
            this.newConversationBtn.appendTo( this.headerEl )
        }
        else {
            this.newConversationBtn.appendTo( this.conversationListFooter )
        }


        this.newConversationBtn.click( function() {
            self.showNewConversationBlock();
        })



		this.selectedConversationBlock = $('<div class="selected-conversation"></div>')
        this.selectedConversationBlock.appendTo( this.bodyBlock )
        this.selectedConversationBlock.hide();

        this.newConversationBlock = $('<div class="new-conversation"></div>')
        this.newConversationBlock.appendTo( this.bodyBlock )
        this.newConversationBlock.hide();

        this.respondentList = $('<div class="respondent-list"></div>')
        this.respondentList.appendTo( this.newConversationBlock )


		this.talksWindow = $window;
		this.adoptSize();
	},

	showTalksWindow: function() {
		if ( ! this.talksWindow ) {
			this.createTalksWindow();
		}

		var self = this;

		setTimeout( function() {
			self.talksWindowShowed = true;
			self.talksWindow.show();
            self.loadConversations();

            self.loadRespondents();

            self.showConversationList();

            self.adoptSize();
		}, 10 );

	},

	closeTalksWindow: function() {
		this.talksWindowShowed = false;
		this.talksWindow.hide();
	},

	setTitle: function( title, titleLink ) {
		if ( titleLink ) {
			title = "<a href='" + titleLink  + "'>" + title +"</a>"
		}
		this.captionEl.html( title );
	},

	loadCounter: function() {
		var self = this;
		ajaxCall("/cms/counters/conversationData", {}, {}, function (response) {
			self.setCounter(response.counters.conversationsData);
		});
	},

	loadConversations: function() {

		var self = this;

		if ( ! self.conversationsList ) {
            return;
        }



		var linkMoveToTopFunction = function( $block ) {
            $block.on('comment:added', function() {
                $block.prependTo( self.conversationsList )
            })
        }

		ajaxCall( "/pl/talks/conversation/model-list", {}, {}, function( response ) {
			self.conversationsList.empty();

			for( key in response.data.models ) {
				var model = response.data.models[key]

				var $convBlock = $(
					'<div class="conversation-annotate">' +
						'<div class="conversation-img-block"><div class="conversation-img"></div></div>' +
						'<div class="conversation-data-block">' +
							'<div class="conversation-title-block">' +
								'<span class="conversation-title"></span>' +
								'<div class="conversation-time"></div>' +
								'<div class="conversation-fresh-comment-count"></div>' +
								'<div class="conversation-text"></div>' +
//								'<div class="conversation-object-title"></div>' +
							'</div>' +
						'</div>' +
					'</div>'
				);
				$convBlock.addClass('conversation-' + model.id )

                $convBlock.appendTo(self.conversationsList);
				$convBlock.data( 'conv-id', model.id )
				$convBlock.data( 'conv-title', model.title )
				$convBlock.data( 'conv-title-link', model.title_link )

				$convBlock.click( function() {
					$('.conversation-annotate.active').removeClass( 'active' )
					$(this).addClass('active')
					self.openConversation( $(this).data( 'conv-id' ), $(this).data( 'conv-title' ), $(this).data( 'conv-title-link' ) )
				})

				$convBlock.conversationAnnotate({conversation: model });

				linkMoveToTopFunction( $convBlock )
			}

			if ( self.options.openedConversationId ) {
				self.conversationsList.find( ".conversation-" + self.options.openedConversationId ).click();
				self.options.openedConversationId = null;
			}

			//self.conversationsBlock.html( "" );

		} )

	},

	loadRespondents: function() {

        var self = this;

        ajaxCall( "/pl/talks/respondent/model-list", {}, {}, function( response ) {
            self.respondentList.empty();

            for( key in response.data.models ) {
                var model = response.data.models[key]

				if ( ! self.defaultRespondent ) {
					self.defaultRespondent = model.id;
				}

                var $block = $( '<div class="respondent-annotate"></div>' )

				if ( model.icon_url ) {
					var $imgBlock = $('<div class="respondent-img-block"></div>')
					$imgBlock.html('<img src="' + model.icon_url + '">')
					$imgBlock.appendTo($block)
				}

                var $dataBlock = $( '<div class="respondent-data-block"></div>')
				$dataBlock.appendTo( $block )

                var $titleBlock = $( '<div class="respondent-title-block"></div>')
                $titleBlock.appendTo( $dataBlock )

                var $titleEl = $( '<span class="respondent-title"></span>' )
                $titleEl.html( model.label )
                $titleEl.appendTo( $titleBlock )

                var $timeEl = $( '<div class="respondent-time"></div>')
                $timeEl.html( model.time_str )
                $timeEl.appendTo( $titleBlock )

                var $textBlock = $( '<div class="respondent-text-block"></div>')
                $textBlock.html( model.text )
                $textBlock.appendTo( $dataBlock )

                $block.appendTo(self.respondentList);
                $block.data( 'respondent-id', model.id );

                $block.click( function() {
                    self.selectRespondent( $(this).data( 'respondent-id' ) )
                })

            }

            //self.conversationsBlock.html( "" );

        } )

    },

	showNewConversationBlock: function() {

        if ( ! this.isFullMode() ) {
            this.conversationsListBlock.hide();
		}
		this.selectedConversationBlock.hide();
		this.newConversationBlock.show();

        this.setTitle( window.language == 'en' ? 'New conversation' : 'Новый разговор' );

        if ( this.respondentList.find( '.respondent-annotate' ).length == 1 ) {
            this.respondentList.find( '.respondent-annotate' ).click();
        }

        this.backBtn.show();
        if ( ! this.isFullMode() ) {
            this.newConversationBtn.hide();
        }
    },

    openConversationBlock: function( conversationParams, title, titleLink ) {
	    if ( this.currentConversationBlock ) {
            this.currentConversationBlock.remove();
        }

        this.currentConversationBlock = $('<div></div>')
    	this.currentConversationBlock.css('height', '100%');
    	this.currentConversationBlock.appendTo( this.selectedConversationBlock );

    	if ( title ) {
    		this.setTitle( title, titleLink )
    	}


        this.currentConversationBlock.conversationWidget({ conversationParams: conversationParams });


        this.selectedConversationBlock.show();

        if ( ! this.isFullMode() ) {
            this.conversationsListBlock.hide();
        }
        this.newConversationBlock.hide();

        this.backBtn.show();
        if ( ! this.isFullMode() ) {
            this.newConversationBtn.hide();
        }
    },

	openConversation: function( id, title, titleLink ) {
    	window.gcSetCookie( "savedConversationId", id, {path : '/'} );
		this.openConversationBlock({id: id}, title, titleLink)

	},

	selectRespondent: function( id ) {
		this.setTitle( window.language == 'en' ? 'New conversation' : 'Новый разговор' );
        this.openConversationBlock({objectTypeClass: "app\\modules\\talks\\models\\AppealToRespondent", objectId: id})
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


	    this.setTitle( window.language == 'en' ? 'Communication' : 'Общение' )
	},

	toggleMainMenuAdopt: function() {
		if ( $('#gcAccountUserMenu .nav.nav-pills').length ) {
			this.talksWindow.addClass('gc-menu');
			this.talksWindow.removeClass('wide');
			this.talksWindow.removeClass('no-menu');
		}
		if ( $('.gc-main-content').hasClass('no-menu') ) {
			this.talksWindow.removeClass('wide');
			this.talksWindow.addClass('no-menu');
		} else
		if ( $('.gc-main-content').hasClass('wide') ) {
			this.talksWindow.removeClass('no-menu');
			this.talksWindow.addClass('wide');
		}
	},

	adoptSize: function() {

		var headerHeight = this.headerEl.height() + 12;

		var height = this.bodyBlock.parent().height() - headerHeight - $('.main-nav-list').height();
		this.bodyBlock.height( height );

		if ( this.isFullMode() ) {
			//this.talksWindow.css( "left", "70px" );
			this.toggleMainMenuAdopt();
			this.talksWindow.css( "width", ($(document.body).width() - this.talksWindow.position().left ) + "px" );
		}

		this.conversationsList.height( (this.conversationsListBlock.height() - this.conversationListFooter.height()  - 20) + "px" );

		//this.conversationsBlock.height( 100 )
	},
	subscribeConversations: function() {
        var self = this;

        if ( window.accountUserWebSocketConnection ) {
            var channel = "conversations_user_" + window.accountUserId;
            window.accountUserWebSocketConnection.subscribeChannel( channel,
              function(message, json){
                if ( json.action == "member_added" ) {
                    setTimeout( function() {
                        self.loadConversations();
                    }, 100 )
                }
                if ( json.action == "reset_viewed" ) {
                    delete self.conversationsData[json.conversation_id];
                    self.showCounterValue();
                }
                if ( json.action == "new_comment" ) {
                    self.talksWidgetButton.popover('destroy');
                    self.talksWidgetButton.popover({
                        placement: "top",
                        content: json.comment.text,
                        animation: false,
                        trigger: 'hover'
                    });

                    self.talksWidgetButton.data('bs.popover').options.title = json.comment.user_name;
                    self.talksWidgetButton.data('bs.popover').options.content = json.comment.text;

                    self.conversationsData[json.conversation_id] = 1;
                    self.showCounterValue();

                    if ( ! self.talksWindowShowed ) {
                        self.talksWidgetButton.popover('show')
                    }
                }
                if ( json.action == "manager_changed" ) {
					$(document).trigger('gc:manager:changed');
				}
              }
           );
        }
    },
    setCounter: function( conversationsData ) {
    	this.conversationsData = conversationsData;
        this.showCounterValue()

    },
    showCounterValue: function() {
        var i = 0;
        for( var key in this.conversationsData ) {
            i++;
        }

        var counter = i;

       this.counterEl.html( counter )
        if ( counter > 0 ) {
            this.counterEl.show();
        }
        else {
            this.counterEl.hide();
        }
    },
	isFullMode() {
    	if ( this.options.fullMode && $(window).width() > 800 ) {
    		return true;
	    }
	    return false;
	}

} );

