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
      },
      onSelect: function (dateText, inst) {
        const date = dateText;
        $('#floatingDate').val(dateText);
      }
    });
    // $('.ui-datepicker-calendar').find('a').attr('data-bs-toggle', 'modal');
    // $('.ui-datepicker-calendar').find('a').attr('data-bs-target', "#exampleModalCenteredScrollable");
  }
  );

  $('#myTable').DataTable({
    pageLength: 3,

    // optional: change the dropdown choices
    lengthMenu: [3, 6, 9, 12],
  });

  function formatDate(modalBody) {
    const dateArray = modalBody.find('#floatingDate').val().split('-');
    if (dateArray) {
      const [year, month, day] = dateArray;
      return `${day}-${month}-${year}`;
    }
  }

  function formatTime(modalBody) {
    const timeArray = modalBody.find('#floatingTime').val().split(':').map((element) => Number(element));
    if (timeArray) {
      const [hours, mins] = timeArray;
      if (hours === 0) {
        if (mins === 0) {
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        } else {
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} AM`
        }
      } else if (hours > 12) {
        return `${String(hours % 12).padStart(2, '0')}:${String(mins).padStart(2, '0')} PM`;
      }

      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} AM`
    }
  }

  function getCatagory(modalBody) {
    const catagory = modalBody.find(':selected').text();
    if (catagory !== 'Select a Catagory') {
      return catagory
    } else return null;
  }

  $('#save-event-data').click(function () {
    const modalBody = $(this).parent().prev();
    const title = modalBody.find('#floatingText').val();
    const date = formatDate(modalBody);
    const time = formatTime(modalBody);
    const catagory = getCatagory(modalBody);
    const location = modalBody.find('#floatingText2').val();
    const description = modalBody.find('#floatingTextarea2').val();
  });
});