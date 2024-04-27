$(document).ready(function () {
    let imageSize = $('#sizeSelect').val();
    let style = $('#styleSelect').val();
    let quality = $('#qualitySelect').val();
    let apiKey = '';

    $('#btn').click(function () {
        if ($('#apiKey').val().trim() === '') {
            $('#apiKey').addClass('is-invalid')
            $('#apiKeyForm').addClass('is-invalid')
            return;
        }
        else {
            $('#apiKey').removeClass('is-invalid')
            $('#apiKeyForm').removeClass('is-invalid')
        }

        if ($('#prompt').val().trim() === '') {
            $('#prompt').addClass('is-invalid')
            $('#promptForm').addClass('is-invalid')
            return;
        }
        else {
            $('#prompt').removeClass('is-invalid')
            $('#promptForm').removeClass('is-invalid')
        }

        $('#btn').prop('disabled', true);
        $('#btn').html('<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span> Generating...');

        $.ajax({
            url: "https://api.openai.com/v1/images/generations",
            type: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + $('#apiKey').val().trim()
            },
            data: JSON.stringify({
                model: "dall-e-3",
                prompt: $('#prompt').val(),
                n: 1,
                size: imageSize,
                style: style,
                quality: quality,
            }),
            success: function (data) {
                $('#btn').prop('disabled', false);
                $('#btn').html('Generate');

                data.data.forEach(item => {
                    const img = $('<img>', {
                        src: item.url,
                        alt: "image",
                        class: "img-fluid col-md-4 mb-3"
                    });

                    $('#image').append(img);
                });
            },
            error: function (xhr, status, error) {
                const err = JSON.parse(xhr.responseText);
                $('#btn').prop('disabled', false);
                $('#btn').html('Generate');
                $('#errorText').text(err.error.message);
                $("#errorToast").toast("show");
            }
        });
    });
});