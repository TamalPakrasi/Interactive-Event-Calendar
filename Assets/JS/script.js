$(document).ready(function () {
  const descArr = [];
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

  var table = $('#myTable').DataTable({
    pageLength: 3,

    // optional: change the dropdown choices
    lengthMenu: [3, 6, 9, 12],

    paging: true,
    searching: true,

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

  function bgCol(catagory) {
    switch (catagory) {
      case 'Meeting':
        return 'bg-primary'
      case 'Work':
        return 'bg-danger'
      case 'Personal':
        return 'bg-purple'
      case 'Holiday':
        return 'bg-success'
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

  function updateModal(arr) {
    $('#floatingText21').val(arr[0]);
    $('#floatingDate3').val(arr[1]);
    $('#floatingTime4').val(arr[2]);
    $('#floatingInput5').val(arr[3]);
    $('#floatingText6').val(arr[4]);
    $('#floatingTextarea5').val(arr[5]);
  }

  function getRespectiveDesc(e, selectedTr) {
    e.stopImmediatePropagation();
    let description = "";
    const childrenArray = Array.from($('#myTable tbody').children());
    const trIndex = childrenArray.indexOf(selectedTr[0]);

    $.each(descArr, function (index, desc) {
      if (index === trIndex) {
        description = desc;
      }
    });

    return description;
  }

  function viewData(viewButton, e) {
    const prevsiblings = $(viewButton).parent().prevAll();
    const title = prevsiblings.eq(4).text();
    const date = prevsiblings.eq(3).text();
    const time = prevsiblings.eq(2).text();
    const catagory = prevsiblings.eq(1).find('div').text();
    const location = prevsiblings.eq(0).text();
    const description = getRespectiveDesc(e, $(viewButton).parents().eq(1));
    const arr = [title, date, time, catagory, location, description];

    $('#exampleModalCenteredScrollable2 .form-control').val('');
    updateModal([...arr]);

    $('#delete-row-button').click(function () {

    })
  }

  function tableFunc(arr) {
    const viewButton = `<button class="btn btn-primary" data-bs-toggle="modal"
            data-bs-target="#exampleModalCenteredScrollable2">View</button>`;

    const description = arr.pop();
    descArr.push(description);

    const str = JSON.stringify(arr)
    const newArr = JSON.parse(str);
    newArr.push(viewButton);

    const newNode = table.row.add(newArr).draw(false).node();

    $('#myTable tbody').append(newNode);

    $('#exampleModalCenteredScrollable .form-control, #exampleModalCenteredScrollable .form-select')
      .val('')
      .find('option:first').prop('selected', true);

    $('#myTable .btn').click(function (e) {
      viewData(this, e);
    });
  }

  function handler() {
    const modalBody = $(this).parent().prev();
    const title = modalBody.find('#floatingText').val().trim();
    const theDate = formatDate(modalBody);
    const time = formatTime(modalBody);
    const catagory = getCatagory(modalBody);
    const location = modalBody.find('#floatingText2').val().trim();
    const description = modalBody.find('#floatingTextarea2').val().trim();

    if (!title || !theDate || !time || !catagory || !location) {
      alert("FILL UP FIRST 5 FIELDS!!!");
      $('#exampleModalCenteredScrollable .form-control, #exampleModalCenteredScrollable .form-select')
      .val('')
      .find('option:first').prop('selected', true);
      return;
    }
    
    const desinedCatagory = `<div class="text-white badge ${bgCol(catagory)}" style="font-size:14px">${catagory}</div>`

    targetDateInCalendar(theDate);
    const eveArr = [title, theDate, time, desinedCatagory, location, description]
    tableFunc([...eveArr]);
  }

  $('#save-event-data').click(handler)
});