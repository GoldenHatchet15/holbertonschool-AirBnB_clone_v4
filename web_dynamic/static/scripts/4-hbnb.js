$(document).ready(function() {
    const selectedAmenities = {};

    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if (this.checked) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.filters h4').text(`Amenities: ${amenitiesList}`);
    });

    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    function fetchPlaces(amenities = {}) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ amenities: Object.keys(amenities) }),
            success: function(data) {
                $('section.places').empty();
                for (let place of data) {
                    const article = $('<article></article>');
                    const titleBox = $('<div class="title_box"></div>');
                    const title = $('<h2></h2>').text(place.name);
                    const price = $('<div class="price_by_night"></div>').text(`$${place.price_by_night}`);
                    titleBox.append(title);
                    titleBox.append(price);
                    article.append(titleBox);

                    const information = $('<div class="information"></div>');
                    const maxGuest = $('<div class="max_guest"></div>').text(`${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}`);
                    const numberRooms = $('<div class="number_rooms"></div>').text(`${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}`);
                    const numberBathrooms = $('<div class="number_bathrooms"></div>').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}`);
                    information.append(maxGuest);
                    information.append(numberRooms);
                    information.append(numberBathrooms);
                    article.append(information);

                    const description = $('<div class="description"></div>').html(place.description);
                    article.append(description);

                    $('section.places').append(article);
                }
            }
        });
    }

    // Initial fetch without filters
    fetchPlaces();

    $('button').click(function() {
        fetchPlaces(selectedAmenities);
    });
});
