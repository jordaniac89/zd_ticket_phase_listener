$(function () {

    let client = ZAFClient.init();
    client.invoke('app.hide');

    let currentTicketPhase;

    client.get(CUSTOM_FIELD_MAPPINGS["ticketPhase"])
        .then(function (data) {

            //hide or disable specified fields
            doListenForPhaseChange(
                data[[CUSTOM_FIELD_MAPPINGS["ticketPhase"]]]);
        });

    function doListenForPhaseChange(ticketPhase) {

        currentTicketPhase = ticketPhase;

        client.on('ticket.save', function () {

            return client.get(CUSTOM_FIELD_MAPPINGS["ticketPhase"])
                .then(function (data) {

                    newTicketPhase = data[CUSTOM_FIELD_MAPPINGS["ticketPhase"]];

                    if (currentTicketPhase !== newTicketPhase) {

                        return client.set(
                            CUSTOM_FIELD_MAPPINGS["ticketPhaseModified"],
                            new Date().getTime()
                        )
                        .then(function (data) {
                            // in the case that we don't do a page refresh
                            // the global variable never changes.
                            currentTicketPhase = newTicketPhase;
                        })
                        .catch(function (error) {
                            console.log(error.toString());
                        });
                    }
                });
        });
    }
});
