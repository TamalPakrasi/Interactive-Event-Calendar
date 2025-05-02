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




  let date = "";
  $("#datepicker").datepicker({
    numberOfMonths: 1,
    showOtherMonths: true,
    selectOtherMonths: true,
    showButtonPanel: false,
    defaultDate: new Date(),
    onSelect: function (dateText, inst) {
      const dateArray = dateText.split('/');
      if (dateArray) {
        const [month, day, year] = dateArray;
        date = `${year}-${month}-${day}`;
      }
      $('#floatingDate').val(date);
      setTimeout(function () {
        $(".ui-datepicker td a.ui-state-active").removeClass("ui-state-active");
      }, 0);
    },
    onUpdateDatepicker: function (inst) {
      // inst.dpDiv.find('.ui-datepicker-calendar a').attr('data-bs-toggle', 'modal').attr('data-bs-target', "#exampleModalCenteredScrollable");
    },
    beforeShowDay: function (date) {
      setTimeout(function () {
        $(".ui-datepicker td a.ui-state-active").removeClass("ui-state-active");
      }, 0);
      var today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return [true, 'ui-state-highlight', 'Today'];
      }
      return [true, ''];
    }
  });

  $('#myTable').DataTable({
    pageLength: 3,

    // optional: change the dropdown choices
    lengthMenu: [3, 6, 9, 12],
  });

  function formatDate(modalBody) {
    dateArray = modalBody.find('#floatingDate').val().split('-');
    if (dateArray) {
      const [year, month, day] = dateArray;
      return `${year}-${month}-${day}`;
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

  function targetDateInCalendar(theDate) {
    const allDateBoxes = $('#datepicker').find('.ui-datepicker td[data-handler="selectDay"] a');

    const filteredBoxes = allDateBoxes.filter(function () {
      return !$(this).hasClass('ui-priority-secondary')
    })

    $.each(filteredBoxes, function (index, dataBox) {
      const td = dataBox.closest('td');
      const day = parseInt($(dataBox).text());
      const month = parseInt($(td).attr('data-month'));
      const year = parseInt($(td).attr('data-year'));

      const d = new Date(year, month, day);

      const yyyy = d.getFullYear().toString();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');

      const date = `${yyyy}-${mm}-${dd}`;
      if (date === theDate) {
        console.log(dataBox);
        $(dataBox).addClass('has-event-class');
      }
    });
  }

  function handler() {
    const modalBody = $(this).parent().prev();
    const title = modalBody.find('#floatingText').val();
    const theDate = formatDate(modalBody);
    const time = formatTime(modalBody);
    const catagory = getCatagory(modalBody);
    const location = modalBody.find('#floatingText2').val();
    const description = modalBody.find('#floatingTextarea2').val();

    $('#datepicker').find('.ui-datepicker td[data-handler="selectDay"] a').removeClass('ui-state-active');
    targetDateInCalendar(theDate);
  }

  $('#save-event-data').click(handler)
});