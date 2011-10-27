function QHNotifications( class_parms ) {
    /* Classes attributes */
    this.configs = { notification_height: 15, max_notification_items: 3 };
    this.notification_array = new Array();

    /* Constructor */
    this.init = function( class_parms ) {
        this.injectContainer();    
    }

    /* Injects the DIV container HTML code into the page */
    this.injectContainer = function() {
        // Injects the container only if not already injected
        if( $( '#notification-container' ).length == 0 ) {
            $( 'body' ).prepend( '<div id="notification-container"></div>' );        
        }
    }

    /* Inserts a new message in the queue */
    this.setMessage = function( parms ) {
        var foundID = false;
        // To avoid inserting the same message twice, search and replace message if already in the queue
        for( var i=0; i<this.notification_array.length; i++ ) {
            if( this.notification_array[i].notification_id == parms.notification_id ) {
                foundID = true;
                this.notification_array[i].text = parms.text;
            }
        }

        if( !foundID )
            this.notification_array.unshift( parms ); 
    }

    /* Inserts and displays notification items */
    this.display = function() {
        var page_offset = 0;
        // Displays all notification items
        var displayedItems = 0;
        for( var i=0; i<this.notification_array.length; i++ ) {
            var notification_item = this.notification_array[i];

            // If a notification item is not already on screen, insert it
            if( $( '#'+ notification_item.notification_id ).length == 0 ) {
                displayedItems++;
                $( '#notification-container' ).prepend( '<div class="notification-item" id="'+ notification_item.notification_id +'">' +
                                                        '   <span class="notification_text">'+ notification_item.text +'</span>' +
                                                        '</div>'
                );

                if( typeof notification_item.type == 'undefined' || notification_item.type != 'sticky' ) {
                    $( '#'+ notification_item.notification_id ).append( '<div class="notification_close_button"><span>[X]</span></div>' );
                    $( '#'+ notification_item.notification_id ).bind( 'click', {notification_id: notification_item.notification_id}, this.removeNotification );
                }

                $( '#'+ notification_item.notification_id ).css( 'height', this.configs.notification_height ); 

                page_offset = page_offset + parseInt( $( '#'+ notification_item.notification_id ).outerHeight() );
            } else {
                // Else update it
                $( '#'+ notification_item.notification_id +' .notification_text' ).html(notification_item.text);
                page_offset = page_offset + parseInt( $( '#'+ notification_item.notification_id ).outerHeight() );
            }

        }

        $( '#page' ).css( 'margin-top', page_offset );
    }

    /* Removes any non sticky notifications */
    this.removeNotification = function( parm ) {
        // calculates the new top margin for the page content
        this.page_offset = parseInt( $( '#page' ).css( 'margin-top' ) ) - parseInt( $( '#'+ parm.data.notification_id ).outerHeight() );

        // Removing animation
        $( '#'+ parm.data.notification_id ).animate( {'height': 0}, 500, 'swing', function() {
            $( '#'+ parm.data.notification_id ).remove();
        });

        // Page content re-adjustment animation
        $( '#page' ).animate( {'margin-top': this.page_offset}, 500 );
    }

    /* Using Ajax to load eZ INI config file */
    this.getConfigByAjaxCall = function() {

    }

    this.init( class_parms );
}
