(function($) {

    /**
     * @namespace GCMenu
     */
    var cookieExpires = 7, // days
        methods = {

        /**
         * Инициализация GCMenu
         *
         * @memberof GCMenu
         * @method init
         *
         * @param {Object} config
         *
         * @returns {Object} jQuery object
         */
        "init": function(config) {
            var $this = $(this),
                data  = $this.data();

            if ( $.isEmptyObject(data) ) {
                $this.data({
                    config: config
                });
            }

            $this.GCMenu('setCookie');

            return $this
                .append(
                    $this.GCMenu('renderMenu')
                );
        },

         /**
         * Создаем меню
         *
         * @memberof GCMenu
         * @method renderMenu
         * @private
         *
         * @returns {Object} jQuery object
         */
        "renderMenu": function() {
            var $this = $(this),
                data  = $this.data();

            var self = this,
                cookie = gcGetCookie("gcMenuState"),
                profileSubmenu = null,
                profileLinks = null;

            var menubar = $('<nav></nav>')
                    .addClass('main-nav'),
                closeButtonOutside = $('<button></button>')
                    .addClass('close-btn-2')
                    .click(function(){
                        $this.GCMenu('toggleMenu', true);
                    }),
                list = $('<ul></ul>')
                    .addClass('nav')
                    .addClass('nav-pills')
                    .addClass('nav-stacked'),
                closeButtonWrapper = $('<li></li>'),
                closeButton = $('<button></button>')
                    .addClass('close-btn')
                    .click(function(){
                        list.toggleClass('open');
                        $('.user-btn').toggleClass('active');
                        fader.toggleClass('active');
                        if ( $(window).width() > 767 ) {
                            $this.GCMenu('closeMenu', true);
                        }
                    }),
                menuArrows = $('<span class="glyphicon glyphicon-menu-down"></span><span class="glyphicon glyphicon-menu-up"></span>'),
                fader = $('<div></div>')
                    .addClass('nav-dark-bg')
                    .click(function(){
                        list.toggleClass('open');
                        userButton.toggleClass('active');
                        fader.toggleClass('active');
                     }),
                userButtonWrapper = $('<li></li>')
                    .addClass('nav-list-item'),
                userButton = $('<button></button>')
                    .addClass('user-btn')
                    .click(function(){
                        list.toggleClass('open');
                        $('.user-btn').toggleClass('active');
                        fader.toggleClass('active');
                    }),
                navlist = $('<ul></ul>')
                     .addClass('main-nav-list');

            closeButtonWrapper
                .append(closeButton)
                .append(closeButtonOutside);
            list.append(closeButtonWrapper);
            userButtonWrapper.append(userButton);
             if ( window.accountUserId != -1 ) {
                 navlist.append(userButtonWrapper);
                 menubar.append(list);
             }

            menubar
                .append(navlist)
                .append(fader);

            for (var i = 0; i < data.config.items.length; i++) {
                var menu = data.config.items[i],
                    item = $('<li></li>')
                        .addClass('dropdown'),
                    link = $('<a></a>')
                        .addClass('toggle-close-link')
                        .attr( 'data-toggle', 'dropdown')
                        .attr( 'href', 'javascript:void(0);' )
                        .html( menu.label )
                        .on('mouseover', function(event) {
                            $(this).css('background-color', '#5f7184');
                        })
                        .on('mouseout', function(event) {
                            if ( $(this).parent().hasClass('active') ) {
                                $(this).css('background-color', '#337ab7');
                            } else {
                                $(this).css('background-color', 'transparent');
                            }
                        }),
                    linkToggleOpen = $('<a></a>')
                        .addClass('toggle-open-link')
                        .addClass('link-' + menu.id)
                        .attr( 'data-toggle', 'dropdown')
                        .on('mouseover', function(event) {
                            $(this).css('background-color', '#5f7184');
                        })
                        .on('mouseout', function(event) {
                            $(this).css('background-color', 'transparent');
                        })
                        .on('click', function(event) {
                            var href = $(this).parent().find('.toggle-close-link').attr('href');
                            if ( href && href != 'javascript:void(0);' ) {
                                location.href = href;
                            } else {
                                $this.GCMenu('toggleMenu', false);
                            }
                        });

                if ( menu.iconUrl ) {
                    linkToggleOpen.css('background', 'url(' + menu.iconUrl + ') no-repeat right 8px center / 12%');
                }

                item.addClass( "menu-item-" + menu.id );

                // Выбранное меню
                if ( data.config.activeItem == menu.id ) {
                    item.addClass( 'active' );
                }

                // Создаем сабменю
                if (menu.subitems) {
                    var submenu = $this.GCMenu('renderSubMenu', menu.subitems, menu.id);
                    if ( submenu ) {
                        item.append(submenu);
                        menuArrows.clone().appendTo(link);
                    } else if ( menu.subitems[0].url ) {
                        link
                            .attr('href', menu.subitems[0].url)
                            .click(function(){
                                location.href = $(this).attr('href');
                            });
                    }
                }

                // свернутое меню
                if ( ! cookie || cookie == 'narrow' ) {
                    link.toggleClass('active');
                    linkToggleOpen.addClass( 'active' );
                }

                item.prepend(linkToggleOpen);
                item.prepend(link);

                if ( menu.id == 'profile' ) {
                    if ( menu.iconUrl ) {
                        userButton.prepend('<img src="' + menu.iconUrl + '">');
                    }
                    if ( menu.params.name ) {
                        userButton.append($this.GCMenu( 'getUserName', menu.params.name ));
                    }
                    if ( submenu.length ) {
                        profileSubmenu = submenu
                            .clone()
                            .addClass('menu-item-profile-mobile');
                        profileLinks = $this.GCMenu( 'getProfileLinks', menu.subitems );
                    }
                } else {
                    list.append(item);
                }
            }

            var mainUserButton = userButton.clone(),
                mainUserLinks = $('<div></div>')
                    .addClass('profile-links'),
                mainUserButtonWrapper = $('<li></li>')
                    .addClass('dropdown');
            userButton
             .on('click', function(event) {
                 $this.GCMenu('toggleMenu', true);
             });
             if ( profileLinks ) {
                 for (i = profileLinks.length; i >= 0; i--) {
                     mainUserLinks
                         .append(profileLinks[i]);
                 }
             }
            mainUserButton.append(menuArrows);
            mainUserButtonWrapper.append(mainUserLinks);
            mainUserButtonWrapper.append(mainUserButton);
            if ( profileSubmenu && profileSubmenu.length ) {
                mainUserButtonWrapper.append(profileSubmenu);
                mainUserButton
                    .on('click', function(event) {
                        mainUserButtonWrapper.toggleClass('open');
                    });
            }
            list.append(mainUserButtonWrapper);
            // чтобы элементы бокового меню не пряталось под нижнее
            list.append('<li class="bottom-margin"></li>');

             // загружаем счетчики
             ajaxCall('/cms/counters/menu', {}, {suppressErrors: true}, function (response) {
                 $this.GCMenu( 'renderNavMenu', response );
             });

             if ( ! cookie || cookie == 'narrow' ) {
                 list.addClass('slideOutLeft animated slided');
                 userButtonWrapper.addClass('slideOutLeft animated');
                 $('.nav-list-item').addClass('slideOutLeft animated slided');
                 $('.leftbar').addClass('wide');
                 $('.content-after-leftbar').addClass('wide');
                 $('.gc-main-content').addClass('wide');
                 if ( $('.resp-screen').length || $('.talks-widget-window').length ) {
                     $(window).trigger('resize');
                 }
             }

             if ( cookie == 'no-menu' ) {
                 list.addClass('no-menu');
                 $('.leftbar').addClass('no-menu');
                 $('.content-after-leftbar').addClass('no-menu');
                 $('.gc-main-content').addClass('no-menu');
                 if ( $('.resp-screen').length || $('.talks-widget-window').length ) {
                     $(window).trigger('resize');
                 }
             }

            return menubar;
        },

        /**
         * Возвращает форматированное имя пользователя
         *
         * @memberof GCMenu
         * @method getUserName
         * @private
         *
         * @param name
         *
         * @returns formatted user name
         */
        "getUserName": function( name ) {
            var res = name.split(" ");
            if ( res.length == 1 ) {
                return '<span class="user-name">' + name + '<span class="last-name"></span></span>';
            }
            return '<span class="user-name">' + res[0] + ' <span class="last-name">' + res.slice(1).join(" ") + '</span></span>';
        },

        /**
         * Скрывает/открывает меню влево и открывает закрытое меню
         *
         * @memberof GCMenu
         * @method toggleMenu
         * @private
         *
         * @param saveState
         */
        "toggleMenu": function ( saveState ) {
            var $this = $(this);

            cookie = gcGetCookie("gcMenuState");

            var nav = $('.nav.nav-pills')
                .removeClass('no-menu')
                .removeClass('slided'),
            navItem = $('.nav-list-item')
                .removeClass('slided'),
            leftbar = $('.leftbar')
                .removeClass('no-menu'),
            contentAfterLeftBar = $('.content-after-leftbar')
                .removeClass('no-menu'),
            mainContent = $('.gc-main-content')
                .removeClass('no-menu');
            $('.user-btn')
                .toggleClass('active');

            if ( cookie == 'no-menu' ) {
                $('.toggle-close-link').removeClass('active');
                $('.toggle-open-link').removeClass('active');
            } else {
                nav.toggleClass('slideOutLeft animated');
                navItem.toggleClass('slideOutLeft animated');
                $('.toggle-close-link').toggleClass('active');
                $('.toggle-open-link').toggleClass('active');
                leftbar.toggleClass('wide');
                contentAfterLeftBar.toggleClass('wide');
                mainContent.toggleClass('wide');
            }

            if ( $('.resp-screen').length || $('.talks-widget-window').length ) {
                $(window).trigger('resize');
            }

            // сохраняем положение меню
            if ( saveState ) {
                $this.GCMenu('setCookie');
            }

            // странный хромовский баг
            $('.main-nav').hide();
            setTimeout( function() {
               $('.main-nav').show();
            }, 5 )

        },

            /**
             * Закрывает меню
             *
             * @memberof GCMenu
             * @method toggleMenu
             * @private
             *
             * @param saveState
             */
            "closeMenu": function ( saveState ) {
                var $this = $(this);

                $('.nav.nav-pills')
                    .removeClass('slided')
                    .removeClass('open')
                    .removeClass('slideOutLeft animated')
                    .addClass('no-menu');
                $('.user-btn')
                    .removeClass('active');
                $('.nav-list-item')
                    .removeClass('slided')
                    .removeClass('slideOutLeft animated');
                $('.leftbar')
                    .removeClass('wide')
                    .addClass('no-menu');
                $('.content-after-leftbar')
                    .removeClass('wide')
                    .addClass('no-menu');
                $('.gc-main-content')
                    .removeClass('wide')
                    .addClass('no-menu');
                if ( $('.resp-screen').length || $('.talks-widget-window').length ) {
                    $(window).trigger('resize');
                }

                // сохраняем положение меню
                if ( saveState ) {
                    $this.GCMenu('setCookie');
                }
            },

        /**
         * Возвращает ссылки профиля для вывода над именем пользователя
         *
         * @memberof GCMenu
         * @method getProfileLinks
         * @private
         *
         * @param items
         */
        "getProfileLinks": function (items) {
            var profileLinks = [];

            if ( items.length ) {
                for (var i = 0; i < items.length; i++) {
                    var profileItem = items[i];
                    if ( $.inArray( profileItem.id,  ['profile', 'logout', 'myAccounts'] ) >= 0 ) {
                        profileLinks.push(
                            $('<a>')
                            .addClass('profile-menu-item-' + profileItem.id)
                            .attr('href', profileItem.url)
                            .html(profileItem.label)
                        );
                    }
                }
            }

            return profileLinks;
        },

        /**
         * Создаем сабменю
         *
         * @memberof GCMenu
         * @method renderSubMenu
         * @private
         *
         * @param {Object} items
         * @param parentId
         *
         * @returns {Object} jQuery object
         */
        "renderSubMenu": function(items, parentId) {
            var $this = $(this);

            // если в меню один элемент, подменю не создаем, переход будет по ссылке основного меню
            if ( items.length == 1 ) {
                return false;
            }

            var submenu = $('<ul></ul>')
                    .addClass('dropdown-menu');
            for (var i = 0; i < items.length; i++) {
                var menu = items[i],
                    item = $('<li></li>'),
                    link = $('<a></a>')
                        .append(menu.label)
                        .on('click', function(event) {
                            event.stopPropagation();
                        });

                item.addClass( "menu-item-" + parentId + "-" + menu.id );

                // Вешаем ссылку
                if (menu.url) {
                    link.attr({
                        target: (menu.target) ? menu.target : '_self',
                        href:   menu.url
                    });
                }

                item.append(link);
                submenu.append(item);
            }

            return submenu;
        },

        /**
         * Устанавливает счетчики и создает нижнее меню
         *
         * @memberof GCMenu
         * @method renderNavMenu
         * @private
         */
        "renderNavMenu": function( data ) {
            var $this = $(this),
                mainMenuData  = $this.data();

            var showToggleButton = false;

            var navlist = $('.main-nav-list'),
                dropup = $('<li>')
                    .addClass('dropup'),
                buttontoggle = $('<button>')
                    .addClass('dropdown-toggle')
                    .attr('data-toggle', 'dropdown')
                    .html('<nobr>Действия <b class="caret"></b></nobr>'),
                dropdown = $('<ul>')
                    .addClass('dropdown-menu'),
                tapelinkWrapper = $('<li>')
                    .addClass('nav-list-item')
                    .addClass('tape-link-wrapper'),
                tapelink = $('<a>')
                    .addClass('tape-link')
                    .attr('href', 'javascript:void(0);'),
                tapeMenu = $('<div>')
                    .hide(),
                cookie = gcGetCookie("gcMenuState"),
                supportChatWidgetButtonWrapper = $('<li>')
                    .addClass('support-chat-widget-button-wrapper');

            if (
                window.isSupportChatEnabled &&
                ! window.userInfo.isAdmin &&
                ! window.userInfo.isManager &&
                ! window.userInfo.isTeacher
            ) {
                var supportChatWidgetButton = $('<a>')
                    .attr('href', 'javascript:void(0);'),
                    supportChatWidgetButtonLabel = $('<span>')
                        .addClass('support-chat-widget-button-label')
                        .html('Задать вопрос менеджеру'),
                    supportChatWidgetButtonIcon = $('<i>')
                        .addClass('support-chat-widget-button-icon')
                        .addClass('fa fa-comment'),
                    supportChatWidgetButtonCounter = $('<span>')
                        .addClass('conversations-counter');

                supportChatWidgetButtonIcon
                    .append(supportChatWidgetButtonCounter);
                supportChatWidgetButton
                    .append(supportChatWidgetButtonLabel)
                    .append(supportChatWidgetButtonIcon);
                supportChatWidgetButtonWrapper
                    .append(supportChatWidgetButton);
            }

            if ( window.accountUserId != -1 ) {
                tapelinkWrapper
                    .append(tapelink)
                    .append(tapeMenu);
            } else {
                navlist.addClass('gc-user-guest');
            }

            if ( ! cookie || cookie == 'narrow' ) {
                tapelinkWrapper.addClass('slideOutLeft animated');
            }

            navlist
                .append(tapelinkWrapper);

             if ( mainMenuData.config.navMenuItems ) {
                 var references = mainMenuData.config.navMenuItems.subitems;
                 if ( references.length ) {
                     for (var i = 0; i < references.length; i++) {
                         var navitems = $this.GCMenu( 'addNavListItems', references[i]['id'], references[i]['label'], references[i]['url'] );

                         navlist.append(navitems[0]);
                         dropdown.append(navitems[1]);
                     }
                 } else {
                     navitems = $this.GCMenu( 'addNavListItems', '0', '', '' );
                     navlist.append(navitems[0]);
                 }
             } else {
                 navitems = $this.GCMenu( 'addNavListItems', '0', '', '' );
                 navlist.append(navitems[0]);
             }

            jQuery.each( data.counters, function(i, val) {
                var value = "";
                if ( Object.prototype.toString.call( val ) === '[object Array]' && val[0] > 0 ) {
                    value = val[0];
                } else {
                    value = val;
                }

                // счетчик уведомлений
                if ( i == 'notifications_button_small' ) {
                    if ( value > 0 ) {
                        tapelink
                            .html(value)
                            .on('click', function(event) {
                                if ( ! tapeMenu.is(':visible') ) {
                                    tapeMenu.show();
                                    $this.GCMenu('renderNotificationSubMenuSpinner', tapeMenu);
                                } else {
                                    tapeMenu.hide();
                                }
                            });
                    } else {
                        tapelink.addClass('tape-link-empty');
                    }
                    return true;
                }
                if ( i == 'conversationsData' ) {
                    $this.conversationsData = {};
                    if ( ! jQuery.isEmptyObject( value ) ) {
                        $this.conversationsData = value;
                    }
                }
                if ( value > 0 ) {
                    // добавляем кол-во в основное меню
                    elm = $('.menu-item-' + i).find('a').first();

                    if ( elm.length ) {
                        var notify = $('<span></span>')
                            .addClass('info')
                            .addClass( 'info-' + i )
                            .html(value);

                        elm.append(notify);
                    }

                    // в нижнее меню выводим только элементы у которых есть наименование
                    if ( ! data.labels[i] ) {
                        return true;
                    }

                    showToggleButton = true;

                    var navitems = $this.GCMenu( 'addNavListItems', i, data.labels[i], data.urls[i] );

                    navlist.append(navitems[0]);
                    dropdown.append(navitems[1]);
                }
            });

            if ( showToggleButton ) {
                dropup
                    .append(buttontoggle)
                    .append(dropdown);
                navlist
                    .append(dropup);
            }

            navlist
                .append(supportChatWidgetButtonWrapper);

            if ( window.isSupportChatEnabled ) {
                $.gc.supportChatWidget({"conversationsData": $this.conversationsData});
            } else {
                 var $el = $('.talks-widget.activated-talks-widget');
                 if ( $el.length > 0  ) {
                    $el.talksWidget( 'setCounter', $this.conversationsData )
                 }
            }
        },

        /**
         * Добавляет пункт в нижнее меню
         *
         * @memberof GCMenu
         * @method addNavListItems
         * @private
         *
         * @param id
         * @param label
         * @param url
         *
         * @returns array
         */
        "addNavListItems" : function( id, label, url ) {
            var $this = $(this);

            var navitem = $('<li></li>')
                    .addClass('nav-list-item')
                    .addClass('item-' + id),
                navlink = $('<a></a>')
                    .addClass('nav-item-link')
                    .addClass('link-' + id)
                    .attr('href', url || 'javascript:void(0);')
                    .html( label ),
                dropdownitem = $('<li></li>'),
                dropdownlink = $('<a></a>')
                    .addClass('dropdown-link')
                    .addClass('link-' + id)
                    .attr('href', url || 'javascript:void(0);')
                    .html( label ),
                cookie = gcGetCookie("gcMenuState");

            if ( id == 'stat' ){
                dropdownlink.attr('target', '_blank');
                navlink.attr('target', '_blank');
            }

            if ( id == 'tasks-assigned' || id == 'tasks-unassigned' ) {
                var tasksMenu = $('<div></div>')
                    .addClass( 'gc-tasks-block' )
                    .hide();
                navlink.on('click', function(event) {
                    event.preventDefault();
                    var className = '.item-'+ id + ' .gc-tasks-block';
                    var el = $(className);
                    if ( ! el.is(':visible') ) {
                        el.show();
                        $this.GCMenu('renderTasksSubMenuSpinner', el, className);
                    } else {
                        el.hide();
                    }
                });
                navitem.append(tasksMenu);
            }

            if ( label ) {
                navitem.append(navlink);
            }
            dropdownitem.append(dropdownlink);

            if ( ! cookie || cookie == 'narrow' ) {
                navitem.addClass('slideOutLeft animated');
            }

            return [navitem, dropdownitem];
        },

        /**
         * Выводит спиннер загрузки и загружает список задач с менеджерами
         *
         * @memberof GCMenu
         * @method renderTasksSubMenuSpinner
         * @private
         *
         * @param tasksMenu
         * @param className
         */
        "renderTasksSubMenuSpinner" : function(tasksMenu, className) {
            var $this = $(this);

            var loader = $('<div></div>')
                    .addClass('loader'),
                spinner = $('<i></i>')
                    .addClass('fa')
                    .addClass('fa-spinner')
                    .addClass('fa-spin');

            loader.append(spinner);
            tasksMenu
                .empty()
                .append(loader)
                .show();

            // загружаем список
            $.ajax({
                url: "/pl/tasks/task/get-data?full=1",
                dataType: 'json',
            })
                .done(function( data ) {
                    var keys = [];
                    if ( className ==  '.item-tasks-assigned .gc-tasks-block' ) {
                        keys = ['Активные задачи мендежеров'];
                    }
                    if ( className ==  '.item-tasks-unassigned .gc-tasks-block' ) {
                        keys = ['Задачи без менеджеров', 'Новые задачи'];
                    }
                    var block = $this.GCMenu( 'renderTasksSubMenu', tasksMenu, data, keys);
                    $(className).empty().append(block).show();
                });
        },

        /**
         * Заполняет меню задач с менеджерами
         *
         * @memberof GCMenu
         * @method renderTasksSubMenu
         * @private
         *
         * @param tasksMenu
         * @param data
         * @param keys
         */
        "renderTasksSubMenu" : function(tasksMenu, data, keys) {
            var $this = $(this);

            var groups = data.data.groups,
                block = $('<div></div>')
                    .addClass('tasks-block'),
                defaultContent = $('<div></div>')
                    .addClass('task-block')
                    .html('Список пуст');

            if ( groups.length > 0 ) {
                jQuery.each( groups, function(i, group) {
                    if ( $.inArray( group.groupLabel,  keys ) < 0 ) {
                        return true;
                    }
                    if ( group.tasks.length ) {
                        for (var j = 0; j < group.tasks.length; j++) {
                            block
                                .append($this.GCMenu('renderTasksMenuItem', tasksMenu, group.tasks[j]));
                        }
                        if (group.tasksCount > 5) {
                            var linkToAllBlock = $('<a></a>')
                                .addClass('all-tasks-link-block')
                                .attr('href', '/pl/tasks/task/my')
                                .html('Все задачи');
                            block
                                .append(linkToAllBlock);
                        }
                    }
                });
                if ( block.html() == '' ) {
                    block
                        .append(defaultContent);
                }
            } else {
                block
                    .append(defaultContent);
            }
            return block;
        },

        /**
         * Возвращает элемент задач
         * @memberof GCMenu
         * @method renderTasksMenuItem
         * @private
         *
         * @param tasksMenu
         * @param task
         * @returns {Object} jQuery object
         */
        "renderTasksMenuItem": function(tasksMenu, task) {
            var $this = $(this);

            if (task.normal_time_expired === null) {
                task.normalTimeStatus = "";
                task.normalTimeText = "";
                task.normalTime = "";
            } else if (task.normal_time_expired < 0) {
                task.normalTime = "normal-time";
                task.normalTimeStatus = "expired";
                task.normalTimeText = "Просрочена " + task.normal_time_expired_at;
            } else {
                task.normalTime = "normal-time";
                task.normalTimeStatus = "not-expired";
                task.normalTimeText = "Завершить " + task.normal_time_expired_at;
            }

            var item = $('<a></a>')
                    .addClass('task-block')
                    .addClass(task.normalTime)
                    .addClass(task.normalTimeStatus)
                    .attr('href', task.url),
                imageWrapper = $('<div></div>')
                    .addClass('image'),
                image = $('<img>')
                    .attr('src', task.image_url),
                statusWrapper = $('<div></div>')
                    .addClass('status-wrapper'),
                status = $('<div></div>')
                    .addClass('label')
                    .addClass('label-' + task.status_class)
                    .html(task.status_label),
                text = $('<div></div>')
                    .addClass('task-text-data'),
                object = $('<div></div>')
                    .addClass('object-name')
                    .addClass('small')
                    .addClass('text-muted')
                    .html(task.object_name),
                title = $('<div></div>')
                    .addClass('title')
                    .html(task.title),
                manager = $('<div></div>')
                    .addClass('manager-name')
                    .html('менеджер: ' + task.manager_user_name),
                expired = $('<div></div>')
                    .addClass('expired-time')
                    .html(task.normalTimeText);

            statusWrapper.append(status);
            imageWrapper.append(image);
            text
                .append(object)
                .append(title)
                .append(manager)
                .append(expired);

            item
                .append(imageWrapper)
                .append(statusWrapper)
                .append(text);

            return item;
        },

        /**
         * Устанавливает куки текущего состояния меню
         *
         * @memberof GCMenu
         * @method setCookie
         * @private
         */
        "setCookie" :  function(){
            if ( window.accountUserId == -1 ) {
                return false;
            }
            var state = 'wide',
            cookie = gcGetCookie("gcMenuState");

            if (
                $('.nav.nav-pills').hasClass('slideOutLeft') ||
                $('.gc-main-content').hasClass('wide') ||
                $('.content-after-leftbar').hasClass('wide')
            ) {
                state = 'narrow';
            }
            if (
                $('.nav.nav-pills').hasClass('no-menu') ||
                $('.gc-main-content').hasClass('no-menu') ||
                $('.content-after-leftbar').hasClass('no-menu')
            ) {
                state = 'no-menu';
            }
            gcSetCookie("gcMenuState", state, {expires: cookieExpires * 24 * 60 * 60, path: '/'})
        },

        /**
         * Выводит спиннер загрузки и загружает список уведомлений
         *
         * @memberof GCMenu
         * @method renderNotificationSubMenuSpinner
         * @private
         *
         * @param tapeMenu
         */
        "renderNotificationSubMenuSpinner" : function(tapeMenu) {
            var $this = $(this);

            var loader = $('<div></div>')
                    .addClass('loader'),
                spinner = $('<i></i>')
                    .addClass('fa')
                    .addClass('fa-spinner')
                    .addClass('fa-spin');

            loader.append(spinner);
            tapeMenu
                .empty()
                .addClass( 'gc-account-user-tape-link' )
                .append(loader);

            // загружаем список
            $.ajax({
                url: "/notifications/notifications/get",
                dataType: 'json',
            })
            .done(function( data ) {
                $this.GCMenu( 'renderNotificationSubMenu', tapeMenu, data );
            });
        },

        /**
         * Заполняет меню нотификаций
         *
         * @memberof GCMenu
         * @method renderNotificationSubMenu
         * @private
         *
         * @param tapeMenu
         * @param data
         */
        "renderNotificationSubMenu" : function(tapeMenu, data) {
            var $this = $(this);

            var notificationsLabel = 'Уведомления';
            var allNotificationsLabel = 'Все уведомления';
            var markAsReadLabel = 'Отметить прочитанными';
            var noNotificationMessagesLabel = 'No notification messages';

            if (typeof Yii != 'undefined') {
                notificationsLabel = Yii.t( "common", "Notifications" );
                allNotificationsLabel = Yii.t( "common", "All notifications" );
                markAsReadLabel = Yii.t( "common", "Mark as read" );
                noNotificationMessagesLabel = Yii.t( "common", "Mark as read" );
            }

            var count = data.data.count,
                groups = data.data.groups,
                parent = $('<div></div>'),
                header = $('<div></div>')
                    .addClass('header'),
                wrapper = $('<div></div>')
                    .addClass('all-notifications-header-link-wrapper'),
                notificationsLink = $('<a></a>')
                    .addClass('all-notifications-header-link')
                    .attr('href', '/notifications/notifications/all')
                    .html(notificationsLabel + ( count.new > 0 ? ' (' + count.new + ')' : '')),
                notificationsFooter = $('<div></div>')
                    .addClass('notifications-footer'),
                notificationFooterMessage = count.all > 10 ? ( $('<a></a>')
                    .addClass('all-notifications-footer-link')
                    .attr('href', '/notifications/notifications/all')
                    .html(allNotificationsLabel)
            ) : ( $('<span></span>') ),
                clear = $('<div></div>')
                    .addClass('clear'),
                markViewed = $('<div></div>')
                    .addClass('mark-viewed-all')
                    .html(markAsReadLabel);

            markViewed.on('click', function (e) {
                e.stopPropagation();
                // проставляем уведомления просмотренным
                ajaxCall('/notifications/notifications/viewedAll', {}, {suppressErrors: true}, function (response) {
                    $this.GCMenu( 'renderNotificationSubMenuSpinner', tapeMenu, response );
                });
                return false;
            });

            var defaultContent = $('<div></div>')
                    .addClass('no-notifications-message')
                    .html(noNotificationMessagesLabel),
                messages = $('<div></div>');

            if ( groups.length > 0 ) {
                jQuery.each( groups, function(i, group) {
                    messages
                        .append($this.GCMenu('renderNotificationMenuItem', tapeMenu, group));
                });
            } else {
                messages
                    .append(defaultContent);
            }

            tapeMenu
                .empty()
                .append(parent);
            parent.append(header);
            header.append(wrapper);
            header.append(markViewed);
            header.append(clear);
            wrapper.append(notificationsLink);
            parent.append(messages);
            notificationsFooter.append(notificationFooterMessage);
            parent.append(notificationsFooter);
        },

        /**
         * Возвращает элемент нотификации
         * @memberof GCMenu
         * @method renderNotificationMenuItem
         * @private
         *
         * @param tapeMenu
         * @param group
         * @returns {Object} jQuery object
         */
        "renderNotificationMenuItem": function(tapeMenu, group) {
            var $this = $(this);

            var helper = group.helper ? group.helper : {},
                item = $('<a></a>')
                    .addClass('notification-group')
                    .addClass('notification-click-area')
                    .addClass('notification-status-' + group.status)
                    .attr('href', helper.click_url),
                image = $('<span></span>')
                    .addClass('user-image')
                    .append(helper.first_user_thumbnail),
                content = $('<div></div>')
                    .addClass('content')
                    .html(helper.content),
                date = $('<div></div>')
                    .addClass('date')
                    .html(helper.display_date),
                clear = $('<div></div>')
                    .addClass('clear'),
                markViewedButton = $('<div></div>')
                    .addClass('mark-viewed'),
                markViewedButtonIcon = $('<i></i>')
                    .addClass('fa')
                    .addClass('fa-times');

            markViewedButton.append(markViewedButtonIcon);
            markViewedButton.on('click', function (e) {
                e.stopPropagation();
                markViewedButtonIcon
                    .removeClass('fa-times')
                    .addClass('fa-spinner')
                    .addClass('fa-spin');
                // проставляем уведомление просмотренным
                ajaxCall('/notifications/notifications/viewed', {
                    id: group.id
                }, {suppressErrors: true}, function (response) {
                    $this.GCMenu( 'renderNotificationSubMenuSpinner', tapeMenu );
                });
                return false;
            });

            item.append(image);
            item.append(content);
            item.append(date);
            item.append(clear);
            item.append(markViewedButton);

            return item;
        }
    };

    $.fn.GCMenu = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Метод ' +  method + ' не существует');
        }
    };
})(jQuery);