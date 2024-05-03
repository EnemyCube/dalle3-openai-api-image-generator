$(document).ready(function () {
    $('#btn').click(function () {
        let imageSize = $('#sizeSelect').val();
        let imageStyle = $('#styleSelect').val();
        let imageQuality = $('#qualitySelect').val();

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
                style: imageStyle,
                quality: imageQuality,
            }),
            beforeSend: function () {
                $('#imageList').append(`
                <div id="placeholderCard" class="card m-3">
                    <div class="d-flex justify-content-end">
                    <button id="imageDown" class="btn btn-sm btn-secondary position-absolute m-2 col-1 placeholder disabled" aria-disabled="true" type="button"></button>
                    </div>
                <div class="row g-0">
                    <div class="col-md-4">
                        <svg id="genImage" class="bd-placeholder-img img-fluid" width="100%" height="256px"
                            xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image"
                            preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96"></rect>
                        </svg>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h2 class="card-title placeholder-glow" id="imageHead">
                                <span class="placeholder col-6"></span>
                            </h2>
                            <p class="card-text placeholder-glow" id="imageDesc">
                                <span class="placeholder col-7"></span>
                                <span class="placeholder col-4"></span>
                                <span class="placeholder col-4"></span>
                                <span class="placeholder col-6"></span>
                                <span class="placeholder col-8"></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                `);
            },
            success: function (data) {
                $('#btn').prop('disabled', false).text('Generate');

                data.data.forEach(item => {
                    $('#placeholderCard').attr('id', 'imageCard');

                    $("#genImage").last().replaceWith(`
                    <img class="img-fluid rounded-start" src="` + item.url + `" alt="` + item.revised_prompt + `">
                    `);

                    $("#imageHead").last().replaceWith('<h5 class="card-title">Revised Prompt</h5>');

                    $("#imageDesc").last().replaceWith(`<p class="bd-placeholder-img img-fluid rounded-start">` + item.revised_prompt + `</p>`);

                    $("#imageDown").last().replaceWith(`
                    <a class="btn btn-sm btn-light position-absolute m-2" href="` + item.url + `" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                            <path fill-rule="evenodd"
                                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                        </svg>
                    </a>
                    `);
                });
            },
            error: function (xhr, status, error) {
                const err = JSON.parse(xhr.responseText);
                $('#btn').prop('disabled', false).text('Generate');
                $('#errorText').text(err.error.message);
                $("#errorToast").toast("show");
                $('#placeholderCard').remove();
            }
        });
    });
});