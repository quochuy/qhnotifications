{literal}
<script type="text/javascript">
var notifications = new QHNotifications();
notifications.setMessage( {notification_id: 'welcome', text: 'QH Notifications Demo (sticky)', type: 'sticky'} );
notifications.display();

$(function() {
    $( '#qhn_add' ).click( function() {
        var type = '';
        if( $( '#qhn_type' ).is( ':checked' ) ) type = 'sticky';

        notifications.setMessage( {notification_id: $( '#qhn_id' ).val(), text: $( '#qhn_message').val(), type: type} ); 
        notifications.display();

        $( '#qhn_id' ).val( '' );
        $( '#qhn_message').val( '' );
        $( '#qhn_type' ).attr( 'checked', false );
    });
});

</script>
{/literal}
<h1>QH Notifications Demo</h1>
<p>Choose an ID, type a message, make it sticky or not and click on the button.</p>
<p>If a notification with the same ID already exist, the existing notification's message will be updated. Sticky notifications cannot be removed.</p>
<form id="qhnotifications_demo_form">
Notification ID: <input id="qhn_id" /> Notification message: <input id="qhn_message" size="40" /> <input type="checkbox" id="qhn_type" value="sticky" /> sticky <input type="button" id="qhn_add" value="Add notification" /><br/>
</form>
