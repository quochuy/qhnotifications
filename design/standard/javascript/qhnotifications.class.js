// jQuery doesn't see the attributes and methods of QHNotifications class from a callback
// So we put them here
var QHNotificationsFunctions = {
    // Displays or hide the expand button
    toggleExpandButton: function() {
        if( this.numberOfNotifications() > 2 ) {
            $( '#notification-container-expand' ).css( 'display', 'block' );
        } else {
            $( '#notification-container-expand' ).css( {'display': 'none', 'margin-top': 0} );
            this.setExpandAction( 'Expand' );
        }
    },

    // Retreives the number of notifications
    numberOfNotifications: function() {
        return $( '.notification-item' ).length;
    },

    // Retreive the current action if the expand button is clicked
    getExpandAction: function() {
        return $( '#expand-action' ).html();
    },

    // Set the current action if the expand button is clicked
    setExpandAction: function( action ) {
        $( '#expand-action' ).html( action );
    }

}

// Main notification class
function QHNotifications( class_parms ) {
    // Classes attributes
    this.notification_array = new Array();

    // Constructor
    this.init = function( class_parms ) {
        this.injectContainer();    
    }

    // Injects the DIV container HTML code into the page
    this.injectContainer = function() {
        // Injects the container only if not already injected
        if( $( '#notification-container' ).length == 0 ) {
            $( 'body' ).prepend( '<div id="notification-container"></div><div id="notification-container-expand"><div id="notification-container-expand-button"><span id="expand-action">Expand</span></div></div>' );
            
            // Binds the click event to the expand button
            $( '#notification-container-expand-button' ).bind( 'click', this.expandCollapse );
        }
    }

    // Inserts a new message in the queue
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

    // Inserts and displays notification items
    this.display = function() {
        var page_offset = 0;
        var expand_action = QHNotificationsFunctions.getExpandAction();

        // Displays all notification items
        for( var i=0; i<this.notification_array.length; i++ ) {
            var notification_item = this.notification_array[i];

            // If a notification item is not already on screen, insert it
            if( $( '#'+ notification_item.notification_id ).length == 0 ) {
                $( '#notification-container' ).prepend( '<div class="notification-item" id="'+ notification_item.notification_id +'">' +
                                                        '   <span class="notification_text">'+ notification_item.text +'</span>' +
                                                        '   <div class="notification_close_button" id="notification-close-'+ notification_item.notification_id +'"><span>[X]</span></div>' +
                                                        '</div>'
                );

                // When a notification is not 'sticky' display a removal button
                if( typeof notification_item.type == 'undefined' || notification_item.type != 'sticky' ) {
                    $( '#notification-close-'+ notification_item.notification_id ).bind( 'click', {notification_id: notification_item.notification_id}, this.removeNotification );
                } else {
                    $( '#notification-close-'+ notification_item.notification_id +' span' ).css( 'display', 'none' );
                }

                // Updates the page's main content top margin value
                page_offset = parseInt( $( '#page' ).css( 'margin-top' ) ) + parseInt( $( '#'+ notification_item.notification_id ).outerHeight() );

                QHNotificationsFunctions.setExpandAction( 'Expand' );

            // Else update it
            } else {
                $( '#'+ notification_item.notification_id +' .notification_text' ).html( notification_item.text );
                page_offset = parseInt( $( '#page' ).css( 'margin-top' ) );
            }

            // Delete the notification item from memory
            this.notification_array.splice( i, 1 );

            if( QHNotificationsFunctions.numberOfNotifications() > 2 ) {
                // If the current expand action is 'Expand' then set the notification container height two the height of two items  
                if( expand_action == 'Expand' ) {
                    $( '#notification-container' ).css( 'height', parseInt( 2 * $( '#'+ notification_item.notification_id ).outerHeight() ) );
                }
                page_offset = 2 * parseInt( $( '.notification-item:first' ).outerHeight() );
            }

            QHNotificationsFunctions.toggleExpandButton();

        }

        $( '#page' ).css( 'margin-top', page_offset );
    }

    // Call back function for the expand button
    this.expandCollapse = function() {
        var action = QHNotificationsFunctions.getExpandAction();

        var number_of_items = QHNotificationsFunctions.numberOfNotifications();
        var item_height = $( '.notification-item:last' ).outerHeight();

        if( action == 'Expand' ) {
            var container_height = number_of_items * item_height;
            var expand_top = (number_of_items - 2 ) * item_height;
            QHNotificationsFunctions.setExpandAction( 'Collapse' );
        } else {
            var container_height = 2 * item_height;
            var expand_top = 0;
            QHNotificationsFunctions.setExpandAction('Expand' );
        }

        // Animate the expand/collapse action
        $( '#notification-container' ).animate({'height': container_height}, 500);
        $( '#notification-container-expand' ).animate({'margin-top': expand_top}, 500);
    }

    // Removes any non sticky notifications
    this.removeNotification = function( parm ) {
        // calculates the new top margin for the page content
        page_offset = parseInt( $( '#page' ).css( 'margin-top' ) ) - parseInt( $( '#'+ parm.data.notification_id ).outerHeight() );

        // Removing animation
        $( '#'+ parm.data.notification_id ).animate( {'height': 0}, 500, 'swing', function() {
            $( '#'+ parm.data.notification_id ).remove();
            QHNotificationsFunctions.toggleExpandButton();
        });

        // Page content re-adjustment animation
        $( '#page' ).animate( {'margin-top': page_offset}, 500 );
    }

    this.init( class_parms );
}
