$(function(){
  var status = JSON.parse(localStorage.getItem('status')) || { time: 0, dt: 0, prev: 0 };
  var tid = 0;
  var update = function () {
    var t = new Date().getTime();
    if ((status.time += Math.round((t - status.prev) / 1000) * status.dt) <= 0) {
      stop(0);
    }
    status.prev = t;
    var s = ((parseInt(status.time) % 60) + 100).toString().substr(1);
    var m = ((parseInt(status.time / 60) % 60) + 100).toString().substr(1);
    var h = ((parseInt(status.time / 3600) % 100) + 100).toString().substr(1);
    $('#time').text([h, m, s].join(':'));
    localStorage.setItem('status', JSON.stringify(status));
  };
  var wake = function (k) {
    status = { time: status.time, dt: k != null ? k : status.dt, prev: new Date().getTime() };
    tid = setInterval(update, 1000);
    $('body').addClass('active');
    localStorage.setItem('status', JSON.stringify(status));
  };
  var stop = function (k) {
    status = { time: k != null ? k : status.time, dt: 0, prev: 0 };
    clearInterval(tid);
    $('body').removeClass('active');
    localStorage.setItem('status', JSON.stringify(status));
  };
  var spin = function (k) {
    var t = status.time + k;
    if (t >= 0) {
      status.time = t;
      update();
    }
  };
  $('#t-up').on('click touchend', function (e) {
    wake(+1);
    e.preventDefault();
  });
  $('#t-dn').on('click touchend', function (e) {
    wake(-1);
    e.preventDefault();
  });
  $('#h-up').on('click touchend', function (e) {
    spin(+3600);
    e.preventDefault();
  });
  $('#h-dn').on('click touchend', function (e) {
    spin(-3600);
    e.preventDefault();
  });
  $('#m-up').on('click touchend', function (e) {
    spin(+60);
    e.preventDefault();
  });
  $('#m-dn').on('click touchend', function (e) {
    spin(-60);
    e.preventDefault();
  });
  $('#s-up').on('click touchend', function (e) {
    spin(+1);
    e.preventDefault();
  });
  $('#s-dn').on('click touchend', function (e) {
    spin(-1);
    e.preventDefault();
  });
  $('#stop').on('click touchend', function (e) {
    stop(null);
    e.preventDefault();
  });
  $('button').on({
    touchstart: function (e) {
      $(this).addClass('active');
    },
    touchend: function (e) {
      $(this).removeClass('active');
    }
  });
  $(document).on('mousemove touchmove', function (e) {
    e.preventDefault();
  });
  update();
  status.dt && wake(null);
});

$(window).on('load resize', function () {
  var e = $(document.body);
  e.css('font-size', e.width() / 4 + 'px');
});

