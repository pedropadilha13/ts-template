const ajax = options =>
  new Promise((resolve, reject) => {
    $.ajax({
      cache: false,
      method: 'GET',
      success: resolve,
      error: reject,
      ...options
    });
  });

const showAlertMessage = options => {
  const alertMessage = $(
    `<div class="alert ${
      options.elementClass || 'alert-primary'
    } alert-dismissible show fade in" role="alert" id="myAlert">
          ${options.message || 'Ocorreu um erro. Por favor, tente mais tarde'}
          <button class="btn close" data-dismiss="alert" aria-label="close">
              <i class="fa fa-times"></i>
          </button>
      </div>`
  );
  $('body').append(alertMessage);
  setTimeout(() => {
    $(alertMessage).alert('close');
  }, options.time || 5000);
};

const clearFields = fields => {
  fields.forEach(field => {
    $(`#${field}`).val('');
  });
};

const loadingIcon = visible => {
  if (visible === true) {
    const spinner = $(
      '<div id="spinner"> <div class="blockG" id="rotateG_01"> </div> <div class="blockG" id="rotateG_02"> </div> <div class="blockG" id="rotateG_03"> </div> <div class="blockG" id="rotateG_04"> </div> <div class="blockG" id="rotateG_05"> </div> <div class="blockG" id="rotateG_06"> </div> <div class="blockG" id="rotateG_07"> </div> <div class="blockG" id="rotateG_08"> </div> </div>'
    );
    $('body').append(spinner);
  } else {
    $('#spinner').remove();
  }
};
