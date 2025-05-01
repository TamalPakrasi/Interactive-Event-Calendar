$(document).ready(function () {
  const swiperEl = document.querySelector('swiper-container')

  const params = {
    injectStyles: [`
      .swiper-pagination-bullet {
        width: 100px;
        height: fit-content;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        color: #000;
        opacity: 1;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 0.5rem;
        padding: 0.5rem;
      }

      .swiper-pagination-bullet-active {
        color: #fff;
        background: #007aff;
      }
      `],
    pagination: {
      clickable: true,
      renderBullet: function (index, className) {
        if (index > 0) {
          return '<span class="' + className + '">' + "List View" + "</span>";
        } else {
          return '<span class="' + className + '">' + "Calendar View" + "</span>";
        }
      },
    },
  }

  Object.assign(swiperEl, params)

  swiperEl.initialize();

  $(function () {
    $("#datepicker").datepicker({
      numberOfMonths: 2,
      showOtherMonths: true,
      selectOtherMonths: true,
      showButtonPanel: false,
      defaultDate: new Date(),
      beforeShowDay: function (date) {
        var today = new Date();
        if (date.toDateString() === today.toDateString()) {
          return [true, 'ui-state-highlight', 'Today'];
        }
        return [true, ''];
      }
    });
  });

  $('#myTable').DataTable({
    pageLength: 3,

    // optional: change the dropdown choices
    lengthMenu: [3, 6, 9, 12],
  });
});