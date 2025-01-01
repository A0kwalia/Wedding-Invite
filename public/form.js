//add event listener to form
document.getElementById('attendance').addEventListener('submit', async(event) => {
    event.preventDefault(); //prevent default form submission

    //retrieve form data
    const first_name_guest = document.getElementById('first_name_guest').value;
    const last_name_guest = document.getElementById('last_name_guest').value;
    const rsvp_status = document.querySelector('input[name="RSVP"]:checked').value;
    const first_name_extra = document.getElementById('first_name_extra').value;
    const last_name_extra = document.getElementById('last_name_extra').value;

    //create data object
    const data = {first_name_guest, last_name_guest, rsvp_status, first_name_extra, last_name_extra};

    //sending data to the server
    try {
        const response = await fetch('/submit-RSVP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)     
        });

        //handling server response
        const result = await response.json();
        if (result.status === "success") {
            alert('RSVP Submitted Successfully');
            document.getElementById('attendance').reset(); 
        } else {
            alert ('Error Submitting RSVP. Try Again!')
        }
        //error handling
    } catch (error) {
        console.error("Error:", error);
        alert("Error while submitting RSVP. Please check your connection.");
    }
})