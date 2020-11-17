


const getPayment = async (btn) => {

    const stripe = Stripe('pk_test_51Hh99eDz1aNYsFgS3D8JJHDarzwlFQSrRRXMupCFOwNKqbeIfFQKsAy4hXVbUAthrR4PMAk48D8kquq3vd3daidJ00s1u5gWc9');
    const csrf = btn.parentNode.querySelector('[name="_csrf"]').value
    const total_amount = btn.parentNode.querySelector('[name="totalamount"]').value
    fetch('/shop/create-order', {
        method: 'POST',
        headers: {
            'csrf-token': csrf
        },
        body: {
            totalamount: total_amount
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (session) {
            return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, you should display the localized error message to your
            // customer using `error.message`.
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}

