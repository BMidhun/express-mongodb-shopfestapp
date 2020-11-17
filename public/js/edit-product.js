
const deleteProduct = async (btn) => {

    try {
        const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
        const pid = btn.parentNode.querySelector('[name="productid"]').value;

        const result = await fetch("/product/delete-product/" + pid, {
            headers: {
                'csrf-token': csrf

            },
            method: 'DELETE'
        });

        const data = await result.json();

        btn.closest('article').remove(); // Removes the nearest parent element

        btn.closest
    } catch (error) {
        console.log(error)
    }

}